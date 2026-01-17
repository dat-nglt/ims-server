import db from "../../../models/index.js";
import { Op } from "sequelize";
import logger from "../../../utils/logger.js";
import { toVietnamTimeISO } from "../../../utils/helper.js";
import { createNotificationService } from "../notification.service.js";
/**
 * @param {Object} checkInPayload
 */

export const checkInService = async (checkInPayload) => {
    try {
        let { user_id, work_id, project_id, attendance_type_id, office_location_id } = checkInPayload;

        // Xác thực công việc và người dùng
        const workForAttendance = await validateWork(work_id, user_id);

        // Xác thực loại chấm công
        const attendanceType = await validateAttendanceType(attendance_type_id);

        // Ràng buộc chấm công tăng ca (tách hàm để clean code)
        await ensureOvertimeApprovedForWork(user_id, work_id, attendanceType);

        const user = await validateUser(user_id);

        const existingSession = await checkExistingSession(
            user_id,
            attendance_type_id,
            work_id,
            office_location_id,
            attendanceType,
        );
        // Nếu tồn tại phiên chấm công mở cho công việc này hoặc đã chấm công xong công việc với ca chấm công trong ngày hôm nay, trả về thông tin phiên/chấm công đó và không tạo mới
        if (existingSession) {
            return existingSession;
        }

        await validateProject(project_id);

        // Chuẩn bị dữ liệu chấm công và tạo bản ghi chấm công
        const attendanceData = prepareAttendanceData(checkInPayload, attendanceType);

        // Tạo bản ghi chấm công
        const attendance = await createAttendanceRecord(attendanceData);

        // Chấm công thành công => cập nhật lại trạng thái công việc
        await updateWorkStatus(work_id);

        // Cập nhật lại trạng thái bản ghi phân bổ công việc => in_progress
        if (workForAttendance.workAssignment && workForAttendance.workAssignment.id) {
            await db.WorkAssignment.update(
                { assigned_status: "in_progress" },
                { where: { id: workForAttendance.workAssignment.id } },
            );
            logger.info(
                `Cập nhật phân bổ công việc với mã [${workForAttendance.workAssignment.id}] sang trạng thái đang thực hiện thành công`,
            );
        }

        // Tạo thông báo hệ thống về việc chấm công vào công việc
        await createCheckInNotification(user, workForAttendance);

        return {
            success: true,
            data: attendance,
            sessionId: attendance?.attendance_session_id,
            message: "Chấm công vào thành công",
        };
    } catch (error) {
        // Log the actual error message or object for easier debugging
        logger.warn("Error in attendanceService: " + (error && error.message ? error.message : error));
        return { success: false, message: error.message || "Chấm công vào thất bại", data: null };
    }
};

const validateUser = async (user_id) => {
    const existUser = await db.User.findByPk(user_id);
    if (!existUser) throw new Error("Không tìm thấy hồ sơ người dùng tương ứng");
    return existUser;
};

const validateWork = async (work_id, user_id) => {
    // work_id phải được cung cấp và là công việc cụ thể
    if (!work_id || work_id <= 0) {
        throw new Error("Không xác định được công việc để chấm công");
    }

    const workForCheckIn = await db.Work.findByPk(work_id);
    if (!workForCheckIn) throw new Error("Không xác định được công việc để chấm công");

    if (workForCheckIn.required_date) {
        const today = new Date();
        const workRequiredDate = new Date(workForCheckIn.required_date);
        if (workRequiredDate.toDateString() !== today.toDateString()) {
            throw new Error("Công việc không được thực hiện trong ngày hôm nay");
        }
    }

    const workAssignment = await db.WorkAssignment.findOne({ where: { work_id, technician_id: user_id } });
    if (!workAssignment) throw new Error("Người dùng không được phân bổ cho công việc này");

    workForCheckIn.workAssignment = workAssignment;

    return workForCheckIn;
};

const validateProject = async (project_id) => {
    if (project_id) {
        const project = await db.Project.findByPk(project_id);
        if (!project) throw new Error("Dự án không tồn tại trong hệ thống");
    }
};

const validateAttendanceType = async (attendance_type_id) => {
    if (attendance_type_id) {
        const attendanceType = await db.AttendanceType.findByPk(attendance_type_id);
        if (!attendanceType) throw new Error("Ca chấm không hợp lệ");
        return attendanceType;
    }
    return null;
};

/**
 * Ensure the user has an approved overtime request for the given work and overtime type.
 * Throws an Error if validation fails.
 */
