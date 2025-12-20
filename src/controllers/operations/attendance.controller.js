import logger from "../../utils/logger.js";
import * as attendanceService from "../../services/operations/attendance.service.js";

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
        // Normalize input to match Attendance model fields
        const authUserId = req.user?.userId || req.user?.id || null;

        const {
            // Accept both snake_case and camelCase / legacy keys
            user_id,
            userId,
            work_id,
            project_id,
            latitude,
            longitude,
            location_name,
            address,
            photo_urls,
            photo_url,
            photo,
            device_info,
            device,
            notes,
            check_in_type_id,
            typeId,
            violation_distance,
            violationDistance,
            technicians,
            location,
            lat,
            lng,
        } = req.body || {};

        const resolvedUserId = user_id || userId || authUserId;

        // Build normalized payload
        const payload = {
            user_id: resolvedUserId,
            work_id: work_id || req.body.workId || null,
            project_id: project_id || req.body.projectId || null,
            latitude: (location && (location.lat || location.latitude)) ?? lat ?? latitude ?? null,
            longitude: (location && (location.lng || location.longitude)) ?? lng ?? longitude ?? null,
            location_name:
                (location && (location.name || location.location_name)) ??
                location_name ??
                req.body.locationName ??
                null,
            address: (location && location.address) ?? address ?? null,
            photo_url: photo_urls ?? photo_url ?? photo ?? null,
            device_info: device_info ?? device ?? req.headers["user-agent"] ?? null,
            ip_address: req.headers["x-forwarded-for"] || req.ip || null,
            notes: notes ?? req.body.note ?? null,
            check_in_type_id: check_in_type_id ?? typeId ?? null,
            violation_distance: violation_distance ?? violationDistance ?? null,
            technicians: Array.isArray(technicians) ? technicians : technicians ? [technicians] : undefined,
        };

        if (!payload.user_id) {
            throw new Error("Không xác định được user_id (thiếu token hoặc userId trong body)");
        }

        if (payload.latitude == null || payload.longitude == null) {
            throw new Error("Thiếu tọa độ: latitude và longitude là bắt buộc");
        }

        const result = await attendanceService.checkInService(payload);

        // If service reports an already-open session, return 200 with info for client to show notification
        if (result && result.alreadyCheckedIn) {
            return res.status(200).json({
                status: "info",
                data: result.session || null,
                message: result.message || "Người dùng đã check-in vào phiên khác",
            });
        }

        res.status(201).json({
            status: "success",
            data: result.data,
            message: "Check-in thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in checkInController:` + error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Check-out người dùng
 */
export const checkOutController = async (req, res) => {
    try {
        // Accept id in body: id | attendance_id | attendanceId
        const { id, attendance_id, attendanceId, location, note } = req.body || {};
        console.log(req.body)
        
        const attendanceIdResolved = id ?? attendance_id ?? attendanceId;

        if (!attendanceIdResolved) {
            return res.status(400).json({ error: "Thiếu id attendance để check-out" });
        }

        const result = await attendanceService.checkOutService(attendanceIdResolved);
        res.json({
            status: "success",
            data: result.data,
            message: "Check-out thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in checkOutController:` + error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Lấy lịch sử attendance của một người dùng
 */
export const getAttendanceHistoryByUserIdController = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await attendanceService.getAttendanceHistoryByUserIdService(userId);

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
