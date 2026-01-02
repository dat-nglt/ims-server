import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import axios from "axios";
import { Op } from "sequelize";
import * as cloudinaryService from "../storage/cloudinary.service.js";
import { toVietnamTimeISO } from "../../utils/helper.js";
import { createNotificationService } from "./notification.service.js";

// ==================== CHECK-IN/OUT SERVICES ====================

/**
 * Check-in người dùng (hỗ trợ multi-technician)
 * @param {Object} checkInData - { user_id, work_id, project_id, latitude, longitude, ..., technicians: [id1, id2, ...], check_in_type_id }
 */
export const checkInService = async (checkInData) => {
  try {
    const {
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
    } = checkInData || {};

    if (!user_id) throw new Error("Không xác định người dùng cho bản ghi chấm công");
    if (latitude == null || longitude == null || isNaN(Number(latitude)) || isNaN(Number(longitude))) {
      throw new Error("Thiếu tọa độ hợp lệ cho bản ghi chấm công");
    }

    const user = await db.User.findByPk(user_id);
    if (!user) throw new Error("Hệ thống không tìm thấy người dùng tham chiếu đến bản ghi chấm công");

    const normalizePhoto = (p) => {
      if (!p) return null;
      if (Array.isArray(p)) return p[0] ? String(p[0]) : null;
      if (typeof p === "string") {
        try {
          const parsed = JSON.parse(p);
          if (Array.isArray(parsed)) return parsed[0] ? String(parsed[0]) : null;
        } catch (e) {
          /* not JSON */
        }
        return p;
      }
      return String(p);
    };
    const photoUrlNormalized = normalizePhoto(photo_url);

    if (work_id) {
      const work = await db.Work.findByPk(work_id);
      if (!work) throw new Error("Công việc không tồn tại");
      const workAssignment = await db.WorkAssignment.findOne({ where: { work_id, technician_id: user_id } });
      if (!workAssignment) throw new Error("Người dùng không được gán cho công việc này");
    }

    if (project_id) {
      const project = await db.Project.findByPk(project_id);
      if (!project) throw new Error("Dự án không tồn tại");
    }

    let attendanceType = null;
    if (attendance_type_id) {
      attendanceType = await db.AttendanceType.findByPk(attendance_type_id);
      if (!attendanceType) throw new Error("Loại chấm công không tồn tại");
    }

    const openSummary = await getOpenSessionSummaryByUser(user_id, work_id);
    if (openSummary?.session) {
      console.log("User already has an open attendance session:", openSummary.session.id);
      const checkInAt = openSummary.check_in_time ? toVietnamTimeISO(openSummary.check_in_time) : null;
      return {
        success: true,
        alreadyCheckedIn: true,
        message: `Người dùng đã chấm công vào công việc lúc ${checkInAt.split("T")[0]} ${checkInAt
          .split("T")[1]
          .substring(0, 5)}`,
        session: {
          id: openSummary.session.id,
          work: openSummary.work ? { id: openSummary.work.id, title: openSummary.work.title } : null,
          check_in_time: checkInAt,
          check_in_id: openSummary.check_in_id,
        },
      };
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
        // Ignore parse errors
      }
    }

    // Calculate violation_distance if distance_from_work > 150
    let calculatedViolationDistance = null;
    if (distance_from_work != null && distance_from_work > 150) {
      calculatedViolationDistance = distance_from_work - 150;
    }

    // Determine validity based on new logic

    const isWithinAtCheckIn = distance_from_work <= 150 ? true : distance_from_work > 150 ? false : null;

    // is_valid_time_check_in is true when:
    // 1. Check-in time is after attendance type start_time, OR
    // 2. Within radius (distance_from_work <= 150)
    let isValidTimeCheckIn = null;
    if (isAfterStartTime) {
      isValidTimeCheckIn = false;
    }

    const attendance = await db.Attendance.create({
      user_id: uid,
      work_id: wid,
      project_id: pid,
      check_in_time: new Date(),
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
    });

    // Update work status to in_progress when check-in is successful
    if (wid) {
      await db.Work.update({ status: "in_progress" }, { where: { id: wid } });
    }

    try {
      // System notification about work creation
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
      logger.info(`System notification for work creation created for work id: ${createdWork.id}`);
    } catch (err) {
      logger.error("Failed to create system notification for work creation: " + err.message);
    }

    return { success: true, data: attendance, sessionId: attendance.attendance_session_id };
  } catch (error) {
    logger.warn("Error in attendanceService:" + error.message);
    throw error;
  }
};

