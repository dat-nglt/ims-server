import express from "express";
import {
    getAllNotificationsController,
    getNotificationByIdController,
    markNotificationAsReadController,
    deleteNotificationController,
    getUnreadNotificationsCountController,
    getAllSystemNotificationsController,
    markAllNotificationsAsReadController,
} from "../../controllers/operations/notification.controller.js";

const router = express.Router();

// GET all notifications for user
router.get("/", getAllNotificationsController);

// GET all system notifications
router.get("/all", getAllSystemNotificationsController);

// GET notification by ID
router.get("/:id", getNotificationByIdController);

// MARK notification as read
router.put("/:id/read", markNotificationAsReadController);

// MARK all notifications as read for user
router.put("/read-all", markAllNotificationsAsReadController);

// DELETE notification
router.delete("/:id", deleteNotificationController);

// GET unread notifications count
router.get("/unread/count", getUnreadNotificationsCountController);

export default router;
