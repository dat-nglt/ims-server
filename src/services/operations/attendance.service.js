import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import axios from "axios";
import { Op } from "sequelize";
import * as cloudinaryService from "../storage/cloudinary.service.js";

// ==================== CHECK-IN/OUT SERVICES ====================

/**
 * Lấy danh sách tất cả attendance
 */
export const getAllAttendanceService = async () => {
  try {
    const attendances = await db.Attendance.findAll({
      include: [
        { model: db.User, as: "user" },
        { model: db.Work, as: "work" },
        { model: db.AttendanceSession, as: "attendanceSession" },
      ],
    });
    return { success: true, data: attendances };
  } catch (error) {
    logger.error("Error in getAllAttendanceService:" + error.message);
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
    logger.error("Error in getAttendanceByIdService:" + error.message);
    throw error;
  }
};

/**
 * Lấy thông tin phiên chấm công đang mở của user (nếu có). Trả về session, work và thời điểm check-in gần nhất.
 * @param {number} userId
 * @returns {Object|null} { session, work, check_in_time, check_in_id } hoặc null
 */
export const getOpenSessionSummaryByUser = async (userId) => {
  try {
    const session = await db.AttendanceSession.findOne({
      where: { user_id: userId, status: "open", ended_at: null },
      include: [{ model: db.Work, as: "work" }],
    });

    if (!session) return null;

    const latestAttendance = await db.Attendance.findOne({
      where: { attendance_session_id: session.id, user_id: userId, parent_attendance_id: null },
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
    logger.error("Error in getOpenSessionSummaryByUser:" + error.message);
    throw error;
  }
};

/**
 * Check-in người dùng (hỗ trợ multi-technician)
 * @param {Object} checkInData - { user_id, work_id, project_id, latitude, longitude, ..., technicians: [id1, id2, ...], check_in_type_id }
 */
export const checkInService = async (checkInData) => {
  try {
    // Support flexible input keys and types
    const {
      user_id,
      userId,
      work_id,
      workId,
      project_id,
      projectId,
      latitude,
      longitude,
      location_name,
      address,
      photo_urls,
      photo_url,
      photo,
      device_info,
      device,
      ip_address,
      notes,
      check_in_type_id,
      typeId,
      violation_distance,
      violationDistance,
      technicians = [],
      location,
    } = checkInData || {};

    const resolvedUserId = user_id || userId;
    const resolvedWorkId = work_id || workId || null;
    const resolvedProjectId = project_id || projectId || null;
    const lat = location?.lat ?? location?.latitude ?? (latitude != null ? parseFloat(latitude) : null);
    const lng = location?.lng ?? location?.longitude ?? (longitude != null ? parseFloat(longitude) : null);
    const locName = location?.name ?? location_name ?? null;
    const addr = location?.address ?? address ?? null;
    const photos = photo_urls ?? photo_url ?? photo ?? null;
    const photoPublicId = checkInData.photo_public_id ?? checkInData.photoPublicId ?? null;
    const resolvedDevice = device_info ?? device ?? null;
    const resolvedIp = ip_address ?? null;
    const resolvedTypeId = check_in_type_id ?? typeId ?? null;
    const resolvedViolation = violation_distance ?? violationDistance ?? null;

    // Basic validation
    if (!resolvedUserId) {
      throw new Error("Thiếu user_id");
    }
    if (lat == null || lng == null || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      throw new Error("Thiếu hoặc không hợp lệ: latitude và longitude");
    }

    // Kiểm tra user tồn tại
    const user = await db.User.findByPk(resolvedUserId);
    if (!user) throw new Error("Người dùng không tồn tại");

    // Normalize photos to a single URL (take first element if an array or JSON array string)
    let photoUrlNormalized = null;
    if (Array.isArray(photos)) {
      photoUrlNormalized = photos.length > 0 ? String(photos[0]) : null;
    } else if (typeof photos === "string") {
      // Try to parse JSON array string like '["url1","url2"]'
      try {
        const parsed = JSON.parse(photos);
        if (Array.isArray(parsed)) {
          photoUrlNormalized = parsed.length > 0 ? String(parsed[0]) : null;
        } else {
          photoUrlNormalized = photos;
        }
      } catch (e) {
        photoUrlNormalized = photos;
      }
    } else if (photos !== null && photos !== undefined) {
      photoUrlNormalized = String(photos);
    }

    // Validate work/project/type existence
    if (resolvedWorkId) {
      const work = await db.Work.findByPk(resolvedWorkId);
      if (!work) throw new Error("Công việc không tồn tại");
    }

    if (resolvedProjectId) {
      const project = await db.Project.findByPk(resolvedProjectId);
      if (!project) throw new Error("Dự án không tồn tại");
    }

    if (resolvedTypeId) {
      const checkInType = await db.AttendanceType.findByPk(resolvedTypeId);
      if (!checkInType) throw new Error("Loại chấm công không tồn tại");
    }

    // Kiểm tra session open (sử dụng helper để lấy thêm thông tin work và thời điểm check-in)
    const openSummary = await getOpenSessionSummaryByUser(resolvedUserId);
    if (openSummary && openSummary.session) {
      const wk = openSummary.work;
      const workInfo = wk ? { id: wk.id, title: wk.title } : null;
      const checkInAt = openSummary.check_in_time ? openSummary.check_in_time.toISOString() : null;

      // Trả về thông tin để controller hiển thị thông báo (HTTP 200)
      return {
        success: true,
        alreadyCheckedIn: true,
        message: `Người dùng đã check-in vào phiên công việc đang mở.`,
        session: {
          id: openSummary.session.id,
          work: workInfo,
          check_in_time: checkInAt,
          check_in_id: openSummary.check_in_id,
        },
      };
    }

    // Normalize technicians
    let techArr = [];
    if (Array.isArray(technicians) && technicians.length > 0) {
      techArr = technicians.map((t) => (typeof t === "string" ? parseInt(t, 10) : t));
    } else if (technicians) {
      techArr = [typeof technicians === "string" ? parseInt(technicians, 10) : technicians];
    } else {
      techArr = [resolvedUserId];
    }

    // Coerce numeric IDs and normalize photos
    const uid = Number.isFinite(Number(resolvedUserId)) ? parseInt(resolvedUserId, 10) : resolvedUserId;
    const wid = resolvedWorkId
      ? Number.isFinite(Number(resolvedWorkId))
        ? parseInt(resolvedWorkId, 10)
        : resolvedWorkId
      : null;
    const pid = resolvedProjectId
      ? Number.isFinite(Number(resolvedProjectId))
        ? parseInt(resolvedProjectId, 10)
        : resolvedProjectId
      : null;
    const typeIdInt = resolvedTypeId
      ? Number.isFinite(Number(resolvedTypeId))
        ? parseInt(resolvedTypeId, 10)
        : resolvedTypeId
      : null;

    // Create attendance record with improved validation error handling
    let attendance;
    try {
      attendance = await db.Attendance.create({
        user_id: uid,
        work_id: wid,
        project_id: pid,
        check_in_time: new Date(),
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        location_name: locName,
        address: addr,
        photo_url: photoUrlNormalized,
        status: "checked_in",
        device_info: resolvedDevice,
        ip_address: resolvedIp,
        notes,
        check_in_type_id: typeIdInt,
        violation_distance: resolvedViolation,
        technicians: techArr,
      });
    } catch (err) {
      // If a photo was uploaded directly by client (public id provided), attempt cleanup to avoid orphans
      if (photoPublicId) {
        try {
          await cloudinaryService.deleteImage(photoPublicId);
        } catch (delErr) {
          logger.error("Failed to cleanup public image after attendance create error: " + delErr.message);
        }
      }

      // Handle Sequelize validation/database errors with more context
      if (err && (err.name === "SequelizeValidationError" || err.name === "SequelizeDatabaseError")) {
        logger.error("Sequelize error creating Attendance", {
          message: err.message,
          errors: err.errors,
          payload: {
            user_id: uid,
            work_id: wid,
            project_id: pid,
            latitude: lat,
            longitude: lng,
            check_in_type_id: typeIdInt,
            technicians: techArr,
            photo_url: photoUrlNormalized,
          },
        });
        const messages =
          err.errors && Array.isArray(err.errors) ? err.errors.map((e) => e.message).join("; ") : err.message;
        throw new Error(`Validation error: ${messages}`);
      }
      throw err;
    }

    return { success: true, data: attendance, sessionId: attendance.attendance_session_id };
  } catch (error) {
    logger.error("Error in checkInService:" + error.message);
    throw error;
  }
};

/**
 * Check-out người dùng (từ phiên chấm công)
 */
export const checkOutService = async (id) => {
  try {
    const attendance = await db.Attendance.findByPk(id);
    if (!attendance) {
      throw new Error("Attendance không tồn tại");
    }

    if (attendance.check_out_time) {
      throw new Error("Đã check-out rồi");
    }

    const checkOutTime = new Date();
    const durationMinutes = Math.round((checkOutTime - attendance.check_in_time) / 60000);

    await attendance.update({
      check_out_time: checkOutTime,
      status: "checked_out",
      duration_minutes: durationMinutes,
    });

    return { success: true, data: attendance };
  } catch (error) {
    logger.error("Error in checkOutService:" + error.message);
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
    logger.error("Error in checkOutSessionService:" + error.message);
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
    logger.error("Error in getAttendanceHistoryByUserIdService:" + error.message);
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
    logger.error("Error in getTechniciansLocationsService:" + error.message);
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
    logger.error("Error in getOfficeLocationService:" + error.message);
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
    logger.error("Error in getTechnicianLocationHistoryService:", error.message);
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
    logger.error("Error in getJobItemsLocationsService:" + error.message);
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
    logger.error("Error in getGeocodingReverseService:" + error.message);
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
    logger.error("Error in getAttendanceSummaryService:" + error.message);
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
    logger.error("Error in getAttendanceStatisticsService:" + error.message);
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
    logger.error("Error in getAllAttendanceSessionsService:" + error.message);
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
    logger.error("Error in getAttendanceSessionByIdService:" + error.message);
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
    logger.error("Error in getActiveSessionByUserService:" + error.message);
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
    logger.error("Error in getClosedSessionsService:" + error.message);
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
    logger.error("Error in getAllAttendanceTypesService:" + error.message);
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
    logger.error("Error in getAttendanceTypeByIdService:" + error.message);
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
    logger.error("Error in createAttendanceTypeService:" + error.message);
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
    logger.error("Error in updateAttendanceTypeService:" + error.message);
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
    logger.error("Error in deleteAttendanceTypeService:" + error.message);
    throw error;
  }
};