/**
 * Check-out người dùng (từ phiên chấm công)
 * @param {number} id - Attendance ID (for backward compatibility)
 * @param {Object} criteria - { work_id, user_id, photo_url_check_out } (alternative method)
 * @param {string} photoUrlCheckOut - Photo URL for check-out (when using id)
 */
export const checkOutService = async (criteria) => {
  try {
    let attendance;
    // Find by work_id and user_id if criteria provided
    if (criteria && criteria.work_id && criteria.user_id && criteria.attendance_type_id) {
      attendance = await db.Attendance.findOne({
        where: {
          work_id: criteria.work_id,
          user_id: criteria.user_id,
          attendance_type_id: criteria.attendance_type_id,
        },
        order: [["check_in_time", "DESC"]], // Get the most recent check-in
      });
    } else {
      throw new Error("Thiếu thông tin chấm công ra (work_id, user_id)");
    }

    if (!attendance) {
      throw new Error("Người dùng chưa chấm công vào hoặc bản ghi chấm công không tồn tại");
    }

    if (attendance.check_out_time) {
      throw new Error("Người dùng đã thực hiện check-out trước đó");
    }

    // Kiểm tra người dùng có được gán cho công việc này hay không
    if (criteria.work_id) {
      const workAssignment = await db.WorkAssignment.findOne({
        where: {
          work_id: criteria.work_id,
          technician_id: criteria.user_id,
          assigned_status: { [db.Sequelize.Op.in]: ["pending", "accepted", "completed"] },
        },
      });

      if (!workAssignment) {
        throw new Error("Người dùng không được gán cho công việc này hoặc phân công đã bị từ chối/hủy");
      }
    }

    if (!criteria.latitude_check_out || !criteria.longitude_check_out) {
      throw new Error("Thiếu tọa độ chấm công ra");
    }

    const checkOutTime = new Date();
    const photoUrlCheckOut = criteria.photo_url_check_out || null;
    const latCheckOut = criteria.latitude_check_out || null;
    const lngCheckOut = criteria.longitude_check_out || null;
    const addressCheckOut = criteria.address_check_out || null;
    const distanceFromWorkCheckOut = criteria.distance_from_work_check_out || null;
    const durationMinutes = Math.round((checkOutTime - attendance.check_in_time) / 60000); // Thời gian làm việc tính bằng phút

    // Calculate violation_distance_check_out if distance_from_work_check_out > 150
    let calculatedViolationDistanceCheckOut = null;
    if (distanceFromWorkCheckOut != null && distanceFromWorkCheckOut > 150) {
      calculatedViolationDistanceCheckOut = distanceFromWorkCheckOut - 150;
    }

    // Determine is_within_radius_check_out based on distance
    // Set to false if distance_from_work_check_out > 150, otherwise true if within 150
    const isWithinAtCheckOut =
      distanceFromWorkCheckOut != null ? (distanceFromWorkCheckOut <= 150 ? true : false) : null;

    await attendance.update({
      check_out_time: checkOutTime,
      duration_minutes: durationMinutes,
      photo_url_check_out: photoUrlCheckOut,
      address_check_out: addressCheckOut,
      latitude_check_out: latCheckOut ? parseFloat(latCheckOut) : null,
      longitude_check_out: lngCheckOut ? parseFloat(lngCheckOut) : null,
      distance_from_work_check_out: distanceFromWorkCheckOut,
      is_within_radius_check_out: isWithinAtCheckOut,
      violation_distance_check_out: calculatedViolationDistanceCheckOut,
      status: "checked_out",
    });

    // Compute validity and violation reason based on business rules
    try {
      const fullAttendance = await db.Attendance.findByPk(attendance.id, {
        include: [
          { model: db.AttendanceType, as: "attendanceType" },
          { model: db.Work, as: "work" },
        ],
      });

      let updateData = { is_valid_time_check_out: true };
      let isEarlyCompletion = false;
      if (fullAttendance.attendanceType && fullAttendance.attendanceType.end_time && fullAttendance.check_in_time) {
        const parseToMinutes = (t) => {
          const parts = String(t)
            .split(":")
            .map((p) => parseInt(p, 10) || 0);
          return (parts[0] || 0) * 60 + (parts[1] || 0);
        };
        try {
          const endMin = parseToMinutes(fullAttendance.attendanceType.end_time);
          const co = new Date(checkOutTime);
          const checkOutMin = co.getHours() * 60 + co.getMinutes();
          if (checkOutMin < endMin) {
            isEarlyCompletion = true;
          }
        } catch (e) {
          // ignore parse errors
        }
      }

      // Nếu checkout sớm, kiểm tra có công việc khác được gán không
      // Logic:
      // - Nếu không có công việc khác: Đánh dấu hoàn thành sớm (early_completion_flag = true)
      //   và ghi nhận là hợp lệ (is_valid_time_check_out = true) để quản lý phê duyệt
      // - Nếu còn công việc khác: Không đánh dấu hoàn thành sớm, ghi nhận không hợp lệ
      //   (is_valid_time_check_out = false) vì kỹ thuật viên cần tiếp tục công việc khác
      if (isEarlyCompletion) {
        const otherAssignmentCount = await db.WorkAssignment.count({
          where: {
            technician_id: criteria.user_id,
            assigned_status: { [db.Sequelize.Op.in]: ["pending", "accepted"] },
            work_id: { [db.Sequelize.Op.ne]: criteria.work_id }, // Exclude current work
          },
        });

        if (otherAssignmentCount === 0) {
          // Không có công việc khác → Đánh dấu hoàn thành sớm
          updateData.early_completion_flag = true;
          updateData.early_completion_time = checkOutTime;
          updateData.early_completion_notes = criteria.early_completion_notes || "Hoàn thành sớm";
          updateData.early_completion_reviewed = null; // Pending review
          updateData.is_valid_time_check_out = false; // Valid để quản lý phê duyệt
        } else {
          // Còn công việc khác → Không hợp lệ, không đánh dấu early completion
          updateData.is_valid_time_check_out = true;
        }
      }

      await attendance.update(updateData);

      // Tạo notification cho manager để review early completion
      if (updateData.early_completion_flag) {
        try {
          const user = await db.User.findByPk(criteria.user_id);
          const work = await db.Work.findByPk(criteria.work_id);

          if (work && user) {
            await db.Notification.create({
              recipient_id: work.created_by, // Manager/Creator của công việc
              type: "early_completion_review",
              title: "Yêu cầu phê duyệt hoàn thành sớm",
              message: `Kỹ thuật viên ${user.name} đã hoàn thành công việc "${work.title}" sớm hơn thời gian quy định. Vui lòng xem xét phê duyệt.`,
              related_attendance_id: attendance.id,
              related_work_id: work.id,
              status: "unread",
            });
          }
        } catch (notificationErr) {
          logger.warn("Failed to create early completion notification: " + notificationErr.message);
        }
      }
    } catch (err) {
      logger.warn("Failed to compute attendance validity: " + err.message);
    }

    // Update work status to completed when check-out is successful
    if (criteria.work_id) {
      await db.Work.update({ status: "completed" }, { where: { id: criteria.work_id } });
    }

    try {
      // System notification about work creation
      await createNotificationService({
        title: `Chấm công ra công việc`,
        message: `Người dùng ${user.name} đã chấm công ra công việc "${work_id}".`,
        type: "check_out",
        related_work_id: work_id,
        priority: "medium",
        broadcast: false,
        systemNotification: {
          title: `Chấm công ra công việc`,
          message: `Người dùng ${user.name} đã chấm công ra công việc "${work_id}".`,
          broadcast: false,
        },
      });
      logger.info(`System notification for work creation created for work id: ${createdWork.id}`);
    } catch (err) {
      logger.error("Failed to create system notification for work creation: " + err.message);
    }

    return { success: true, data: attendance, message: "Check-out thành công" };
  } catch (error) {
    logger.warn("Error in checkOutService:" + error.message);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả attendance
 */
export const getAllAttendanceService = async () => {
  try {
    const attendances = await db.Attendance.findAll({
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "name", "email", "avatar_url", "phone", "zalo_id", "employee_id"],
        },
        {
          model: db.Work,
          as: "work",
          attributes: [
            "id",
            "work_code",
            "title",
            "status",
            "required_time_hour",
            "required_time_minute",
            "location_lat",
            "location_lng",
            "required_date",
            "location",
          ],
        },
        { model: db.Project, as: "project", attributes: ["id", "name"] },
        { model: db.AttendanceSession, as: "attendanceSession" },
        {
          model: db.AttendanceType,
          as: "attendanceType",
          attributes: ["id", "name", "code", "start_time", "end_time", "default_duration_minutes"],
        },
      ],
    });
    return { success: true, data: attendances };
  } catch (error) {
    logger.warn("Error in getAllAttendanceService:" + error.message);
    throw error;
  }
};

