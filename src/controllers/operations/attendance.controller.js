import logger from "../../utils/logger.js";
import * as attendanceService from "../../services/operations/attendance.service.js";
import { checkInService } from "../../services/operations/attendanceCustomService/check-in.service.js";
import { checkOutService } from "../../services/operations/attendanceCustomService/check-out.service.js";

// ==================== CHECK-IN/OUT CONTROLLERS ====================

/**
 * Lấy danh sách tất cả attendance
 */
export const getAllAttendanceController = async (req, res) => {
  try {
    const result = await attendanceService.getAllAttendanceService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách attendance thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAllAttendanceController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy attendance theo ID
 */
export const getAttendanceByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceService.getAttendanceByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin attendance thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceByIdController:`, error.message);
    res.status(404).json({ error: error.message });
  }
};

/**
 * Check-in người dùng
 */
export const checkInController = async (req, res) => {
  try {
    const {
      user_id,
      work_id,
      project_id = null,
      latitude,
      longitude,
      location_name,
      address,
      attendance_type_id,
      photo_url,
      notes,
      distance_from_work,
      technicians,
      check_in_time_on_local = null,
      is_within_radius = null,
      violation_distance = null,
      metadata = null,
      check_in_metadata = null,
    } = req.body || {};

    // Build normalized payload
    const payload = {
      user_id: user_id,
      work_id: work_id || null,
      project_id: project_id || null,
      latitude: latitude || null,
      longitude: longitude || null,
      location_name: location_name || null,
      address: address || null,
      photo_url: photo_url || null,
      notes: notes || null,
      device_info: req.headers["user-agent"] || null, // Lấy thông tin thiết bị từ header
      ip_address: req.headers["x-forwarded-for"] || null, // Lấy IP từ header (nếu có)
      attendance_type_id: attendance_type_id || null,
      distance_from_work: distance_from_work || null,
      technicians: Array.isArray(technicians) ? technicians : technicians ? [technicians] : [],
      check_in_time_on_local: check_in_time_on_local || null,
      is_within_radius: is_within_radius !== null ? is_within_radius : undefined,
      violation_distance: violation_distance !== null ? violation_distance : undefined,
      metadata: metadata || undefined,
      check_in_metadata: check_in_metadata || undefined,
    };

    if (!payload.user_id) {
      throw new Error("Không xác định được thông tin người dùng");
    }

    if (payload.latitude == null || payload.longitude == null) {
      throw new Error("Không xác định được toạ độ người dùng");
    }

    const result = await checkInService(payload);

    // If service reports an already-open session, return 200 with info for client to show notification
    if (result && result.alreadyCheckedIn) {
      return res.status(200).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in attendanceController:` + error.message);
    res.status(200).json({ success: false, message: "Chấm công thất bại", data: null });
  }
};

/**
 * Check-out người dùng
 */
