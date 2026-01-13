import express from "express";
import * as notificationControllers from "../../controllers/mini-app/notification.controller.js";

const router = express.Router();

// POST /api/mini-app/notification/send - Send generic notification
router.post("/send", notificationControllers.sendNotificationController);

// POST /api/mini-app/notification/send-order-confirmation - Send order confirmation
router.post("/send-order-confirmation", notificationControllers.sendOrderConfirmationController);

// POST /api/mini-app/notification/send-custom - Send custom notification
router.post("/send-custom", notificationControllers.sendCustomNotificationController);

export default router;
