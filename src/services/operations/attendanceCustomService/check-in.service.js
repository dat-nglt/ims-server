import db from "../../../models/index.js";
import { Op } from "sequelize";
import logger from "../../../utils/logger.js";
import { toVietnamTimeISO } from "../../../utils/helper.js";
import { createNotificationService } from "../notification.service.js";
import { getAlreadySession } from "../attendance.service.js";

/**
 * Check-in người dùng (hỗ trợ multi-technician)
 * @param {Object} checkInPayload - { user_id, work_id, project_id, latitude, longitude, ..., technicians: [id1, id2, ...], check_in_type_id }
 */

export const checkInService = async (checkInPayload) => {
  try {
    validateInput(checkInPayload);

    const { user_id, work_id, project_id, attendance_type_id } = checkInPayload;

    const user = await validateUser(user_id);

    const HUB_WORK_IDS = [-1, -2];

    await validateWork(work_id, user_id, HUB_WORK_IDS);

    await validateProject(project_id);

    const attendanceType = await validateAttendanceType(attendance_type_id);

    work_id = HUB_WORK_IDS.includes(work_id) ? work_id : null;

    const existingSession = await checkExistingSession(user_id, attendance_type_id, work_id);
    if (existingSession) {
      return existingSession;
    }

    const attendanceData = prepareAttendanceData(checkInPayload, user, attendanceType, HUB_WORK_IDS);

    const attendance = await createAttendanceRecord(attendanceData);

    await updateWorkStatus(work_id);

    await createCheckInNotification(user, work_id);

    return {
      success: true,
      data: attendance,
      sessionId: attendance?.attendance_session_id,
      message: "Chấm công vào thành công",
    };
  } catch (error) {
    logger.warn("Error in attendanceService:" + error.message);
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
  if (!user) throw new Error("Không tìm thấy hồ sơ người dùng của kỹ thuật viên");
  return user;
};

const validateWork = async (work_id, user_id, HUB_WORK_IDS) => {
  if (work_id && !HUB_WORK_IDS.includes(work_id)) {
    const work = await db.Work.findByPk(work_id);
    if (!work) throw new Error("Không tìm thấy công việc tương ứng");
    const workAssignment = await db.WorkAssignment.findOne({ where: { work_id, technician_id: user_id } });
    if (!workAssignment) throw new Error("Người dùng không được phân bổ cho công việc này");

    // Kiểm tra ngày yêu cầu công việc có phải trong hôm nay hay không
    if (work.required_date) {
      const today = new Date();
      const workRequiredDate = new Date(work.required_date);
      if (workRequiredDate.toDateString() !== today.toDateString()) {
        throw new Error("Công việc không được yêu cầu thực hiện trong ngày hôm nay");
      }
    }
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
    if (!attendanceType) throw new Error("Loại chấm công không tồn tại");
    return attendanceType;
  }
  return null;
};

const checkExistingSession = async (user_id, attendance_type_id, work_id) => {
  // Kiểm tra nếu người dùng có bất kì phiên chấm công mở nào trong ngày hôm nay
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const anySession = await db.AttendanceSession.findOne({
    where: {
      user_id,
      work_id,
      attendance_type_id,
      status: "open",
      started_at: { [Op.between]: [todayStart, todayEnd] },
    },
    include: [{ model: db.Work, as: "work" }],
    order: [["started_at", "DESC"]],
  });

  if (anySession) {
    console.log("Người dùng đã có phiên chấm công vào trước đó:", anySession.id);
    const latestAttendance = await db.Attendance.findOne({
      where: { attendance_session_id: anySession.id, user_id },
      order: [["check_in_time", "DESC"]],
      attributes: ["id", "check_in_time"],
    });

    const checkInAt = latestAttendance ? toVietnamTimeISO(latestAttendance.check_in_time) : null;

    return {
      success: false,
      alreadyCheckedIn: true,
      message: checkInAt
        ? `Người dùng đã chấm công vào phiên hiện tại lúc ${checkInAt.split("T")[0]} ${checkInAt
            .split("T")[1]
            .substring(0, 5)}`
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

const prepareAttendanceData = (checkInPayload, user, attendanceType, HUB_WORK_IDS) => {
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
  } = checkInPayload;

  const photoUrlNormalized = photo_url ? String(photo_url).trim() : null;

  if (HUB_WORK_IDS.includes(work_id) && !location_name) {
    location_name = work_id === -1 ? "warehouse" : "office";
  }

  const techArr = Array.isArray(technicians)
    ? technicians.map((t) => (typeof t === "string" ? parseInt(t, 10) : t))
    : technicians
    ? [typeof technicians === "string" ? parseInt(technicians, 10) : technicians]
    : [user_id];

  const parseId = (v) => (v != null && Number.isFinite(Number(v)) ? parseInt(v, 10) : v);
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

  // Check if check-in time is after attendance type start_time
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

  // Calculate violation_distance if distance_from_work > 150
  let calculatedViolationDistance = null;
  if (distance_from_work && distance_from_work > 150) {
    calculatedViolationDistance = distance_from_work - 150;
  }

  const isWithinAtCheckIn = distance_from_work <= 150 ? true : distance_from_work > 150 ? false : null;
  let isValidTimeCheckIn = !isAfterStartTime;

  const isHubCheckin = HUB_WORK_IDS.includes(wid);
  const createWorkId = isHubCheckin ? null : wid;
  const attendanceMetadata = isHubCheckin ? { hub: wid === -1 ? "warehouse" : "office" } : {};

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
    metadata: attendanceMetadata,
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

const createCheckInNotification = async (user, work_id) => {
  try {
    await createNotificationService({
      title: `Chấm công vào công việc`,
      message: `Người dùng ${user.name} đã chấm công vào công việc "${work_id}".`,
      type: "check_in",
      related_work_id: work_id,
      priority: "medium",
      broadcast: false,
      systemNotification: {
        title: `Chấm công vào công việc`,
        message: `Người dùng ${user.name} đã chấm công vào công việc "${work_id}".`,
        broadcast: false,
      },
    });
    logger.info("Tạo thông báo hệ thống cho việc tạo chấm công vào công việc với id công việc: " + work_id);
  } catch (err) {
    logger.error("Lỗi khi tạo thông báo hệ thống cho việc tạo chấm công vào công việc: " + err.message);
  }
};
