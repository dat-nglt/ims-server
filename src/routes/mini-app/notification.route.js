import express from "express";
import {
  sendOrderConfirmationController,
  sendCustomNotificationController,
  sendNotificationController,
} from "../../controllers/mini-app/notification.controller.js";

const router = express.Router();

// POST /api/mini-app/notification/send - Send generic notification
router.post("/send", sendNotificationController);

// POST /api/mini-app/notification/send-order-confirmation - Send order confirmation
router.post("/send-order-confirmation", sendOrderConfirmationController);

// POST /api/mini-app/notification/send-custom - Send custom notification
router.post("/send-custom", sendCustomNotificationController);

export default router;
