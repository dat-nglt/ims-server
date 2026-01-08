import logger from "../../utils/logger.js";
import * as overtimeRequestService from "../../services/works/overtime-request.service.js";

/**
 * Controller: Tạo yêu cầu tăng ca mới
 */
export const createOvertimeRequestController = async (req, res) => {
  try {
    const {
      userRequestingId,
      workId,
      work,
      type,
      reason,
      startTime,
      endTime,
      technicians,
      requestedDate,
    } = req.body;

    // Validate required fields
    if (!userRequestingId || !type || !startTime || !endTime || !technicians || !Array.isArray(technicians)) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc (userRequestingId, type, startTime, endTime, technicians)",
      });
    }

    // Calculate duration in minutes
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const durationMinutes = Math.round((end - start) / (1000 * 60));

    if (durationMinutes <= 0) {
      return res.status(400).json({
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

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`[${req.id}] Error in createOvertimeRequestController:`, error.message);
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

    const result = await overtimeRequestService.getPendingOvertimeRequestsService({
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
 * Controller: Lấy chi tiết yêu cầu tăng ca
 */
export const getOvertimeRequestDetailController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu request ID",
      });
    }

    const result = await overtimeRequestService.getOvertimeRequestDetailService(id);

    if (result.success) {
      return res.json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    logger.error(`[${req.id}] Error in getOvertimeRequestDetailController:`, error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi lấy chi tiết yêu cầu tăng ca",
    });
  }
};

/**
 * Controller: Duyệt yêu cầu tăng ca
 */
export const approveOvertimeRequestController = async (req, res) => {
  try {
    const { id } = req.params;
    const { approverId, isPaid, notes } = req.body;

    if (!id || !approverId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu request ID hoặc approverId",
      });
    }

    const result = await overtimeRequestService.approveOvertimeRequestService(id, approverId, {
      is_paid: isPaid,
      notes,
    });

    if (result.success) {
      return res.json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`[${req.id}] Error in approveOvertimeRequestController:`, error.message);
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
    const { approverId, rejectReason } = req.body;

    if (!id || !approverId || !rejectReason) {
      return res.status(400).json({
        success: false,
        message: "Thiếu request ID, approverId hoặc rejectReason",
      });
    }

    const result = await overtimeRequestService.rejectOvertimeRequestService(id, approverId, rejectReason);

    if (result.success) {
      return res.json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`[${req.id}] Error in rejectOvertimeRequestController:`, error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi từ chối yêu cầu tăng ca",
    });
  }
};

/**
 * Controller: Hủy yêu cầu tăng ca
 */
export const cancelOvertimeRequestController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!id || !userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu request ID hoặc userId",
      });
    }

    const result = await overtimeRequestService.cancelOvertimeRequestService(id, userId);

    if (result.success) {
      return res.json(result);  
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`[${req.id}] Error in cancelOvertimeRequestController:`, error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi hủy yêu cầu tăng ca",
    });
  }
};

/**
 * Controller: Cập nhật yêu cầu tăng ca
 */
export const updateOvertimeRequestController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, startTime, endTime, reason, type, technicians } = req.body;

    if (!id || !userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu request ID hoặc userId",
      });
    }

    // Build update data
    const updateData = {
      reason,
      overtime_type: type,
    };

    // If time values are provided, calculate duration
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      const durationMinutes = Math.round((end - start) / (1000 * 60));

      if (durationMinutes <= 0) {
        return res.status(400).json({
          success: false,
          message: "Thời gian kết thúc phải sau thời gian bắt đầu",
        });
      }

      updateData.start_time = startTime;
      updateData.end_time = endTime;
      updateData.duration_minutes = durationMinutes;
    }

    // Handle technicians array
    if (technicians && Array.isArray(technicians)) {
      if (technicians.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng chọn ít nhất một kỹ thuật viên",
        });
      }
      updateData.technician_ids = technicians;
    }

    const result = await overtimeRequestService.updateOvertimeRequestService(id, userId, updateData);

    if (result.success) {
      return res.json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`[${req.id}] Error in updateOvertimeRequestController:`, error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi cập nhật yêu cầu tăng ca",
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
