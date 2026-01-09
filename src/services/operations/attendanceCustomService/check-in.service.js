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
    validateInput(checkInPayload);

    let { user_id, work_id, project_id, attendance_type_id } = checkInPayload;

    const user = await validateUser(user_id); // kiểm tra người dùng tồn tại trong hệ thống

    const HUB_WORK_IDS = [-1, -2]; // -1: warehouse, -2: office để phân biệt chấm công hub và công việc cụ thể

    const workForAttendance = await validateWork(work_id, user_id, HUB_WORK_IDS);

    await validateProject(project_id);

    // Trả về thông tin ca chấm công nếu được cung cấp
    const attendanceType = await validateAttendanceType(attendance_type_id);

    // Kiểm tra ca làm việc (theo attendance type) và quyền chấm tăng ca của phân công
    if (attendanceType && (attendanceType.code == "overtime_lunch" || attendanceType.code == "overtime_night")) {
      const allowOvertime = workForAttendance?.workAssignment?.allow_overtime === true;
      if (!allowOvertime) {
        throw new Error("Người dùng không được yêu cầu chấm công tăng ca cho công việc này");
      }
    }

    // Hệ thống ghi nhận work_id là null nếu là chấm công hub
    work_id = HUB_WORK_IDS.includes(work_id) ? null : work_id;

    const existingSession = await checkExistingSession(user_id, attendance_type_id, work_id);

    // Nếu tồn tại phiên chấm công mở hoặc đã chấm công xong công việc với ca chấm công trong ngày hôm nay, trả về thông tin phiên/chấm công đó và không tạo mới
    if (existingSession) {
      return existingSession;
    }

    // Chuẩn bị dữ liệu chấm công và tạo bản ghi chấm công
    const attendanceData = prepareAttendanceData(checkInPayload, attendanceType, HUB_WORK_IDS);

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

// Helper functions for checkInService optimization
const validateInput = (checkInPayload) => {
  const { user_id, latitude, longitude } = checkInPayload || {};
  if (!user_id) throw new Error("Không tìm thấy hồ sơ làm việc của kỹ thuật viên");
  if (latitude == null || longitude == null || isNaN(Number(latitude)) || isNaN(Number(longitude))) {
    throw new Error("Thiếu tọa độ hợp lệ cho bản ghi chấm công");
  }
};

const validateUser = async (user_id) => {
  const user = await db.User.findByPk(user_id);
  if (!user) throw new Error("Không tìm thấy hồ sơ người dùng tương ứng");
  return user;
};

const validateWork = async (work_id, user_id, HUB_WORK_IDS) => {
  //Trường hợp work_id không phải hub, kiểm tra công việc và phân bổ công việc
  if (work_id && !HUB_WORK_IDS.includes(work_id)) {
    const work = await db.Work.findByPk(work_id);
    if (!work) throw new Error("Không tìm thấy công việc tương ứng");
    const workAssignment = await db.WorkAssignment.findOne({ where: { work_id, technician_id: user_id } });
    if (!workAssignment) throw new Error("Người dùng không được phân bổ cho công việc này");

    // Gắn thông tin phân công vào kết quả trả về để các bước sau có thể kiểm tra allow_overtime
    work.workAssignment = workAssignment;

    // Kiểm tra ngày yêu cầu công việc có phải trong hôm nay hay không
    if (work.required_date) {
      const today = new Date();
      const workRequiredDate = new Date(work.required_date);
      if (workRequiredDate.toDateString() !== today.toDateString()) {
        throw new Error("Công việc không được thực hiện trong ngày hôm nay");
      }
    }

    return work;
  }
};

