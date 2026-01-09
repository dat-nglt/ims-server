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
    let { user_id, work_id, project_id, attendance_type_id } = checkInPayload;

    const workForAttendance = await validateWork(work_id, user_id);

    const attendanceType = await validateAttendanceType(attendance_type_id);

    // Ràng buộc chấm công tăng ca
    if (attendanceType && (attendanceType.code === "overtime_lunch" || attendanceType.code === "overtime_night")) {
      // Kiểm tra xem kỹ thuật viên có được phê duyệt tăng ca cho công việc này hay không
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
            as: "requestTechnicians",
            where: { technician_id: user_id, status: "approved" },
            required: true,
          },
        ],
      });

      if (!approvedOT) {
        throw new Error(
          "Người dùng không có yêu cầu tăng ca được phê duyệt cho công việc này hoặc loại tăng ca này"
        );
      }
    }

    const user = await validateUser(user_id); // kiểm tra người dùng tồn tại trong hệ thống
    await validateProject(project_id);

    const existingSession = await checkExistingSession(user_id, attendance_type_id, work_id);

    // Nếu tồn tại phiên chấm công mở hoặc đã chấm công xong công việc với ca chấm công trong ngày hôm nay, trả về thông tin phiên/chấm công đó và không tạo mới
    if (existingSession) {
      return existingSession;
    }

    // Chuẩn bị dữ liệu chấm công và tạo bản ghi chấm công
    const attendanceData = prepareAttendanceData(checkInPayload, attendanceType);

    const attendance = await createAttendanceRecord(attendanceData);

    // Khi thực hiện chấm công vào, cập nhật trạng thái công việc sang "in_progress" nghĩa là đang thực hiện công việc
    await updateWorkStatus(work_id);

    // Tạo thông báo hệ thống về việc chấm công vào công việc
    await createCheckInNotification(user, work_id, workForAttendance);

    return {
      success: true,
      data: attendance,
      sessionId: attendance?.attendance_session_id,
      message: "Chấm công vào thành công",
    };
  } catch (error) {
    logger.warn("Error in attendanceService:" + error.messFage);
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

const checkExistingSession = async (user_id, attendance_type_id) => {
  const startOfCurrentDay = new Date(); /// Thời gian bắt đầu ngày hiện tại
  startOfCurrentDay.setHours(0, 0, 0, 0);
  const endOfCurrentDay = new Date(startOfCurrentDay); // Thời gian kết thúc ngày hiện tại
  endOfCurrentDay.setDate(endOfCurrentDay.getDate() + 1);

  // Kiển tra các phiên chấm công mở trong ngày hôm nay cho từng CA CHẤM CÔNG thuộc từng NGƯỜI DÙNG
  const whereCondition = {
    user_id,
    status: "open",
    attendance_type_id,
    started_at: { [Op.between]: [startOfCurrentDay, endOfCurrentDay] },
  };

  const anySession = await db.AttendanceSession.findOne({
    where: whereCondition,
    include: [{ model: db.Work, as: "work" }],
    order: [["started_at", "DESC"]],
  });

  // Nếu tồn tại phiên chấm công mở trên CA CHẤM CÔNG thuộc NGƯỜI DÙNG, trả về thông tin phiên chấm công đó và không cho phép chấm công mới
  if (anySession) {
    const latestAttendance = await db.Attendance.findOne({
      where: { attendance_session_id: anySession.id, user_id },
      order: [["check_in_time", "DESC"]],
      attributes: ["id", "check_in_time"],
    });

    // Định dạng lại thời gian check-in theo múi giờ Việt Nam
    const checkInAt = latestAttendance ? toVietnamTimeISO(latestAttendance.check_in_time) : null;

    return {
      success: false,
      alreadyCheckedIn: true,
      message: checkInAt
        ? `Người dùng đã chấm công vào lúc ${checkInAt.split("T")[1].substring(0, 5)}`
        : `Người dùng đã có phiên chấm công hiện tại`,
      session: {
        id: anySession.id,
        work: anySession.work ? { id: anySession.work.id, title: anySession.work.title } : null,
        check_in_time: checkInAt,
        check_in_id: latestAttendance ? latestAttendance.id : null,
      },
    };
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
    const [affectedRows] = await db.Work.update({ status: "in_progress" }, { where: { id: wid, status: "pending" } });

    return affectedRows > 0;
  }
  return false;
};

// Tạo thông báo chấm công vào công việc
const createCheckInNotification = async (user, workForAttendance) => {
  try {
    const title = `Chấm công vào công việc`;
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
