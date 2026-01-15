/**
 * Check-in cho khối văn phòng tại office-location
 * @param {Object} payload - {
 *   user_id, office_location_id, attendance_type_id, department_id (optional),
 *   photo_url, latitude, longitude, address, location_name, device_info, ip_address,
 *   check_in_time_on_local, attendance_category (regular|business_trip|remote_work|work_from_home),
 *   check_in_metadata, distance_from_office, is_within_radius, violation_distance
 * }
 */

import db from "../../../models/index.js";
import logger from "../../../utils/logger.js";
import { Op } from "sequelize";
import { createNotificationService } from "../notification.service.js";

export const checkInOfficeService = async (payload) => {
  console.log("Check-In Office Service Payload:", payload);
  try {
    let {
      user_id,
      office_location_id,
      attendance_type_id,
      department_id = null,
      attendance_category = "regular",
    } = payload;

    // 1. Validate user
    const user = await validateUser(user_id);

    // 2. Validate attendance location
    const attendanceLocation = await validateAttendanceLocation(office_location_id);

    // 3. Validate attendance type
    const attendanceType = await validateAttendanceType(attendance_type_id);

    // 4. Kiểm tra phiên chấm công mở trong ngày hôm nay tại office này
    const existingSession = await checkExistingOfficeSession(user_id, office_location_id, attendance_type_id);

    if (existingSession) {
      return existingSession;
    }

    // 5. Chuẩn bị dữ liệu chấm công
    const attendanceData = prepareOfficeAttendanceData(payload, attendanceType, attendanceLocation);

    // 6. Tạo bản ghi chấm công
    const attendance = await createAttendanceRecord(attendanceData);

    // 7. Tạo thông báo
    await createOfficeCheckInNotification(user, attendanceLocation, attendance_category);

    return {
      success: true,
      data: attendance,
      sessionId: attendance?.attendance_session_id,
      message: "Chấm công vào văn phòng thành công",
    };
  } catch (error) {
    logger.warn("Error in checkInOfficeService: " + error.message);
    return {
      success: false,
      message: error.message || "Chấm công vào thất bại",
      data: null,
    };
  }
};

// ======================== Helper Functions ========================

const validateUser = async (user_id) => {
  const existUser = await db.User.findByPk(user_id);
  if (!existUser) throw new Error("Không tìm thấy hồ sơ người dùng tương ứng");
  return existUser;
};

const validateAttendanceLocation = async (office_location_id) => {
  if (!office_location_id) {
    throw new Error("Thiếu thông tin địa điểm để chấm công");
  }

  const attendanceLocation = await db.AttendanceLocation.findByPk(office_location_id);
  if (!attendanceLocation) {
    throw new Error("Không tìm thấy thông tin địa điểm");
  }

  if (!attendanceLocation.is_active) {
    throw new Error("Địa điểm này hiện không hoạt động");
  }

  return attendanceLocation;
};

const validateAttendanceType = async (attendance_type_id) => {
  if (attendance_type_id) {
    const attendanceType = await db.AttendanceType.findByPk(attendance_type_id);
    if (!attendanceType) throw new Error("Loại chấm công không hợp lệ");
    return attendanceType;
  }
  return null;
};

/**
 * Kiểm tra phiên chấm công mở trong ngày hôm nay
 * cho user + office_location + attendance_type
 */
const checkExistingOfficeSession = async (user_id, office_location_id, attendance_type_id) => {
  const startOfCurrentDay = new Date();
  startOfCurrentDay.setHours(0, 0, 0, 0);
  const endOfCurrentDay = new Date(startOfCurrentDay);
  endOfCurrentDay.setDate(endOfCurrentDay.getDate() + 1);

  // Kiểm tra xem đã có session mở trong ngày hôm nay không
  const anySession = await db.AttendanceSession.findOne({
    where: {
      user_id,
      status: "open",
      attendance_type_id,
      office_location_id, // Specific to attendance location
      started_at: { [Op.between]: [startOfCurrentDay, endOfCurrentDay] },
    },
    include: [{ model: db.AttendanceLocation, as: "attendanceLocation" }],
    order: [["started_at", "DESC"]],
  });

  if (anySession) {
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
        ? `Bạn đã thực hiện chấm công vào lúc ${checkInAt.split("T")[1].substring(0, 5)}`
        : `Bạn đã có phiên chấm công hiện tại`,
      session: {
        id: anySession.id,
        attendanceLocation: anySession.attendanceLocation
          ? { id: anySession.attendanceLocation.id, name: anySession.attendanceLocation.name }
          : null,
        check_in_time: checkInAt,
        check_in_id: latestAttendance ? latestAttendance.id : null,
      },
    };
  }
  return null;
};

/**
 * Chuẩn bị dữ liệu chấm công cho địa điểm
 */