/**
 * Lấy attendance theo ID
 */
export const getAttendanceByIdService = async (id) => {
  try {
    const attendance = await db.Attendance.findByPk(id, {
      include: [
        { model: db.User, as: "user" },
        { model: db.Work, as: "work" },
        { model: db.AttendanceSession, as: "attendanceSession" },
      ],
    });
    if (!attendance) {
      throw new Error("Attendance không tồn tại");
    }
    return { success: true, data: attendance };
  } catch (error) {
    logger.warn("Error in getAttendanceByIdService:" + error.message);
    throw error;
  }
};

/**
 * Lấy thông tin phiên chấm công đang mở của user (nếu có). Trả về session, work và thời điểm check-in gần nhất.
 * @param {number} userId
 * @returns {Object|null} { session, work, check_in_time, check_in_id } hoặc null
 */
export const getOpenSessionSummaryByUser = async (userId, work_id) => {
  try {
    // Only consider sessions that started today (local server date)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    console.log("start of today:", todayStart);
    console.log("end of today:", todayEnd);

    const where = {
      user_id: userId,
      started_at: { [Op.between]: [todayStart, todayEnd] },
    };

    if (work_id != null) where.work_id = work_id;

    const session = await db.AttendanceSession.findOne({
      where,
    });

    if (!session) return null;

    const latestAttendance = await db.Attendance.findOne({
      where: { attendance_session_id: session.id, user_id: userId },
      order: [["check_in_time", "DESC"]],
      attributes: ["id", "check_in_time"],
    });

    return {
      session,
      work: session.work || null,
      check_in_time: latestAttendance ? latestAttendance.check_in_time : null,
      check_in_id: latestAttendance ? latestAttendance.id : null,
    };
  } catch (error) {
    logger.warn("Error in getOpenSessionSummaryByUser:" + error.message);
    throw error;
  }
};

