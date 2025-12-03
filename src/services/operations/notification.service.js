import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Tạo thông báo mới
 */
export const createNotificationService = async (notificationData) => {
  try {
    const {
      user_id,
      title,
      message,
      type,
      related_work_id,
      related_project_id,
      action_url,
    } = notificationData;

    // Validate user_id
    const user = await db.User.findByPk(user_id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // Validate related_work_id if provided
    if (related_work_id) {
      const work = await db.Work.findByPk(related_work_id);
      if (!work) {
        throw new Error("Công việc liên quan không tồn tại");
      }
    }

    // Validate related_project_id if provided
    if (related_project_id) {
      const project = await db.Project.findByPk(related_project_id);
      if (!project) {
        throw new Error("Dự án liên quan không tồn tại");
      }
    }

    const notification = await db.Notification.create({
      user_id,
      title,
      message,
      type,
      related_work_id,
      related_project_id,
      action_url,
    });

    return { success: true, data: notification };
  } catch (error) {
    logger.error("Error in createNotificationService:", error.message);
    throw error;
  }
};

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

/**
 * Lấy tất cả thông báo của hệ thống
 */
export const getAllSystemNotificationsService = async () => {
  try {
    const notifications = await db.Notification.findAll({
      include: [
        { model: db.User, as: "user" },
        { model: db.Work, as: "work" },
      ],
      order: [["created_at", "DESC"]],
    });

    return { success: true, data: notifications };
  } catch (error) {
    logger.error("Error in getAllSystemNotificationsService:", error.message);
    throw error;
  }
};

/**
 * Đánh dấu đọc tất cả thông báo cho một user
 */
export const markAllNotificationsAsReadService = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId là bắt buộc");
    }

    const [affectedRows] = await db.Notification.update(
      {
        is_read: true,
        read_at: new Date(),
      },
      {
        where: {
          user_id: userId,
          is_read: false,
        },
      }
    );

    return { success: true, data: { affectedRows } };
  } catch (error) {
    logger.error("Error in markAllNotificationsAsReadService:", error.message);
    throw error;
  }
};
