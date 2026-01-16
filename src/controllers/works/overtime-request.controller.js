import logger from "../../utils/logger.js";
import * as overtimeRequestService from "../../services/works/overtime-request.service.js";

/**
 * Controller: Tạo yêu cầu tăng ca mới
 */
export const createOvertimeRequestController = async (req, res) => {
    try {
        const { userRequestingId, workId, work, type, reason, startTime, endTime, technicians, requestedDate } =
            req.body;

        // Validate required fields
        if (!userRequestingId || !type || !startTime || !endTime || !technicians || !Array.isArray(technicians)) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc",
            });
        }

        // Calculate duration in minutes
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const durationMinutes = Math.round((end - start) / (1000 * 60));

        if (durationMinutes <= 0) {
            return res.json({
                success: false,
                message: "Thời gian kết thúc phải sau thời gian bắt đầu",
            });
        }

        const result = await overtimeRequestService.createOvertimeRequestService({
            user_id: userRequestingId,
            work_id: workId,
            work_title: work,
            requested_date: requestedDate || new Date().toISOString().split("T")[0],
            start_time: startTime,
            end_time: endTime,
            duration_minutes: durationMinutes,
            reason,
            overtime_type: type,
            technician_ids: technicians,
        });

        return res.json(result);
    } catch (error) {
        logger.error(`[${req.id}] Error in createOvertimeRequestController:`, error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi tạo yêu cầu tăng ca",
        });
    }
};

export const createOvertimeRequestControllerOffice = async (req, res) => {
    try {
        const {
            user_id,
            overtime_category,
            priority,
            requested_date,
            start_time,
            end_time,
            reason,
            notes,
            work_id,
            department_id,
        } = req.body;

        // Sử dụng các field mới, hoặc fall back sang field cũ
        const userId = user_id;
        const category = overtime_category || "administrative_work";
        const priorityLevel = priority || "medium";
        const startTimeStr = start_time;
        const endTimeStr = end_time;
        const requestDate = requested_date;
        const reasonText = reason;
        const notesText = notes;

        // Validate required fields
        if (!userId || !startTimeStr || !endTimeStr) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc: user_id, start_time, end_time",
            });
        }

        // Validate reason
        if (!reasonText || reasonText.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp lý do tăng ca",
            });
        }

        // Calculate duration in minutes
        const start = new Date(`1970-01-01T${startTimeStr}:00`);
        const end = new Date(`1970-01-01T${endTimeStr}:00`);
        const durationMinutes = Math.round((end - start) / (1000 * 60));

        if (durationMinutes <= 0) {
            return res.status(400).json({
                success: false,
                message: "Thời gian kết thúc phải sau thời gian bắt đầu",
            });
        }

        // Chuẩn hóa requested_date: nếu là Date object, chuyển thành string
        let normalizedDate = requestDate;
        if (requestDate instanceof Date) {
            normalizedDate = requestDate.toISOString().split("T")[0];
        }

        const result = await overtimeRequestService.createOvertimeRequestServiceOffice({
            user_id: userId,
            work_id: work_id || null,
            department_id: department_id || null,
            requested_date: normalizedDate,
            start_time: startTimeStr,
            end_time: endTimeStr,
            duration_minutes: durationMinutes,
            reason: reasonText,
            overtime_category: category,
            priority: priorityLevel,
            notes: notesText,
            overtime_type: "overtime_office",
            technician_ids: [],
        });

        return res.json(result);
    } catch (error) {
        logger.error(`[${req.id}] Error in createOvertimeRequestControllerOffice:`, error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi tạo yêu cầu tăng ca",
        });
    }
};

/**
 * Controller: Lấy danh sách yêu cầu tăng ca của người dùng
 */
export const getOvertimeRequestsByUserController = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { status, startDate, endDate, limit, offset } = req.query;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "Thiếu user_id",
            });
        }

        const result = await overtimeRequestService.getOvertimeRequestsByUserService(user_id, {
            status,
            startDate,
            endDate,
            limit,
            offset,
        });

        res.json(result);
    } catch (error) {
        logger.error(`[${req.id}] Error in getOvertimeRequestsByUserController:`, error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi lấy danh sách yêu cầu tăng ca",
        });
    }
};

/**
 * Controller: Lấy danh sách yêu cầu tăng ca chờ duyệt
 */
export const getPendingOvertimeRequestsController = async (req, res) => {
    try {
        const { department, startDate, endDate, limit, offset } = req.query;

        const result = await overtimeRequestService.getAllOvertimeRequestsService({
            department,
            startDate,
            endDate,
            limit,
            offset,
        });

        res.json(result);
    } catch (error) {
        logger.error(`[${req.id}] Error in getPendingOvertimeRequestsController:`, error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi lấy danh sách yêu cầu tăng ca",
        });
    }
};

/**
 * Controller: Duyệt yêu cầu tăng ca
 */
export const approveOvertimeRequestController = async (req, res) => {
    try {
        const { id } = req.params;
        const { approverId, isPaid, notes, technician_id } = req.body;

        if (!id || !approverId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu request ID hoặc approverId",
            });
        }

        const result = await overtimeRequestService.approveOvertimeRequestService(id, approverId, {
            is_paid: isPaid,
            notes,
            technician_id: technician_id,
        });

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        logger.error(`[${req.id}] Error in approveOvertimeRequestController:` + error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi duyệt yêu cầu tăng ca",
        });
    }
};

/**
 * Controller: Từ chối yêu cầu tăng ca
 */
export const rejectOvertimeRequestController = async (req, res) => {
    try {
        const { id } = req.params;
        const { approverId, reject_reason, technician_id } = req.body;

        if (!id || !approverId || !reject_reason) {
            return res.status(400).json({
                success: false,
                message: "Thiếu request ID, approverId hoặc reject_reason",
            });
        }

        const result = await overtimeRequestService.rejectOvertimeRequestService(id, approverId, {
            reject_reason,
            technician_id,
        });

        return res.json(result);
    } catch (error) {
        logger.error(`[${req.id}] Error in rejectOvertimeRequestController:`, error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi từ chối yêu cầu tăng ca",
        });
    }
};

/**
 * Controller: Lấy thống kê tăng ca
 */
export const getOvertimeStatisticsController = async (req, res) => {
    try {
        const { user_id, department, startDate, endDate, status } = req.query;

        const result = await overtimeRequestService.getOvertimeStatisticsService({
            userId: user_id,
            department,
            startDate,
            endDate,
            status,
        });

        res.json(result);
    } catch (error) {
        logger.error(`[${req.id}] Error in getOvertimeStatisticsController:`, error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi lấy thống kê tăng ca",
        });
    }
};
