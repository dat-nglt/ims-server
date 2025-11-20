import express from "express";
import { getAllNotificationsController, getNotificationByIdController, markNotificationAsReadController, deleteNotificationController, getUnreadNotificationsCountController } from "../controllers/notification.controller.js";

const router = express.Router();

// GET all notifications for user
router.get("/", getAllNotificationsController);

// GET notification by ID
router.get("/:id", getNotificationByIdController);

// MARK notification as read
router.put("/:id/read", markNotificationAsReadController);

// DELETE notification
router.delete("/:id", deleteNotificationController);

// GET unread notifications count
router.get("/unread/count", getUnreadNotificationsCountController);

export default router;
