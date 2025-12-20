import logger from "../../utils/logger.js";
import * as notificationService from "../../services/operations/index.js";

// Normalize DB model to client-friendly shape
const normalizeNotification = (n) => {
    if (!n) return n;
    const data = n.toJSON ? n.toJSON() : n;
    return {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        message: data.message,
        type: data.type,
        related_work_id: data.related_work_id,
        related_project_id: data.related_project_id,
        read: Boolean(data.is_read),
        read_at: data.read_at || null,
        timestamp: data.created_at,
        priority: data.priority || "low",
        meta: data.meta || null,
        action_url: data.action_url || null,
        user: data.user || null,
        work: data.work || null,
        project: data.project || null,
    };
};

/**
 * Lấy danh sách thông báo
 */
export const getAllNotificationsController = async (req, res) => {
    try {
        const { userId } = req.query;
        const result = await notificationService.getAllNotificationsService(
            userId
        );
        const normalized = Array.isArray(result.data)
            ? result.data.map(normalizeNotification)
            : result.data;
        res.json({
            status: "success",
            data: normalized,
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
            data: normalizeNotification(result.data),
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
        const result = await notificationService.markNotificationAsReadService(
            id
        );
        res.json({
            status: "success",
            data: normalizeNotification(result.data),
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
        const result =
            await notificationService.getUnreadNotificationsCountService(
                userId
            );
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy số thông báo chưa đọc thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getUnreadNotificationsCountController: ` +
                error.message
        );
        res.status(400).json({ error: error.message });
    }
};

/**
 * Lấy tất cả thông báo của hệ thống
 */
export const getAllSystemNotificationsController = async (req, res) => {
    try {
        const result =
            await notificationService.getAllSystemNotificationsService();
        const normalized = Array.isArray(result.data)
            ? result.data.map(normalizeNotification)
            : result.data;
        res.json({
            status: "success",
            data: normalized,
            message: "Lấy tất cả thông báo hệ thống thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getAllSystemNotificationsController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Đánh dấu đọc tất cả thông báo
 */
export const markAllNotificationsAsReadController = async (req, res) => {
    try {
        const { userId } = req.query;
        const result =
            await notificationService.markAllNotificationsAsReadService(userId);
        res.json({
            status: "success",
            data: result.data,
            message: "Đánh dấu đọc tất cả thông báo thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in markAllNotificationsAsReadController:`,
            error.message
        );
        res.status(400).json({ error: error.message });
    }
};