const ensureOvertimeApprovedForWork = async (user_id, work_id, attendanceType) => {
    if (!attendanceType || (attendanceType.code !== "overtime_lunch" && attendanceType.code !== "overtime_night")) {
        return;
    }

    const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    const approvedOT = await db.OvertimeRequest.findOne({
        where: {
            work_id,
            status: "approved",
            requested_date: todayDate,
            overtime_type: attendanceType.code,
        },
        include: [
            {
                model: db.OvertimeRequestTechnician,
                as: "technicians",
                where: { technician_id: user_id, status: "approved" },
                required: true,
            },
        ],
    });

    if (!approvedOT) {
        throw new Error("Bạn không có yêu cầu tăng ca được phê duyệt cho công việc này và loại tăng ca này");
    }
};

const OVERTIME_CODES = ["overtime_lunch", "overtime_night"];

/**
 * Return start/end Date objects for the current day range (start inclusive, end exclusive)
 */
const getDayRange = (baseDate = new Date()) => {
    const start = new Date(baseDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start, end };
};

/**
 * Build where and include clauses for AttendanceSession queries.
 * For non-overtime session we exclude overtime attendance types via include filter.
 */
const buildSessionQuery = ({ user_id, work_id, office_location_id = null, start, end, status, isOvertime, attendance_type_id }) => {
    const where = {
        user_id,
        work_id,
        status,
        started_at: { [Op.between]: [start, end] },
    };

    if (isOvertime && attendance_type_id) {
        where.attendance_type_id = attendance_type_id;
    }

    if (office_location_id) {
        where.office_location_id = office_location_id;
    }

    const include = [{ model: db.Work, as: "work" }];
    if (!isOvertime) {
        include.push({
            model: db.AttendanceType,
            as: "attendance_type",
            attributes: ["id", "code"],
            where: { code: { [Op.notIn]: OVERTIME_CODES } },
            required: true,
        });
    }

    return { where, include };
};

const checkExistingSession = async (user_id, attendance_type_id, work_id, office_location_id = null, attendanceType = null) => {
    const isOvertime = attendanceType && OVERTIME_CODES.includes(attendanceType.code);

    const { start, end } = getDayRange();

    // 1️⃣ Open session check
    const openQuery = buildSessionQuery({ user_id, work_id, office_location_id, start, end, status: "open", isOvertime, attendance_type_id });

    const openSession = await db.AttendanceSession.findOne({
        where: openQuery.where,
        include: openQuery.include,
        order: [["started_at", "DESC"]],
    });

    if (openSession) {
        const latestAttendance = await db.Attendance.findOne({
            where: { attendance_session_id: openSession.id, user_id },
            order: [["check_in_time", "DESC"]],
            attributes: ["id", "check_in_time"],
        });

        const checkInAt = latestAttendance ? toVietnamTimeISO(latestAttendance.check_in_time) : null;

        return {
            success: false,
            alreadyCheckedIn: true,
            message: checkInAt
                ? `Bạn đã thực hiện chấm công vào lúc ${checkInAt.split("T")[1].substring(0, 5)} cho công việc này`
                : `Bạn đã có phiên chấm công hiện tại`,
            session: {
                id: openSession.id,
                work: openSession.work ? { id: openSession.work.id, title: openSession.work.title } : null,
                check_in_time: checkInAt,
                check_in_id: latestAttendance ? latestAttendance.id : null,
            },
        };
    }

    // 2️⃣ Closed session check
    const closedQuery = buildSessionQuery({ user_id, work_id, office_location_id, start, end, status: "closed", isOvertime, attendance_type_id });

    const closedSession = await db.AttendanceSession.findOne({
        where: closedQuery.where,
        include: closedQuery.include,
        order: [["started_at", "DESC"]],
    });

    if (closedSession) {
        const checkOutAttendance = await db.Attendance.findOne({
            where: { attendance_session_id: closedSession.id, user_id, check_out_time: { [Op.ne]: null } },
            order: [["check_out_time", "DESC"]],
            attributes: ["id", "check_in_time", "check_out_time"],
        });

        if (checkOutAttendance) {
            const checkOutAt = checkOutAttendance.check_out_time ? toVietnamTimeISO(checkOutAttendance.check_out_time) : null;

            return {
                success: false,
                alreadyCheckedOut: true,
                message: checkOutAt
                    ? `Bạn đã thực hiện chấm công ra lúc ${checkOutAt.split("T")[1].substring(0, 5)} cho công việc này. Không thể chấm công vào lại.`
                    : `Công việc này đã được hoàn thành trong ngày hôm nay. Không thể chấm công vào lại.`,
                session: {
                    id: closedSession.id,
                    work: closedSession.work ? { id: closedSession.work.id, title: closedSession.work.title } : null,
                    check_out_time: checkOutAt,
                    check_out_id: checkOutAttendance ? checkOutAttendance.id : null,
                },
            };
        }
    }

    return null;
};

