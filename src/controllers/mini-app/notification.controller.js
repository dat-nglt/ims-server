import {
  sendNotificationService,
  sendOrderConfirmationService,
  sendCustomNotificationService,
} from "../../services/mini-app/notification.service.js";
import logger from "../../utils/logger.js";

/**
 * Send order confirmation notification
 * POST /api/mini-app/notification/send-order-confirmation
 */
export const sendOrderConfirmationController = async (req, res) => {
  try {
    const { receiverId, orderData } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "receiverId is required",
      });
    }

    const result = await sendOrderConfirmationService(receiverId, orderData || {});
    res.json(result);
  } catch (error) {
    logger.error(
      `[${req.id}] Error in sendOrderConfirmationController:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Send custom notification
 * POST /api/mini-app/notification/send-custom
 */
export const sendCustomNotificationController = async (req, res) => {
  try {
    const {
      receiverId,
      title,
      contentTitle,
      contentDescription,
      buttonText,
      buttonUrl,
      templateId,
    } = req.body;

    if (!receiverId || !title || !contentTitle || !contentDescription) {
      return res.status(400).json({
        success: false,
        message:
          "receiverId, title, contentTitle, and contentDescription are required",
      });
    }

    const result = await sendCustomNotificationService(
      receiverId,
      title,
      contentTitle,
      contentDescription,
      buttonText,
      buttonUrl,
      templateId
    );

    res.json(result);
  } catch (error) {
    logger.error(
      `[${req.id}] Error in sendCustomNotificationController:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Send generic notification
 * POST /api/mini-app/notification/send
 */
export const sendNotificationController = async (req, res) => {
  try {
    const { receiverId, templateData, templateId } = req.body;

    if (!receiverId || !templateData) {
      return res.status(400).json({
        success: false,
        message: "receiverId and templateData are required",
      });
    }

    const result = await sendNotificationService(
      receiverId,
      templateData,
      templateId
    );

    res.json(result);
  } catch (error) {
    logger.error(
      `[${req.id}] Error in sendNotificationController:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
