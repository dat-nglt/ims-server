import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import axios from "axios";
import { Op } from "sequelize";
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
 * @param {number} userId
 * @param {number|null} work_id
 * @returns {Promise<{
 *   session: Object|null,
 *   work: Object|null,
 *   check_in_time: (Date|null),
 *   check_in_id: (number|null)
 * } | null>}
 */
export const getAlreadyOpenSession = async (userId, attendance_type_id, work_id) => {
  try {
    // Only consider sessions that started today (local server date)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const where = {
      user_id: userId,
      status: "open",
      attendance_type_id: attendance_type_id,
      started_at: { [Op.between]: [todayStart, todayEnd] },
    };

    // If caller provided a concrete work_id, search by it. If caller explicitly passed null (hub flow),
    // we search for sessions where work_id IS NULL (hub sessions).
    if (work_id != null) {
      where.work_id = work_id;
    } else {
      where.work_id = null;
    }

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
    logger.warn("Error in getAlreadyOpenSession:" + error.message);
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
 * @param {number} userId
 * @param {Object} [options] - Tùy chọn lọc
 * @param {boolean} [options.todayOnly=false] - Nếu true, chỉ lấy chấm công trong ngày hôm nay
 * @param {Date|string} [options.startDate] - Ngày bắt đầu (kết hợp với endDate để lọc theo khoảng)
 * @param {Date|string} [options.endDate] - Ngày kết thúc
 */
export const getAttendanceHistoryByUserIdService = async (userId, type = "day", options = {}) => {
  try {
    const { startDate, endDate } = options;
    const where = { user_id: userId };

    let start, end;
    const now = new Date();

    // 1. Xử lý logic thời gian dựa trên tham số 'type'
    switch (type) {
      case "today":
      case "day":
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;

      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;

      case "custom":
        if (startDate && endDate) {
          start = new Date(startDate);
          end = new Date(endDate);
        }
        break;

      default:
        // Mặc định nếu không truyền type rõ ràng
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
    }

    if (start && end) {
      where.check_in_time = { [Op.between]: [start, end] };
    }

    // 2. Thực hiện truy vấn (Gộp chung phần DB query)
    const attendances = await db.Attendance.findAll({
      where,
      include: [
        { model: db.Work, as: "work" },
        { model: db.Project, as: "project" },
        { model: db.AttendanceSession, as: "attendanceSession" },
        {
          model: db.AttendanceType,
          as: "attendanceType",
          attributes: ["id", "name", "code"],
        },
      ],
      order: [["check_in_time", "DESC"]],
    });

    return { success: true, data: attendances };
  } catch (error) {
    logger.error(`Error in getAttendanceHistoryService (${type}): ${error.message}`);
    throw error;
  }
};

/**
 * Lấy thời điểm chấm công sớm nhất và trễ nhất của một người theo attendance_type trong 1 ngày
 * @param {number} userId
 * @param {number|null} attendance_type_id
 * @param {Date|string} [date] - Ngày cần kiểm tra (theo timezone server)
 * @returns {{ earliest: Date|null, earliestAttendanceId: number|null, latest: Date|null, latestAttendanceId: number|null }}
 */
export const getDailyCheckInRangeByUser = async (userId, attendance_type_id, date = new Date()) => {
  try {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const where = {
      user_id: userId,
      check_in_time: { [Op.between]: [day, dayEnd] },
    };

    if (attendance_type_id != null) {
      where.attendance_type_id = attendance_type_id;
    }

    // Fetch daily attendances for the user (optionally filtered by type)
    const records = await db.Attendance.findAll({
      where,
      attributes: ["id", "attendance_type_id", "check_in_time", "check_out_time"],
      order: [["check_in_time", "ASC"]],
    });

    // Group by attendance_type_id (treat null as 'null') and compute earliest check-in and latest check-out
    const map = new Map();
    records.forEach((r) => {
      const key = r.attendance_type_id == null ? "__null" : String(r.attendance_type_id);
      if (!map.has(key)) {
        map.set(key, {
          attendance_type_id: r.attendance_type_id,
          earliest: r.check_in_time || null,
          earliestAttendanceId: r.id || null,
          latestCheckOut: r.check_out_time || null,
          latestAttendanceId: r.check_out_time ? r.id : null,
        });
        return;
      }

      const entry = map.get(key);
      // earliest check_in_time (records ordered asc, so first occurrence already earliest)
      if (r.check_in_time && (!entry.earliest || r.check_in_time < entry.earliest)) {
        entry.earliest = r.check_in_time;
        entry.earliestAttendanceId = r.id;
      }

      // latest check_out_time (we only consider records that have check_out_time)
      if (r.check_out_time && (!entry.latestCheckOut || r.check_out_time > entry.latestCheckOut)) {
        entry.latestCheckOut = r.check_out_time;
        entry.latestAttendanceId = r.id;
      }
    });

    const resultArray = [];
    for (const [, entry] of map.entries()) {
      let durationMinutes = null;
      if (entry.earliest && entry.latestCheckOut) {
        durationMinutes = Math.round((new Date(entry.latestCheckOut) - new Date(entry.earliest)) / 60000);
      }

      resultArray.push({
        attendance_type_id: entry.attendance_type_id,
        earliest: entry.earliest,
        earliestAttendanceId: entry.earliestAttendanceId,
        latestCheckOut: entry.latestCheckOut,
        latestAttendanceId: entry.latestAttendanceId,
        durationMinutes,
        duration: durationMinutes != null ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m` : null,
      });
    }

    // Sort output by attendance_type_id (nulls last)
    resultArray.sort((a, b) => {
      if (a.attendance_type_id == null && b.attendance_type_id == null) return 0;
      if (a.attendance_type_id == null) return 1;
      if (b.attendance_type_id == null) return -1;
      return a.attendance_type_id - b.attendance_type_id;
    });

    return { success: true, data: resultArray };
  } catch (error) {
    logger.warn(`Error in getDailyCheckInRangeByUser: ${error.message}`);
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