const prepareAttendanceData = (checkInPayload, attendanceType) => {
    let {
        user_id,
        work_id,
        project_id = null,
        latitude,
        longitude,
        location_name = null,
        address = null,
        photo_url = null,
        notes = null,
        device_info = null,
        ip_address = null,
        attendance_type_id = null,
        distance_from_work = null,
        technicians = [],
        is_within_radius = undefined,
        violation_distance = undefined,
        check_in_metadata = undefined,
    } = checkInPayload;

    const photoUrlNormalized = photo_url ? String(photo_url).trim() : null;

    // Xử lý danh sách kỹ thuật viên tham gia chấm công
    const techArr = Array.isArray(technicians)
        ? technicians.map((t) => (typeof t === "string" ? parseInt(t, 10) : t))
        : technicians
          ? [typeof technicians === "string" ? parseInt(technicians, 10) : technicians]
          : [user_id];

    const parseId = (ID) => (ID != null && Number.isFinite(Number(ID)) ? parseInt(ID, 10) : ID);

    const uid = parseId(user_id);
    const wid = parseId(work_id);
    const pid = parseId(project_id);
    const attendanceTypeIdInt = parseId(attendance_type_id);

    // Helper function to parse time string (HH:MM format) to minutes
    const parseTimeToMinutes = (timeStr) => {
        if (!timeStr) return null;
        const parts = String(timeStr)
            .split(":")
            .map((p) => parseInt(p, 10) || 0);
        return (parts[0] || 0) * 60 + (parts[1] || 0);
    };

    // Kiểm tra nếu thời gian chấm công hiện tại đã sau thời gian bắt đầu của ca chấm công
    let isAfterStartTime = false;
    if (attendanceType && attendanceType.start_time) {
        try {
            const startTimeMinutes = parseTimeToMinutes(attendanceType.start_time);
            const checkInTimeObj = new Date();
            const checkInMinutes = checkInTimeObj.getHours() * 60 + checkInTimeObj.getMinutes();
            isAfterStartTime = checkInMinutes >= startTimeMinutes;
        } catch (e) {
            throw new Error("Lỗi khi phân tích thời gian bắt đầu của loại chấm công");
        }
    }

    // Tính toán khoảng cách vi phạm nếu có (sử dụng giá trị từ frontend nếu có, ngược lại tính toán)
    let calculatedViolationDistance = violation_distance !== undefined ? violation_distance : null;
    if (calculatedViolationDistance === null && distance_from_work && distance_from_work > 150) {
        calculatedViolationDistance = distance_from_work - 150;
    }

    // Xác định người dùng có chấm công trong phạm vi cho phép hay không (sử dụng giá trị từ frontend nếu có, ngược lại tính toán)
    const isWithinAtCheckIn = is_within_radius !== undefined ? is_within_radius : calculatedViolationDistance == null;
    // Thời gian không hợp lệ nếu chấm công sau thời gian bắt đầu ca chấm công
    let isValidTimeCheckIn = !isAfterStartTime;

    // Sử dụng check_in_metadata từ frontend nếu có
    const checkInMetadataValue = check_in_metadata !== undefined ? check_in_metadata : {};

    return {
        user_id: uid,
        work_id: wid,
        project_id: pid,
        check_in_time: new Date(),
        check_in_time_on_local: checkInPayload.check_in_time_on_local || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        location_name,
        address,
        photo_url: photoUrlNormalized,
        device_info,
        ip_address,
        is_within_radius: isWithinAtCheckIn,
        notes,
        attendance_type_id: attendanceTypeIdInt,
        violation_distance: calculatedViolationDistance,
        distance_from_work,
        technicians: techArr,
        is_valid_time_check_in: isValidTimeCheckIn,
        status: "checked_in",
        check_in_metadata: checkInMetadataValue,
    };
};

const createAttendanceRecord = async (data) => {
    return await db.Attendance.create(data);
};

const updateWorkStatus = async (wid) => {
    if (wid && wid > 0) {
        // Only update the work status if it's currently 'pending' to avoid overwriting more recent states
        // Use a conditional update for atomicity
        const [affectedRows] = await db.Work.update(
            { status: "in_progress" },
            { where: { id: wid, status: "pending" } },
        );

        return affectedRows > 0;
    }
    return false;
};

// Tạo thông báo chấm công vào công việc
const createCheckInNotification = async (user, workForAttendance) => {
    try {
        const title = `CHẤM CÔNG CÔNG VIỆC`;
        const message = `Người dùng ${user.name} đã chấm công vào công việc "${workForAttendance.title}".`;
        const related_work_id = workForAttendance.id;

        await createNotificationService({
            title,
            message,
            type: "check_in",
            related_work_id,
            priority: "medium",
            broadcast: false,
            systemNotification: {
                title,
                message,
                broadcast: false,
            },
        });

        logger.info(`Tạo thông báo chấm công công việc thành công`);
    } catch (err) {
        logger.error("Lỗi khi tạo thông báo chấm công công việc: " + err.message);
    }
};