const validateProject = async (project_id) => {
  if (project_id) {
    const project = await db.Project.findByPk(project_id);
    if (!project) throw new Error("Dự án không tồn tại");
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

const checkExistingSession = async (user_id, attendance_type_id, work_id) => {
  // Kiểm tra nếu người dùng có bất kì phiên chấm công mở nào trong ngày hôm nay
  const startOfCurrentDay = new Date();
  startOfCurrentDay.setHours(0, 0, 0, 0);
  const endOfCurrentDay = new Date(startOfCurrentDay);
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

  // Trường hợp không tồn tại phiên chấm công mở
  // Kiểm tra nếu NGƯỜI DÙNG đã chấm công vào công việc cụ thể với CA CHẤM CÔNG trong ngày hôm nay
  if (work_id != null) {
    const alreadyCheckInAttendance = await db.Attendance.findOne({
      where: {
        user_id,
        work_id,
        attendance_type_id,
        check_in_time: { [Op.between]: [startOfCurrentDay, endOfCurrentDay] },
        check_out_time: { [Op.ne]: null },
      },
      order: [["check_in_time", "DESC"]],
      attributes: ["id", "check_in_time", "check_out_time"],
    });

    if (alreadyCheckInAttendance) {
      const checkedOutAt = alreadyCheckInAttendance.check_out_time
        ? toVietnamTimeISO(alreadyCheckInAttendance.check_out_time)
        : null;
      return {
        success: false,
        alreadyCheckedOut: true,
        message: checkedOutAt
          ? `Người dùng đã chấm công xong công việc này lúc ${checkedOutAt.split("T")[1].substring(0, 5)}`
          : `Người dùng đã hoàn tất chấm công cho công việc này trong ngày hôm nay`,
        attendance: {
          id: alreadyCheckInAttendance.id,
          check_in_time: alreadyCheckInAttendance.check_in_time,
          check_out_time: alreadyCheckInAttendance.check_out_time,
        },
      };
    }
  }

  return null;
};

const prepareAttendanceData = (checkInPayload, attendanceType, HUB_WORK_IDS) => {
  let {
    user_id,
    work_id = null,
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
    metadata = undefined,
    check_in_metadata = undefined,
  } = checkInPayload;

  const photoUrlNormalized = photo_url ? String(photo_url).trim() : null;

  if (HUB_WORK_IDS.includes(work_id) && !location_name) {
    location_name = work_id === -1 ? "Kho Vật Tư" : "Văn phòng Proshop";
  }

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
  const isWithinAtCheckIn = is_within_radius !== undefined ? is_within_radius : (calculatedViolationDistance == null);
  // Thời gian không hợp lệ nếu chấm công sau thời gian bắt đầu ca chấm công
  let isValidTimeCheckIn = !isAfterStartTime;

  const isHubCheckin = HUB_WORK_IDS.includes(wid);
  const createWorkId = isHubCheckin ? null : wid;
  // Sử dụng check_in_metadata từ frontend nếu có
  const checkInMetadataValue = check_in_metadata !== undefined ? check_in_metadata : {};

  return {
    user_id: uid,
    work_id: createWorkId,
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
    await db.Work.update({ status: "in_progress" }, { where: { id: wid } });
  }
};

// Cập nhật tối ưu lại hàm tạo thông báo chấm công
const createCheckInNotification = async (user, workId, workForAttendance) => {
  try {
    let title = `Chấm công vào công việc`;
    let message = `Người dùng ${user.name} đã chấm công.`;
    let related_work_id = null;

    // Nếu là công việc cụ thể (không phải hub), dùng thông tin công việc; ngược lại ghi thông báo hub
    if (workId != null && workId !== -1 && workId !== -2 && workForAttendance) {
      message = `Người dùng ${user.name} đã chấm công vào công việc "${workForAttendance.title}".`;
      related_work_id = workForAttendance.id;
    } else if (workId === -1) {
      title = `Chấm công tại kho`;
      message = `Người dùng ${user.name} đã chấm công tại Kho Vật Tư.`;
    } else if (workId === -2) {
      title = `Chấm công tại văn phòng`;
      message = `Người dùng ${user.name} đã chấm công tại Văn phòng Proshop.`;
    }

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

    logger.info(
      related_work_id
        ? `Tạo thông báo hệ thống cho việc tạo chấm công vào công việc với id công việc: ${related_work_id}`
        : `Tạo thông báo hệ thống cho việc chấm công tại hub: ${workId}`
    );
  } catch (err) {
    logger.error("Lỗi khi tạo thông báo hệ thống cho việc tạo chấm công: " + err.message);
  }
};
