/**
 * Check-out cho khối văn phòng tại office-location
 * @param {Object} payload - {
 *   user_id, office_location_id, attendance_type_id, office_location_id_check_out (optional, for business_trip),
 *   photo_url_check_out, latitude_check_out, longitude_check_out, address_check_out,
 *   check_out_time_on_local, device_info, ip_address, distance_from_office,
 *   is_within_radius, violation_distance, check_out_metadata, attendance_category
 * }
 */

import db from "../../../models/index.js";
import logger from "../../../utils/logger.js";
import { createNotificationService } from "../notification.service.js";

export const checkOutOfficeService = async (payload) => {
  console.log("Check-Out Office Service Payload:", payload);
  try {
    let {
      user_id,
      office_location_id,
      office_location_id_check_out = null,
      attendance_type_id,
      attendance_category = "regular",
    } = payload;

    // 1. Validate attendance location
    const attendanceLocation = await validateAttendanceLocation(office_location_id);

    // 2. Validate check-out attendance location (nếu công tác)
    if (office_location_id_check_out && office_location_id_check_out > 0) {
      await validateAttendanceLocation(office_location_id_check_out);
    }

    // 3. Tìm bản ghi chấm công mở
    const attendance = await findOpenAttendanceRecord(user_id, office_location_id, attendance_type_id);

    // 4. Validate check-out conditions
    validateCheckOutConditions(attendance, payload);

    // 5. Chuẩn bị dữ liệu check-out
    const checkOutTime = new Date();
    const updateData = prepareCheckOutData(
      attendance,
      payload,
      checkOutTime,
      attendanceLocation,
      office_location_id_check_out
    );

    // 6. Cập nhật bản ghi chấm công
    await updateAttendanceRecord(attendance, updateData);

    // 7. Đóng phiên chấm công
    await updateSession(user_id, office_location_id, attendance_type_id, checkOutTime);

    // 8. Tạo thông báo
    await createOfficeCheckOutNotification(user_id, attendanceLocation, office_location_id_check_out, attendance_category);

    return {
      success: true,
      data: attendance,
      message: "Chấm công ra văn phòng thành công",
    };
  } catch (error) {
    logger.warn("Error in checkOutOfficeService: " + error.message);
    return {
      success: false,
      message: error.message || "Chấm công ra thất bại",
      data: null,
    };
  }
};

// ======================== Helper Functions ========================

