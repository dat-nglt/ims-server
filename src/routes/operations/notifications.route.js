import express from "express";
import * as notificationControllers from "../../controllers/operations/notification.controller.js";

const router = express.Router();

// GET all notifications for user
router.get("/", notificationControllers.getAllNotificationsController);

// GET all system notifications
router.get("/all-system", notificationControllers.getAllSystemNotificationsController);

// GET notification by ID
router.get("/:id", notificationControllers.getNotificationByIdController);

// MARK notification as read
router.put("/:id/read", notificationControllers.markNotificationAsReadController);

// MARK all notifications as read for user
router.put("/read-all", notificationControllers.markAllNotificationsAsReadController);

// DELETE notification
router.delete("/:id", notificationControllers.deleteNotificationController);

// GET unread notifications count
router.get("/unread/count", notificationControllers.getUnreadNotificationsCountController);

export default router;
