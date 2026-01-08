import logger from "../../utils/logger.js";
import * as overtimeRequestService from "../../services/works/overtime-request.service.js";

/**
 * Controller: Tạo yêu cầu tăng ca mới
 */
export const createOvertimeRequestController = async (req, res) => {
  try {
    const { user_id, work_id, requested_date, start_time, end_time, duration_minutes, reason, overtime_type } =
      req.body;

    // Validate required fields
    if (!user_id || !requested_date || !start_time || !end_time || !overtime_type) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc",
      });
    }

    const result = await overtimeRequestService.createOvertimeRequestService({
      user_id,
      work_id,
      requested_date,
      start_time,
      end_time,
      duration_minutes,
      reason,
      overtime_type,
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
    const { approver_id, is_paid, notes } = req.body;

    if (!id || !approver_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu request ID hoặc approver_id",
      });
    }

    const result = await overtimeRequestService.approveOvertimeRequestService(id, approver_id, {
      is_paid,
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
    const { approver_id, reject_reason } = req.body;

    if (!id || !approver_id || !reject_reason) {
      return res.status(400).json({
        success: false,
        message: "Thiếu request ID, approver_id hoặc reject_reason",
      });
    }

    const result = await overtimeRequestService.rejectOvertimeRequestService(id, approver_id, reject_reason);

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
    const { user_id } = req.body;

    if (!id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu request ID hoặc user_id",
      });
    }

    const result = await overtimeRequestService.cancelOvertimeRequestService(id, user_id);

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
    const { user_id, start_time, end_time, duration_minutes, reason, overtime_type } = req.body;

    if (!id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu request ID hoặc user_id",
      });
    }

    const result = await overtimeRequestService.updateOvertimeRequestService(id, user_id, {
      start_time,
      end_time,
      duration_minutes,
      reason,
      overtime_type,
    });

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