export const checkOutController = async (req, res) => {
  try {
    const {
      work_id,
      user_id,
      photo_url_check_out = null,
      latitude_check_out = null,
      longitude_check_out = null,
      location_name_check_out = null,
      distance_from_work_check_out = null,
      attendance_type_id,
      address_check_out = null,
      check_out_time_on_local = null,
      is_within_radius_check_out = null,
      violation_distance_check_out = null,
      metadata = null,
      check_out_metadata = null,
    } = req.body || {};

    // Build normalized payload
    const payload = {
      work_id: work_id || null,
      user_id: user_id || null,
      photo_url_check_out: photo_url_check_out ? String(photo_url_check_out).trim() : null,
      latitude_check_out: latitude_check_out || null,
      longitude_check_out: longitude_check_out || null,
      location_name_check_out: location_name_check_out ? String(location_name_check_out).trim() : null,
      distance_from_work_check_out: distance_from_work_check_out || null,
      attendance_type_id: attendance_type_id || null,
      address_check_out: address_check_out || null,
      check_out_time_on_local: check_out_time_on_local || null,
      device_info: req.headers["user-agent"] || null,
      ip_address: req.headers["x-forwarded-for"] || null,
      is_within_radius_check_out: is_within_radius_check_out !== null ? is_within_radius_check_out : undefined,
      violation_distance_check_out: violation_distance_check_out !== null ? violation_distance_check_out : undefined,
      metadata: metadata || undefined,
      check_out_metadata: check_out_metadata || undefined,
    };

    if (!payload.user_id) {
      throw new Error("Không xác định được user_id (thiếu token hoặc user_id trong body)");
    }

    if (payload.work_id == null) {
      throw new Error("Thiếu work_id để check-out");
    }

    if (!payload.photo_url_check_out || !payload.latitude_check_out || !payload.longitude_check_out) {
      throw new Error("Thiếu thông tin chấm công ra (photo_url_check_out, latitude_check_out, longitude_check_out)");
    }

    const result = await checkOutService(payload);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in checkOutController:` + error.message);
    res.status(200).json({ success: false, message: "Chấm công thất bại", data: null });
  }
};

/**
 * Lấy lịch sử attendance của một người dùng
 */
export const getAttendanceHistoryByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await attendanceService.getAttendanceHistoryByUserIdService(userId);

    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceHistoryByUserIdController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentDayAttendanceHistoryByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await attendanceService.getAttendanceHistoryByUserIdService(userId, "today");

    res.json({
      status: "success",
      data: result.data,
      message: "Lấy lịch sử attendance thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceHistoryByUserIdController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentMonthAttendanceHistoryByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await attendanceService.getAttendanceHistoryByUserIdService(userId, "month");

    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceHistoryByUserIdController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

// Lấy thời điểm chấm công sớm nhất - trễ nhất trong ngày cho 1 user
export const getDailyCheckInRangeByUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { attendance_type_id, date } = req.query;
    const parsedTypeId = attendance_type_id != null ? parseInt(attendance_type_id, 10) : null;
    const parsedDate = date ? new Date(date) : new Date();

    const result = await attendanceService.getDailyCheckInRangeByUser(
      parseInt(userId, 10),
      parsedTypeId,
      parsedDate,
      "month"
    );

    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thời điểm chấm công sớm nhất và trễ nhất thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getDailyCheckInRangeByUserController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

// ==================== LOCATION CONTROLLERS ====================

/**
 * Lấy danh sách vị trí kỹ thuật viên
 */
export const getTechniciansLocationsController = async (req, res) => {
  try {
    const { includeOffline, includeHistory } = req.query;
    const result = await attendanceService.getTechniciansLocationsService({
      includeOffline: includeOffline === "true",
      includeHistory: includeHistory === "true",
    });
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy vị trí kỹ thuật viên thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getTechniciansLocationsController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy vị trí văn phòng
 */
export const getOfficeLocationController = async (req, res) => {
  try {
    const result = await attendanceService.getOfficeLocationService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy vị trí văn phòng thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getOfficeLocationController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy lịch sử vị trí kỹ thuật viên
 */
export const getTechnicianLocationHistoryController = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { startDate, endDate, limit } = req.query;
    const result = await attendanceService.getTechnicianLocationHistoryService({
      technicianId: parseInt(technicianId),
      startDate,
      endDate,
      limit: limit ? parseInt(limit) : 100,
    });
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy lịch sử vị trí thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getTechnicianLocationHistoryController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy vị trí công việc
 */
export const getJobItemsLocationsController = async (req, res) => {
  try {
    const { status, includeArchived } = req.query;
    const result = await attendanceService.getJobItemsLocationsService({
      status,
      includeArchived: includeArchived === "true",
    });
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy vị trí công việc thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getJobItemsLocationsController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Xử lý geocoding reverse
 */
export const getGeocodingReverseController = async (req, res) => {
  try {
    const { lat, lng, language } = req.query;
    const result = await attendanceService.getGeocodingReverseService({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      language: language || "vi",
    });
    res.json({
      status: "success",
      data: result.data,
      message: "Geocoding reverse thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getGeocodingReverseController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

// ==================== ATTENDANCE SUMMARY & STATISTICS CONTROLLERS ====================

/**
 * Lấy dữ liệu tổng quan chấm công
 */
export const getAttendanceSummaryController = async (req, res) => {
  try {
    const { start_date, end_date, department_id, employee_id } = req.query;

    // Parse và validate date an toàn
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(); // Fallback to today
      const parsed = new Date(dateStr);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    };

    const params = {
      startDate: parseDate(start_date),
      endDate: parseDate(end_date),
      departmentId: department_id,
      employeeId: employee_id,
    };

    const result = await attendanceService.getAttendanceSummaryService(params);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy dữ liệu tổng quan chấm công thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceSummaryController:` + error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy thống kê chấm công
 */
export const getAttendanceStatisticsController = async (req, res) => {
  try {
    const { start_date, end_date, department_id, employee_id } = req.query;

    // Parse và validate date an toàn
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(); // Fallback to today
      const parsed = new Date(dateStr);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    };

    const params = {
      startDate: parseDate(start_date),
      endDate: parseDate(end_date),
      departmentId: department_id,
      employeeId: employee_id,
    };

    const result = await attendanceService.getAttendanceStatisticsService(params);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thống kê chấm công thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceStatisticsController:` + error.message);
    res.status(500).json({ error: error.message });
  }
};

// ==================== ATTENDANCE SESSION CONTROLLERS ====================

/**
 * Lấy danh sách tất cả attendance sessions
 */
export const getAllAttendanceSessionsController = async (req, res) => {
  try {
    const result = await attendanceService.getAllAttendanceSessionsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách phiên chấm công thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAllAttendanceSessionsController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy attendance session theo ID
 */
export const getAttendanceSessionByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceService.getAttendanceSessionByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin phiên chấm công thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceSessionByIdController:`, error.message);
    res.status(404).json({ error: error.message });
  }
};