const validateAttendanceLocation = async (office_location_id) => {
  if (!office_location_id) {
    throw new Error("Thiếu thông tin địa điểm để chấm công ra");
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

/**
 * Tìm bản ghi chấm công mở cho user + office_location + attendance_type
 */
const findOpenAttendanceRecord = async (user_id, office_location_id, attendance_type_id) => {
  // Tìm phiên chấm công mở liên kết với office location
  const session = await db.AttendanceSession.findOne({
    where: {
      user_id,
      office_location_id,
      attendance_type_id,
      status: "open",
      ended_at: null,
    },
  });

  if (!session) {
    throw new Error("Không tìm thấy phiên chấm công mở cho văn phòng này");
  }

  // Tìm bản ghi chấm công mở liên kết với phiên này
  const attendance = await db.Attendance.findOne({
    where: {
      attendance_session_id: session.id,
      user_id,
      office_location_id,
      check_out_time: null,
    },
    order: [["check_in_time", "DESC"]],
  });

  if (!attendance) {
    throw new Error("Người dùng chưa chấm công vào văn phòng này hoặc bản ghi chấm công không tồn tại");
  }

  return attendance;
};

const validateCheckOutConditions = (attendance, payload) => {
  if (attendance.check_out_time) {
    throw new Error("Người dùng đã thực hiện chấm công ra trước đó");
  }

  // Có thể không yêu cầu tọa độ cho công tác hoặc làm việc từ xa
  if (payload.attendance_category !== "business_trip" && payload.attendance_category !== "remote_work") {
    if (!payload.latitude_check_out || !payload.longitude_check_out) {
      throw new Error("Thiếu tọa độ chấm công ra");
    }
  }
};

/**
 * Chuẩn bị dữ liệu check-out cho địa điểm
 */
const prepareCheckOutData = (attendance, payload, checkOutTime, attendanceLocation, officeLocationCheckOut) => {
  const photoUrlCheckOut = payload.photo_url_check_out ? String(payload.photo_url_check_out).trim() : null;
  const latCheckOut = payload.latitude_check_out || null;
  const lngCheckOut = payload.longitude_check_out || null;
  const locationNameCheckOut = payload.location_name_check_out ? String(payload.location_name_check_out).trim() : null;
  const checkOutTimeOnLocal = payload.check_out_time_on_local ? new Date(payload.check_out_time_on_local) : null;
  const addressCheckOut = payload.address_check_out || null;
  const durationMinutes = Math.round((checkOutTime - attendance.check_in_time) / 60000);

  // Tính toán khoảng cách vi phạm nếu có (tính từ office_location_check_out nếu có)
  let calculatedViolationDistanceCheckOut = null;
  let isWithinAtCheckOut = true;
  let distanceFromOfficeCheckOut = null;

  // Xác định attendance location để check-out
  const targetLocationCheckOut = officeLocationCheckOut || null;

  // Nếu không phải công tác/remote và có tọa độ, tính toán khoảng cách
  if (
    payload.attendance_category !== "business_trip" &&
    payload.attendance_category !== "remote_work" &&
    latCheckOut &&
    lngCheckOut
  ) {
    // Nếu công tác, check-out tại địa điểm khác - tính từ office_location_check_out
    // Nếu không, check-out tại địa điểm ban đầu - tính từ office_location
    const targetLocation = targetLocationCheckOut || targetLocationCheckOut;

    if (targetLocation) {
      distanceFromOfficeCheckOut = calculateDistance(
        parseFloat(latCheckOut),
        parseFloat(lngCheckOut),
        parseFloat(targetLocation.latitude),
        parseFloat(targetLocation.longitude)
      );

      if (distanceFromOfficeCheckOut > targetLocation.radius) {
        calculatedViolationDistanceCheckOut = distanceFromOfficeCheckOut - targetLocation.radius;
        isWithinAtCheckOut = false;
      } else {
        isWithinAtCheckOut = true;
      }
    }
  }

  const isWithinAtCheckOutFinal =
    payload.is_within_radius_check_out !== undefined ? payload.is_within_radius_check_out : isWithinAtCheckOut;

  // Kiểm tra thời gian check-out hợp lệ
  let isValidTimeCheckOut = true;
  const attendanceType = attendance.attendanceType;

  if (attendanceType && attendanceType.end_time) {
    try {
      const parseToMinutes = (t) => {
        const parts = String(t)
          .split(":")
          .map((p) => parseInt(p, 10) || 0);
        return (parts[0] || 0) * 60 + (parts[1] || 0);
      };

      const endMinByAttendanceType = parseToMinutes(attendanceType.end_time);
      const actualCheckOutTime = new Date(checkOutTime);
      const actualCheckOutMin = actualCheckOutTime.getHours() * 60 + actualCheckOutTime.getMinutes();

      if (actualCheckOutMin < endMinByAttendanceType - 60) {
        // Check-out trước 60 phút so với end_time
        isValidTimeCheckOut = false;
      }
    } catch (e) {
      logger.warn("Failed to parse attendance type end_time: " + e.message);
    }
  }

  return {
    office_location_id_check_out: targetLocationCheckOut ? targetLocationCheckOut.id : null,
    check_out_time: checkOutTime,
    check_out_time_on_local: checkOutTimeOnLocal,
    duration_minutes: durationMinutes,
    photo_url_check_out: photoUrlCheckOut,
    address_check_out: addressCheckOut,
    latitude_check_out: latCheckOut ? parseFloat(latCheckOut) : null,
    longitude_check_out: lngCheckOut ? parseFloat(lngCheckOut) : null,
    location_name_check_out: locationNameCheckOut || (targetLocationCheckOut ? targetLocationCheckOut.name : null),
    distance_from_work_check_out: distanceFromOfficeCheckOut,
    is_within_radius_check_out: isWithinAtCheckOutFinal,
    violation_distance_check_out: calculatedViolationDistanceCheckOut,
    is_valid_time_check_out: isValidTimeCheckOut,
    status: "checked_out",
    check_out_metadata: payload.check_out_metadata || {},
  };
};

const updateAttendanceRecord = async (attendance, updateData) => {
  await attendance.update(updateData);
};

/**
 * Đóng phiên chấm công cho căn phòng
 */
const updateSession = async (user_id, office_location_id, attendance_type_id, checkOutTime) => {
  const session = await db.AttendanceSession.findOne({
    where: {
      user_id,
      office_location_id,
      attendance_type_id,
      status: "open",
      ended_at: null,
    },
  });

  if (session) {
    await session.update({
      ended_at: checkOutTime,
      status: "closed",
    });
    logger.info(`Closed session id=${session.id} for user=${user_id} office_location=${office_location_id}`);
  }
};

/**
 * Tính khoảng cách giữa hai tọa độ GPS (Haversine formula)
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
 * Tạo thông báo chấm công ra địa điểm
 */
const createOfficeCheckOutNotification = async (
  user_id,
  attendanceLocation,
  officeLocationCheckOut,
  attendance_category
) => {
  try {
    const user = await db.User.findByPk(user_id);
    if (!user) return;

    let message = `Nhân viên ${user.name} đã chấm công ra từ ${attendanceLocation.name}.`;

    if (attendance_category === "business_trip" && officeLocationCheckOut) {
      message = `Nhân viên ${user.name} đã kết thúc công tác tại ${officeLocationCheckOut.name}.`;
    } else if (attendance_category === "remote_work") {
      message = `Nhân viên ${user.name} đã kết thúc làm việc từ xa.`;
    }

    await createNotificationService({
      title: `CHẤM CÔNG RA VĂNG PHÒNG`,
      message,
      type: "office_check_out",
      priority: "low",
      broadcast: false,
      systemNotification: {
        title: `CHẤM CÔNG RA VĂNG PHÒNG`,
        message,
        broadcast: false,
      },
    });

    logger.info(`Tạo thông báo chấm công ra văn phòng thành công`);
  } catch (err) {
    logger.error("Lỗi khi tạo thông báo chấm công ra văn phòng: " + err.message);
  }
};
