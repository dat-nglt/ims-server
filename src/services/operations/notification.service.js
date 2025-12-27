import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Tạo thông báo mới
 *
 * Chức năng:
 * 1. Tạo notification cho users liên quan (if recipients provided)
 * 2. Tạo system notification riêng biệt (nếu systemMessage provided)
 *
 * @param {Object} notificationData
 * @param {string} notificationData.title - Tiêu đề thông báo cho user
 * @param {string} notificationData.message - Nội dung cho user
 * @param {string} notificationData.type - Loại thông báo
 * @param {number} notificationData.related_work_id - ID công việc (optional)
 * @param {number} notificationData.related_project_id - ID dự án (optional)
 * @param {string} notificationData.action_url - URL hành động (optional)
 * @param {string} notificationData.priority - Mức độ ưu tiên (default: 'low')
 * @param {Object} notificationData.meta - Dữ liệu bổ sung (optional)
 * @param {Array<number>} notificationData.recipients - Danh sách user IDs nhận thông báo
 * @param {boolean} notificationData.broadcast - Gửi cho tất cả active user (default: false)
 * @param {Object} notificationData.systemNotification - System notification config (optional)
 * @param {string} notificationData.systemNotification.title - Tiêu đề cho hệ thống
 * @param {string} notificationData.systemNotification.message - Nội dung cho hệ thống
 * @param {boolean} notificationData.systemNotification.broadcast - Broadcast system notification?
 *
 * @returns {Promise} { success: true, data: { notification, systemNotification, recipients_count } }
 */
export const createNotificationService = async (notificationData) => {
  try {
    const {
      title,
      message,
      type,
      related_work_id,
      related_project_id,
      action_url,
      priority = "low",
      meta = null,
      recipients = null,
      broadcast = false,
      systemNotification = null, // { title, message, broadcast }
    } = notificationData;

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

    // Validate recipients if provided
    if (Array.isArray(recipients) && recipients.length > 0) {
      const validRecipients = await db.User.count({
        where: { id: recipients, is_active: true },
      });
      if (validRecipients !== recipients.length) {
        throw new Error("Một số user không tồn tại hoặc không active");
      }
    }

    let notificationResult = null;
    let systemNotificationResult = null;
    let recipientCount = 0;

    // ===== 1. CREATE USER NOTIFICATION =====
    // Tạo notification cho user có liên quan (nếu có recipients hoặc broadcast)
    if ((Array.isArray(recipients) && recipients.length > 0) || broadcast) {
      const notification = await db.Notification.create({
        title,
        message,
        type,
        related_work_id,
        related_project_id,
        action_url,
        priority,
        meta,
        is_system: false, // Đây là notification cho user, không phải system
      });

      // Create recipients
      const toCreate = [];

      if (Array.isArray(recipients) && recipients.length > 0) {
        // Specific recipients
        recipients.forEach((uid) => {
          toCreate.push({
            notification_id: notification.id,
            user_id: uid,
            delivered_at: new Date(),
          });
        });
        recipientCount = recipients.length;
      } else if (broadcast) {
        // Broadcast to all active users
        const users = await db.User.findAll({
          where: { is_active: true },
          attributes: ["id"],
        });
        users.forEach((u) => {
          toCreate.push({
            notification_id: notification.id,
            user_id: u.id,
            delivered_at: new Date(),
          });
        });
        recipientCount = users.length;
      }

      if (toCreate.length > 0) {
        await db.NotificationRecipient.bulkCreate(toCreate, { ignoreDuplicates: true });
      }

      notificationResult = notification;
    }

    // ===== 2. CREATE SYSTEM NOTIFICATION =====
    // Tạo system notification riêng với nội dung khác (nếu cung cấp)
    if (systemNotification) {
      const sysTitle = systemNotification.title || `[SYSTEM] ${title}`;
      const sysMessage = systemNotification.message || message;
      const sysBroadcast = systemNotification.broadcast || false;
      const sysNotif = await db.Notification.create({
        title: sysTitle,
        message: sysMessage,
        type,
        related_work_id,
        related_project_id,
        action_url,
        priority: systemNotification.priority || priority,
        meta,
        is_system: true, // Đây là system notification
      });

      // Create system recipients (broadcast to admin/all users)
      if (sysBroadcast) {
        const users = await db.User.findAll({
          where: { is_active: true },
          attributes: ["id"],
        });
        const sysRecipients = users.map((u) => ({
          notification_id: sysNotif.id,
          user_id: u.id,
          delivered_at: new Date(),
        }));
        if (sysRecipients.length > 0) {
          await db.NotificationRecipient.bulkCreate(sysRecipients, { ignoreDuplicates: true });
        }
      }

      systemNotificationResult = sysNotif;
    }

    return {
      success: true,
      data: {
        notification: notificationResult,
        systemNotification: systemNotificationResult,
        recipients_count: recipientCount,
      },
    };
  } catch (error) {
    logger.error("Error in createNotificationService:" + error.message);
    throw error;
  }
};