/**
 * Check-out từ phiên chấm công (AttendanceSession)
 */
export const checkOutSessionService = async (sessionId) => {
  try {
    const session = await db.AttendanceSession.findByPk(sessionId);
    if (!session) {
      throw new Error("Phiên chấm công không tồn tại");
    }

    if (session.status === "closed") {
      throw new Error("Phiên chấm công đã kết thúc");
    }

    const checkOutTime = new Date();

    // Cập nhật session sang closed
    await session.update({
      ended_at: checkOutTime,
      status: "closed",
    });

    // Hook trong model sẽ tự động xử lý cập nhật attendance records và xóa session
    return { success: true, data: session };
  } catch (error) {
    logger.warn("Error in checkOutSessionService:" + error.message);
    throw error;
  }
};

/**
 * Lấy lịch sử attendance của một người dùng
 */
export const getAttendanceHistoryByUserIdService = async (userId) => {
  try {
    const attendances = await db.Attendance.findAll({
      where: { user_id: userId },
      include: [
        { model: db.Work, as: "work" },
        { model: db.AttendanceSession, as: "attendanceSession" },
      ],
      order: [["check_in_time", "DESC"]],
    });

    return { success: true, data: attendances };
  } catch (error) {
    logger.warn("Error in getAttendanceHistoryByUserIdService:" + error.message);
    throw error;
  }
};

// ==================== LOCATION SERVICES ====================

/**
 * Lấy danh sách vị trí kỹ thuật viên (từ LocationHistory)
 */
