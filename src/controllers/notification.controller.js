import logger from "../utils/logger.js";
import * as notificationService from "../services/notification.service.js";

/**
 * Lấy danh sách thông báo
 */
export const getAllNotificationsController = async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await notificationService.getAllNotificationsService(userId);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách thông báo thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllNotificationsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy thông báo theo ID
 */
export const getNotificationByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await notificationService.getNotificationByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin thông báo thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getNotificationByIdController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Đánh dấu thông báo đã đọc
 */
export const markNotificationAsReadController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await notificationService.markNotificationAsReadService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Đánh dấu thông báo đã đọc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in markNotificationAsReadController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
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
    logger.error(
      `[${req.id}] Error in deleteNotificationController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Lấy số thông báo chưa đọc
 */
export const getUnreadNotificationsCountController = async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await notificationService.getUnreadNotificationsCountService(userId);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy số thông báo chưa đọc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getUnreadNotificationsCountController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};
