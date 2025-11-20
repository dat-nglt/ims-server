import db from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * Lấy danh sách thông báo
 */
export const getAllNotificationsService = async (userId) => {
  try {
    const where = userId ? { user_id: userId } : {};

    const notifications = await db.Notification.findAll({
      where,
      include: [
        { model: db.User, as: "user" },
        { model: db.Work, as: "work" },
      ],
      order: [["created_at", "DESC"]],
    });

    return { success: true, data: notifications };
  } catch (error) {
    logger.error("Error in getAllNotificationsService:", error.message);
    throw error;
  }
};

/**
 * Lấy thông báo theo ID
 */
export const getNotificationByIdService = async (id) => {
  try {
    const notification = await db.Notification.findByPk(id, {
      include: [
        { model: db.User, as: "user" },
        { model: db.Work, as: "work" },
      ],
    });

    if (!notification) {
      throw new Error("Thông báo không tồn tại");
    }

    return { success: true, data: notification };
  } catch (error) {
    logger.error("Error in getNotificationByIdService:", error.message);
    throw error;
  }
};

/**
 * Đánh dấu thông báo đã đọc
 */
export const markNotificationAsReadService = async (id) => {
  try {
    const notification = await db.Notification.findByPk(id);
    if (!notification) {
      throw new Error("Thông báo không tồn tại");
    }

    await notification.update({
      is_read: true,
      read_at: new Date(),
    });

    return { success: true, data: notification };
  } catch (error) {
    logger.error("Error in markNotificationAsReadService:", error.message);
    throw error;
  }
};

/**
 * Xóa thông báo
 */
export const deleteNotificationService = async (id) => {
  try {
    const notification = await db.Notification.findByPk(id);
    if (!notification) {
      throw new Error("Thông báo không tồn tại");
    }

    await notification.destroy();

    return { success: true, message: "Xóa thông báo thành công" };
  } catch (error) {
    logger.error("Error in deleteNotificationService:", error.message);
    throw error;
  }
};

/**
 * Lấy số thông báo chưa đọc
 */
export const getUnreadNotificationsCountService = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId là bắt buộc");
    }

    const count = await db.Notification.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });

    return { success: true, data: { count } };
  } catch (error) {
    logger.error("Error in getUnreadNotificationsCountService:", error.message);
    throw error;
  }
};