export const getTechniciansLocationsService = async ({ includeOffline, includeHistory }) => {
  try {
    const whereClause = includeOffline ? "" : "AND lh.status != 'offline'";
    const locations = await db.sequelize.query(
      `
      SELECT lh.user_id, lh.latitude, lh.longitude, lh.status, lh.timestamp, u.name
      FROM location_histories lh
      INNER JOIN users u ON lh.user_id = u.id
      WHERE lh.timestamp = (
        SELECT MAX(timestamp)
        FROM location_histories
        WHERE user_id = lh.user_id
      ) ${whereClause}
      ORDER BY lh.timestamp DESC
    `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const data = locations.map((loc) => ({
      id: loc.user_id,
      name: loc.name,
      lat: parseFloat(loc.latitude),
      lng: parseFloat(loc.longitude),
      online: loc.status !== "offline",
      lastUpdate: loc.timestamp,
      status: loc.status,
    }));

    return { success: true, data };
  } catch (error) {
    logger.warn("Error in getTechniciansLocationsService:" + error.message);
    throw error;
  }
};

/**
 * Lấy vị trí văn phòng (từ OfficeLocation)
 */
export const getOfficeLocationService = async () => {
  try {
    const office = await db.OfficeLocation.findOne({
      where: { type: "office", is_active: true },
    });

    if (!office) {
      throw new Error("Không tìm thấy vị trí văn phòng");
    }

    const data = {
      id: office.id,
      name: office.name,
      lat: parseFloat(office.latitude),
      lng: parseFloat(office.longitude),
      address: office.address,
      phone: office.phone,
      workingHours: office.working_hours,
    };

    return { success: true, data };
  } catch (error) {
    logger.warn("Error in getOfficeLocationService:" + error.message);
    throw error;
  }
};

/**
 * Lấy lịch sử vị trí kỹ thuật viên (từ LocationHistory)
 */
export const getTechnicianLocationHistoryService = async ({ technicianId, startDate, endDate, limit }) => {
  try {
    const where = { user_id: technicianId };
    if (startDate && endDate) {
      where.timestamp = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const history = await db.LocationHistory.findAll({
      where,
      order: [["timestamp", "DESC"]],
      limit,
      attributes: ["latitude", "longitude", "timestamp", "status"],
    });

    const data = history.map((h) => ({
      lat: parseFloat(h.latitude),
      lng: parseFloat(h.longitude),
      timestamp: h.timestamp,
      status: h.status,
    }));

    return { success: true, data };
  } catch (error) {
    logger.warn("Error in getTechnicianLocationHistoryService:", error.message);
    throw error;
  }
};

/**
 * Lấy vị trí công việc (từ Work model)
 */
export const getJobItemsLocationsService = async ({ status, includeArchived }) => {
  try {
    const where = {};
    if (status) where.status = status;
    if (!includeArchived) where.status = { [Op.ne]: "cancelled" };

    const works = await db.Work.findAll({
      where,
      attributes: ["id", "title", "location_lat", "location_lng", "status", "priority"],
    });

    const data = works.map((work) => ({
      id: work.id,
      projectId: work.project_id,
      name: work.title,
      lat: parseFloat(work.location_lat),
      lng: parseFloat(work.location_lng),
      status: work.status,
      priority: work.priority,
      address: work.location || "",
    }));

    return { success: true, data };
  } catch (error) {
    logger.warn("Error in getJobItemsLocationsService:" + error.message);
    throw error;
  }
};

/**
 * Xử lý geocoding reverse (gọi API bên ngoài, e.g., OpenStreetMap Nominatim)
 */
export const getGeocodingReverseService = async ({ lat, lng, language }) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        format: "json",
        lat,
        lon: lng,
        "accept-language": language,
        zoom: 18,
        addressdetails: 1,
      },
    });

    const data = response.data;
    const result = {
      displayName: data.display_name,
      fullAddress: data.display_name,
      district: data.address?.county || data.address?.city_district,
      ward: data.address?.suburb || data.address?.neighbourhood,
      city: data.address?.city || data.address?.town,
      road: data.address?.road,
    };

    return { success: true, data: result };
  } catch (error) {
    logger.warn("Error in getGeocodingReverseService:" + error.message);
    throw error;
  }
};

// ==================== ATTENDANCE SUMMARY & STATISTICS ====================