/**
 * Lấy tất cả thông báo của hệ thống (admin view)
 *
 * @param {Object} options
 * @param {number} options.limit - Số lượng kết quả (default: 50)
 * @param {number} options.offset - Offset (default: 0)
 * @param {boolean} options.onlySystem - Chỉ lấy is_system = true? (default: true)
 *
 * @returns {Promise} { success: true, data: [...notifications], total: number }
 */
export const getAllSystemNotificationsService = async () => {
  try {
    // Query system/user notifications based on is_system flag
    const notifications = await db.Notification.findAll({
      where: {
        is_system: true, // Lấy chính xác theo boolean: true = system, false = user
      },
      include: [
        { model: db.Work, as: "work" },
        { model: db.Project, as: "project" },
        {
          model: db.NotificationRecipient,
          as: "recipients",
          required: false,
          attributes: ["id", "user_id", "is_read"],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    // Count total
    const total = await db.Notification.count({
      where: {
        is_system: true,
      },
    });

    return { success: true, data: notifications, total };
  } catch (error) {
    logger.error("Error in getAllSystemNotificationsService:" + error.message);
    throw error;
  }
};

/**
 * Lấy danh sách thông báo
 *
 * @param {number} userId - User ID (bắt buộc)
 * @param {Object} options
 * @param {boolean} options.includeSystem - Include system notifications? (default: true)
 * @param {boolean} options.includeUser - Include user notifications? (default: true)
 * @param {number} options.limit - Số lượng kết quả (default: 50)
 * @param {number} options.offset - Offset (default: 0)
 *
 * @returns {Promise} { success: true, data: [...notifications], total: number }
 */
export const getAllNotificationsService = async (userId, options = {}) => {
  try {
    if (!userId) {
      throw new Error("userId là bắt buộc để lấy thông báo");
    }

    const { includeSystem = true, includeUser = true, limit = 50, offset = 0 } = options;

    // Build filter for is_system
    const systemFilter = [];
    if (includeUser) systemFilter.push(false);
    if (includeSystem) systemFilter.push(true);

    // Query recipients for this user
    const recipients = await db.NotificationRecipient.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: db.Notification,
          as: "notification",
          where: {
            is_system: systemFilter.length > 0 ? { [db.Sequelize.Op.in]: systemFilter } : false,
          },
          include: [
            { model: db.Work, as: "work" },
            { model: db.Project, as: "project" },
          ],
        },
      ],
      order: [[{ model: db.Notification, as: "notification" }, "created_at", "DESC"]],
      limit,
      offset,
    });

    // Count total for pagination
    const total = await db.NotificationRecipient.count({
      where: { user_id: userId },
      include: [
        {
          model: db.Notification,
          as: "notification",
          where: {
            is_system: systemFilter.length > 0 ? { [db.Sequelize.Op.in]: systemFilter } : false,
          },
          required: true,
        },
      ],
    });

    // Normalize data
    const normalized = recipients.map((r) => {
      const n = r.notification ? (r.notification.toJSON ? r.notification.toJSON() : r.notification) : null;
      return {
        id: n?.id,
        title: n?.title,
        message: n?.message,
        type: n?.type,
        related_work_id: n?.related_work_id,
        related_project_id: n?.related_project_id,
        read: Boolean(r.is_read),
        read_at: r.read_at || null,
        timestamp: n?.created_at || null,
        priority: n?.priority || "low",
        meta: n?.meta || null,
        action_url: n?.action_url || null,
        is_system: n?.is_system || false,
        work: n?.work || null,
        project: n?.project || null,
      };
    });

    return { success: true, data: normalized, total };
  } catch (error) {
    logger.error("Error in getAllNotificationsService:" + error.message);
    throw error;
  }
};

