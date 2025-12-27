import logger from "../../utils/logger.js";
import * as notificationService from "../../services/operations/index.js";

// Normalize notification with recipient data
const normalizeNotification = (notification, recipient = null) => {
  if (!notification) return null;
  const data = notification.toJSON ? notification.toJSON() : notification;
  return {
    id: data.id,
    title: data.title,
    message: data.message,
    type: data.type,
    related_work_id: data.related_work_id,
    related_project_id: data.related_project_id,
    read: recipient ? Boolean(recipient.is_read) : false,
    read_at: recipient ? recipient.read_at : null,
    timestamp: data.timestamp || data.created_at,
    priority: data.priority || "low",
    meta: data.meta || null,
    action_url: data.action_url || null,
    is_system: data.is_system || false,
    work: data.work || null,
    project: data.project || null,
  };
};

/**
 * Lấy danh sách thông báo
 */
export const getAllNotificationsController = async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized - user ID required",
      });
    }

    // Get options from query
    const options = {
      includeSystem: req.query.includeSystem !== "false",
      includeUser: req.query.includeUser !== "false",
      limit: Math.min(parseInt(req.query.limit) || 50, 100),
      offset: parseInt(req.query.offset) || 0,
    };

    const result = await notificationService.getAllNotificationsService(userId, options);
    res.json({
      status: "success",
      data: result.data,
      total: result.total,
      message: "Lấy danh sách thông báo thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAllNotificationsController:`, error.message);
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

/**
 * Lấy thông báo theo ID
 */
export const getNotificationByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;
    const result = await notificationService.getNotificationByIdService(id, userId);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin thông báo thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getNotificationByIdController:`, error.message);
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

/**
 * Đánh dấu thông báo đã đọc
 */
export const markNotificationAsReadController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized - user ID required",
      });
    }

    const result = await notificationService.markNotificationAsReadService(id, userId);
    res.json({
      status: "success",
      data: result.data,
      message: "Đánh dấu thông báo đã đọc thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in markNotificationAsReadController:`, error.message);
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

/**
 * Xóa thông báo
 */
export const deleteNotificationController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await notificationService.deleteNotificationService(id);
    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in deleteNotificationController:`, error.message);
    res.status(404).json({ error: error.message });
  }
};

/**
 * Lấy số thông báo chưa đọc
 */
export const getUnreadNotificationsCountController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized - user ID required",
      });
    }

    const result = await notificationService.getUnreadNotificationsCountService(userId);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy số thông báo chưa đọc thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getUnreadNotificationsCountController: ` + error.message);
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

/**
 * Lấy tất cả thông báo của hệ thống (admin view)
 */
export const getAllSystemNotificationsController = async (req, res) => {
  try {
    const result = await notificationService.getAllSystemNotificationsService();
    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getAllSystemNotificationsController:`, error.message);
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};

/**
 * Đánh dấu đọc tất cả thông báo
 */
export const markAllNotificationsAsReadController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized - user ID required",
      });
    }

    const result = await notificationService.markAllNotificationsAsReadService(userId);
    res.json({
      status: "success",
      data: result.data,
      message: "Đánh dấu đọc tất cả thông báo thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in markAllNotificationsAsReadController:`, error.message);
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};