/**
 * Lấy dữ liệu tổng quan chấm công theo khoảng thời gian
 * @param {Object} params - { startDate, endDate, departmentId, employeeId }
 * @returns {Array} - Mảng nhân viên với dates object
 */
export const getAttendanceSummaryService = async (params) => {
  try {
    const { startDate, endDate, departmentId, employeeId } = params;

    // Validate date objects
    if (
      !(startDate instanceof Date) ||
      isNaN(startDate.getTime()) ||
      !(endDate instanceof Date) ||
      isNaN(endDate.getTime())
    ) {
      throw new Error("Invalid date parameters");
    }

    // Query Attendance với include User
    const attendances = await db.Attendance.findAll({
      where: {
        check_in_time: {
          [Op.between]: [startDate, endDate],
        },
        ...(employeeId && { user_id: employeeId }),
      },
      include: [
        {
          model: db.User,
          as: "user",
          where: departmentId ? { department_id: departmentId } : {},
        },
      ],
      order: [["check_in_time", "ASC"]],
    });

    // Tổng hợp dữ liệu theo user_id và ngày
    const summaryMap = {};
    attendances.forEach((attendance) => {
      const user = attendance.user;
      const dateStr = attendance.check_in_time.toISOString().split("T")[0]; // YYYY-MM-DD
      const userId = user.id;

      if (!summaryMap[userId]) {
        summaryMap[userId] = {
          id: userId,
          name: user.name,
          department: user.profile && user.profile.department ? user.profile.department : user.department || "N/A",
          dates: {},
        };
      }

      // Xác định status dựa trên logic
      let status = "absent";
      if (attendance.status === "on_leave") {
        status = "sick";
      } else if (attendance.check_in_time && attendance.check_out_time) {
        const checkInHour = attendance.check_in_time.getHours();
        status = checkInHour > 8 ? "late" : "present";
      }

      // Tính duration (giờ:phút)
      const durationMinutes = attendance.duration_minutes || 0;
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      const duration = `${hours}h ${minutes}m`;

      // Location
      const location = attendance.is_within_radius ? "✓" : "⚠";

      // Check-in/out time
      const checkInTime = attendance.check_in_time.toTimeString().substring(0, 5);
      const checkOutTime = attendance.check_out_time ? attendance.check_out_time.toTimeString().substring(0, 5) : null;

      summaryMap[userId].dates[dateStr] = {
        status,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        duration,
        location,
      };
    });

    // Chuyển thành array
    const summary = Object.values(summaryMap);

    return { success: true, data: summary };
  } catch (error) {
    logger.warn("Error in getAttendanceSummaryService:" + error.message);
    throw error;
  }
};

/**
 * Lấy thống kê chấm công
 * @param {Object} params - { startDate, endDate, departmentId, employeeId }
 * @returns {Object} - { totalPresent, totalLate, totalAbsent, totalSick }
 */
export const getAttendanceStatisticsService = async (params) => {
  try {
    const summary = await getAttendanceSummaryService(params);
    const stats = {
      totalPresent: 0,
      totalLate: 0,
      totalAbsent: 0,
      totalSick: 0,
    };

    summary.data.forEach((person) => {
      Object.values(person.dates).forEach((record) => {
        if (record.status === "present") stats.totalPresent++;
        else if (record.status === "late") stats.totalLate++;
        else if (record.status === "absent") stats.totalAbsent++;
        else if (record.status === "sick") stats.totalSick++;
      });
    });

    return { success: true, data: stats };
  } catch (error) {
    logger.warn("Error in getAttendanceStatisticsService:" + error.message);
    throw error;
  }
};

// ==================== ATTENDANCE SESSION SERVICES ====================

/**
 * Lấy danh sách tất cả attendance sessions
 */
export const getAllAttendanceSessionsService = async () => {
  try {
    const sessions = await db.AttendanceSession.findAll({
      include: [
        { model: db.User, as: "user" },
        { model: db.Work, as: "work" },
        { model: db.Project, as: "project" },
      ],
      order: [["started_at", "DESC"]],
    });
    return { success: true, data: sessions };
  } catch (error) {
    logger.warn("Error in getAllAttendanceSessionsService:" + error.message);
    throw error;
  }
};

/**
 * Lấy attendance session theo ID
 */