/**
 * Lấy thông báo theo ID
 */
export const getNotificationByIdService = async (id, userId = null) => {
  try {
    const notification = await db.Notification.findByPk(id, {
      include: [
        { model: db.Work, as: "work" },
        { model: db.Project, as: "project" },
      ],
    });

    if (!notification) {
      throw new Error("Thông báo không tồn tại");
    }

    // If userId provided, include recipient info
    let recipient = null;
    if (userId) {
      recipient = await db.NotificationRecipient.findOne({
        where: { notification_id: id, user_id: userId },
      });
    }

    const data = notification.toJSON ? notification.toJSON() : notification;
    const result = {
      id: data.id,
      title: data.title,
      message: data.message,
      type: data.type,
      related_work_id: data.related_work_id,
      related_project_id: data.related_project_id,
      read: recipient ? Boolean(recipient.is_read) : false,
      read_at: recipient ? recipient.read_at : null,
      timestamp: data.created_at,
      priority: data.priority || "low",
      meta: data.meta || null,
      action_url: data.action_url || null,
      is_system: data.is_system || false,
      work: data.work || null,
      project: data.project || null,
    };

    return { success: true, data: result };
  } catch (error) {
    logger.error("Error in getNotificationByIdService:" + error.message);
    throw error;
  }
};

/**
 * Đánh dấu thông báo đã đọc
 */
export const markNotificationAsReadService = async (notificationId, userId = null) => {
  try {
    if (!userId) throw new Error("userId là bắt buộc để đánh dấu thông báo đã đọc");

    // Find recipient
    const recipient = await db.NotificationRecipient.findOne({
      where: { notification_id: notificationId, user_id: userId },
    });

    if (!recipient) {
      throw new Error("Không tìm thấy thông báo này cho user");
    }

    // Update recipient read status
    await recipient.update({ is_read: true, read_at: new Date() });

    // Fetch notification details
    const n = await db.Notification.findByPk(notificationId, {
      include: [
        { model: db.Work, as: "work" },
        { model: db.Project, as: "project" },
      ],
    });

    const data = n.toJSON ? n.toJSON() : n;
    const result = {
      id: data.id,
      title: data.title,
      message: data.message,
      type: data.type,
      related_work_id: data.related_work_id,
      related_project_id: data.related_project_id,
      read: true,
      read_at: recipient.read_at,
      timestamp: data.created_at,
      priority: data.priority || "low",
      meta: data.meta || null,
      action_url: data.action_url || null,
      is_system: data.is_system || false,
      work: data.work || null,
      project: data.project || null,
    };

    return { success: true, data: result };
  } catch (error) {
    logger.error("Error in markNotificationAsReadService:" + error.message);
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

    // Cascade will remove recipients due to FK onDelete
    await notification.destroy();

    return { success: true, message: "Xóa thông báo thành công" };
  } catch (error) {
    logger.error("Error in deleteNotificationService:" + error.message);
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

    const count = await db.NotificationRecipient.count({ where: { user_id: userId, is_read: false } });

    return { success: true, data: { count } };
  } catch (error) {
    logger.error("Error in getUnreadNotificationsCountService:" + error.message);
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

    const [affectedRows] = await db.NotificationRecipient.update(
      { is_read: true, read_at: new Date() },
      { where: { user_id: userId, is_read: false } }
    );

    return { success: true, data: { affectedRows } };
  } catch (error) {
    logger.error("Error in markAllNotificationsAsReadService:" + error.message);
    throw error;
  }
};