/**
 * Lấy phiên chấm công active của người dùng
 */
export const getActiveSessionByUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await attendanceService.getActiveSessionByUserService(userId);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy phiên chấm công hiện tại thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getActiveSessionByUserController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy các phiên chấm công đã đóng trong khoảng thời gian
 */
export const getClosedSessionsController = async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;

    const parseDate = (dateStr) => {
      if (!dateStr) return new Date();
      const parsed = new Date(dateStr);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    };

    const result = await attendanceService.getClosedSessionsService({
      startDate: parseDate(start_date),
      endDate: parseDate(end_date),
      userId: user_id ? parseInt(user_id) : null,
    });

    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách phiên chấm công đã đóng thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getClosedSessionsController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Check-out từ phiên chấm công
 */
export const checkOutSessionController = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await attendanceService.checkOutSessionService(sessionId);
    res.json({
      status: "success",
      data: result.data,
      message: "Check-out phiên chấm công thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in checkOutSessionController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

// ==================== ATTENDANCE TYPE CONTROLLERS ====================

/**
 * Lấy danh sách tất cả loại chấm công
 */
export const getAllAttendanceTypesController = async (req, res) => {
  try {
    const result = await attendanceService.getAllAttendanceTypesService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách loại chấm công thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAllAttendanceTypesController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy loại chấm công theo ID
 */
export const getAttendanceTypeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceService.getAttendanceTypeByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin loại chấm công thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceTypeByIdController:`, error.message);
    res.status(404).json({ error: error.message });
  }
};

/**
 * Tạo loại chấm công mới
 */
export const createAttendanceTypeController = async (req, res) => {
  try {
    const result = await attendanceService.createAttendanceTypeService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo loại chấm công thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in createAttendanceTypeController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật loại chấm công
 */
export const updateAttendanceTypeController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceService.updateAttendanceTypeService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật loại chấm công thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in updateAttendanceTypeController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Xóa loại chấm công
 */
export const deleteAttendanceTypeController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceService.deleteAttendanceTypeService(id);
    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in deleteAttendanceTypeController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};
// ==================== ALL USERS ATTENDANCE RANGE CONTROLLER ====================

/**
 * Lấy thời điểm chấm công sớm nhất và trễ nhất của TẤT CẢ người dùng trong tháng hiện tại
 */
export const getAllUsersAttendanceRangeController = async (req, res) => {
  try {
    const { start_date, end_date, attendance_type_id, department_id } = req.query;

    // Parse dates
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const parsed = new Date(dateStr);
      return isNaN(parsed.getTime()) ? null : parsed;
    };

    const startDate = parseDate(start_date);
    const endDate = parseDate(end_date);
    const parsedTypeId = attendance_type_id ? parseInt(attendance_type_id, 10) : null;
    const parsedDeptId = department_id ? parseInt(department_id, 10) : null;

    const result = await attendanceService.getAllUsersAttendanceRangeService(
      startDate,
      endDate,
      parsedTypeId,
      parsedDeptId
    );

    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getAllUsersAttendanceRangeController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};