const prepareOfficeAttendanceData = (payload, attendanceType, attendanceLocation) => {
  let {
    user_id,
    office_location_id,
    attendance_type_id = null,
    latitude,
    longitude,
    location_name = null,
    address = null,
    photo_url = null,
    notes = null,
    device_info = null,
    ip_address = null,
    attendance_category = "regular",
    distance_from_work = null, // Sẽ tính toán từ office_location
    is_within_radius = undefined,
    violation_distance = undefined,
    check_in_metadata = undefined,
    check_in_time_on_local = null,
  } = payload;

  const photoUrlNormalized = photo_url ? String(photo_url).trim() : null;

  // Xác định có cần kiểm tra vị trí hay không
  let requireLocationVerification = true;
  if (attendance_category === "business_trip" || attendance_category === "remote_work") {
    requireLocationVerification = false;
  }

  // Nếu có attendance_location, tính toán khoảng cách từ vị trí người dùng đến địa điểm
  let calculatedViolationDistance = null;
  let isWithinLocationRadius = true;

  if (requireLocationVerification && latitude && longitude && attendanceLocation) {
    const distanceFromLocation = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(attendanceLocation.latitude),
      parseFloat(attendanceLocation.longitude)
    );

    // Nếu vượt quá radius của địa điểm, tính violation distance
    if (distanceFromLocation > attendanceLocation.radius) {
      calculatedViolationDistance = distanceFromLocation - attendanceLocation.radius;
      isWithinLocationRadius = false;
    } else {
      isWithinLocationRadius = true;
    }

    distance_from_work = distanceFromLocation; // Dùng lại field này cho địa điểm
  }

  const isWithinAtCheckIn = is_within_radius !== undefined ? is_within_radius : isWithinLocationRadius;

  // Kiểm tra nếu thời gian chấm công hiện tại đã sau thời gian bắt đầu của ca chấm công
  let isValidTimeCheckIn = true;
  if (attendanceType && attendanceType.start_time) {
    try {
      const parseToMinutes = (t) => {
        const parts = String(t)
          .split(":")
          .map((p) => parseInt(p, 10) || 0);
        return (parts[0] || 0) * 60 + (parts[1] || 0);
      };

      const startMinByAttendanceType = parseToMinutes(attendanceType.start_time);
      const actualCheckInTime = new Date();
      const actualCheckInMin = actualCheckInTime.getHours() * 60 + actualCheckInTime.getMinutes();

      if (actualCheckInMin > startMinByAttendanceType + 60) {
        // Muộn hơn 60 phút so với start_time
        isValidTimeCheckIn = false;
      }
    } catch (e) {
      logger.warn("Failed to parse attendance type start_time: " + e.message);
    }
  }

  const checkInMetadataValue = check_in_metadata !== undefined ? check_in_metadata : {};

  return {
    user_id: parseInt(user_id, 10),
    office_location_id: parseInt(office_location_id, 10),
    // Không có work_id cho địa điểm chấm công
    work_id: null,
    project_id: null,
    check_in_time: new Date(),
    check_in_time_on_local: check_in_time_on_local || null,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    location_name: location_name || attendanceLocation.name,
    address: address || attendanceLocation.address,
    photo_url: photoUrlNormalized,
    device_info,
    ip_address,
    is_within_radius: isWithinAtCheckIn,
    notes,
    attendance_type_id: attendance_type_id ? parseInt(attendance_type_id, 10) : null,
    violation_distance: calculatedViolationDistance,
    distance_from_work,
    is_valid_time_check_in: isValidTimeCheckIn,
    status: "checked_in",
    check_in_metadata: checkInMetadataValue,
    attendance_category,
    require_location_verification: requireLocationVerification,
  };
};

const createAttendanceRecord = async (data) => {
  // Create attendance and let the hook handle session creation
  const attendance = await db.Attendance.create(data);

  // Create session if not already created by hook
  if (!attendance.attendance_session_id) {
    const session = await db.AttendanceSession.create({
      user_id: attendance.user_id,
      office_location_id: attendance.office_location_id,
      attendance_type_id: attendance.attendance_type_id,
      started_at: attendance.check_in_time,
      status: "open",
      latitude: attendance.latitude,
      longitude: attendance.longitude,
    });

    attendance.attendance_session_id = session.id;
    await attendance.save();
  }

  return attendance;
};

/**
 * Tính khoảng cách giữa hai tọa độ GPS (Haversine formula)
 * @param {number} lat1 - Vĩ độ điểm 1
 * @param {number} lon1 - Kinh độ điểm 1
 * @param {number} lat2 - Vĩ độ điểm 2
 * @param {number} lon2 - Kinh độ điểm 2
 * @returns {number} - Khoảng cách tính bằng mét
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Bán kính Trái đất (mét)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c); // Trả về mét
};

/**
 * Convert time to Vietnam timezone ISO string
 */
const toVietnamTimeISO = (date) => {
  const d = new Date(date);
  return new Date(d.getTime() + 7 * 60 * 60 * 1000).toISOString();
};

/**
 * Tạo thông báo chấm công vào địa điểm
 */
const createOfficeCheckInNotification = async (user, attendanceLocation, attendance_category) => {
  try {
    let message = `Nhân viên ${user.name} đã chấm công vào tại ${attendanceLocation.name}.`;

    if (attendance_category === "business_trip") {
      message = `Nhân viên ${user.name} đã báo công tác tại ${attendanceLocation.name}.`;
    } else if (attendance_category === "remote_work") {
      message = `Nhân viên ${user.name} đã báo làm việc từ xa.`;
    }

    await createNotificationService({
      title: `CHẤM CÔNG VĂNG PHÒNG`,
      message,
      type: "office_check_in",
      priority: "low",
      broadcast: false,
      systemNotification: {
        title: `CHẤM CÔNG VĂNG PHÒNG`,
        message,
        broadcast: false,
      },
    });

    logger.info(`Tạo thông báo chấm công văn phòng thành công`);
  } catch (err) {
    logger.error("Lỗi khi tạo thông báo chấm công văn phòng: " + err.message);
  }
};