export const getAttendanceSessionByIdService = async (id) => {
  try {
    const session = await db.AttendanceSession.findByPk(id, {
      include: [
        { model: db.User, as: "user" },
        { model: db.Work, as: "work" },
        { model: db.Project, as: "project" },
        { model: db.Attendance, as: "attendances" },
      ],
    });
    if (!session) {
      throw new Error("Phiên chấm công không tồn tại");
    }
    return { success: true, data: session };
  } catch (error) {
    logger.warn("Error in getAttendanceSessionByIdService:" + error.message);
    throw error;
  }
};

/**
 * Lấy attendance session của người dùng (active sessions)
 */
export const getActiveSessionByUserService = async (userId) => {
  try {
    const session = await db.AttendanceSession.findOne({
      where: {
        user_id: userId,
        status: "open",
        ended_at: null,
      },
      include: [
        { model: db.User, as: "user" },
        { model: db.Work, as: "work" },
        { model: db.Attendance, as: "attendances" },
      ],
    });
    return { success: true, data: session };
  } catch (error) {
    logger.warn("Error in getActiveSessionByUserService:" + error.message);
    throw error;
  }
};

/**
 * Lấy các attendance session đã đóng trong khoảng thời gian
 */
export const getClosedSessionsService = async ({ startDate, endDate, userId }) => {
  try {
    const where = {
      status: "closed",
      ended_at: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (userId) {
      where.user_id = userId;
    }

    const sessions = await db.AttendanceSession.findAll({
      where,
      include: [
        { model: db.User, as: "user" },
        { model: db.Work, as: "work" },
      ],
      order: [["ended_at", "DESC"]],
    });

    return { success: true, data: sessions };
  } catch (error) {
    logger.warn("Error in getClosedSessionsService:" + error.message);
    throw error;
  }
};

// ==================== ATTENDANCE TYPE SERVICES ====================

/**
 * Lấy danh sách tất cả loại chấm công
 */
export const getAllAttendanceTypesService = async () => {
  try {
    const types = await db.CheckInType.findAll({
      where: { active: true },
      order: [["code", "ASC"]],
    });
    return { success: true, data: types };
  } catch (error) {
    logger.warn("Error in getAllAttendanceTypesService:" + error.message);
    throw error;
  }
};

/**
 * Lấy loại chấm công theo ID
 */
export const getAttendanceTypeByIdService = async (id) => {
  try {
    const type = await db.CheckInType.findByPk(id);
    if (!type) {
      throw new Error("Loại chấm công không tồn tại");
    }
    return { success: true, data: type };
  } catch (error) {
    logger.warn("Error in getAttendanceTypeByIdService:" + error.message);
    throw error;
  }
};

/**
 * Tạo loại chấm công mới
 */
export const createAttendanceTypeService = async (typeData) => {
  try {
    const { code, name, default_duration_minutes, start_time, end_time, description } = typeData;

    if (!code || !name) {
      throw new Error("Thiếu thông tin bắt buộc: code, name");
    }

    const type = await db.CheckInType.create({
      code,
      name,
      default_duration_minutes,
      start_time,
      end_time,
      description,
      active: true,
    });

    return { success: true, data: type };
  } catch (error) {
    logger.warn("Error in createAttendanceTypeService:" + error.message);
    throw error;
  }
};

/**
 * Cập nhật loại chấm công
 */
export const updateAttendanceTypeService = async (id, typeData) => {
  try {
    const type = await db.CheckInType.findByPk(id);
    if (!type) {
      throw new Error("Loại chấm công không tồn tại");
    }

    await type.update(typeData);
    return { success: true, data: type };
  } catch (error) {
    logger.warn("Error in updateAttendanceTypeService:" + error.message);
    throw error;
  }
};

/**
 * Xóa loại chấm công (soft delete)
 */
export const deleteAttendanceTypeService = async (id) => {
  try {
    const type = await db.CheckInType.findByPk(id);
    if (!type) {
      throw new Error("Loại chấm công không tồn tại");
    }

    await type.update({ active: false });
    return { success: true, message: "Xóa loại chấm công thành công" };
  } catch (error) {
    logger.warn("Error in deleteAttendanceTypeService:" + error.message);
    throw error;
  }
};
