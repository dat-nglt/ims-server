import axios from "axios";
import logger from "../../utils/logger.js";

const API_KEY = "52T59yrUn1eU9bubmbh47WSdN2JRNiiR1oPGBZGrwqol3CvUt1a";
const MINI_APP_ID = "4077565557940731886";
const ZALO_API_URL = "https://openapi.mini.zalo.me/notification/template";

/**
 * Send notification to user via Zalo Mini App
 * @param {string} receiverId - User ID to receive notification
 * @param {object} templateData - Template data containing notification content
 * @param {string} templateId - Zalo template ID
 * @returns {Promise} - Response from Zalo API
 */
export const sendNotificationService = async (
  receiverId,
  templateData,
  templateId = "00126fd75392bacce383"
) => {
  try {
    const config = {
      method: "post",
      url: ZALO_API_URL,
      headers: {
        "X-Api-Key": `Bearer ${API_KEY}`,
        "X-User-Id": receiverId,
        "X-MiniApp-Id": MINI_APP_ID,
        "Content-Type": "application/json",
      },
      data: {
        templateId,
        templateData,
      },
    };

    const response = await axios(config);
    logger.info(`[Zalo Notification] Sent to user ${receiverId}:`, response.data);
    return {
      success: true,
      message: "Notification sent successfully",
      data: response.data,
    };
  } catch (error) {
    logger.error(
      `[Zalo Notification] Error sending to user ${receiverId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to send notification"
    );
  }
};

/**
 * Send order confirmation notification
 * @param {string} receiverId - User ID
 * @param {object} orderData - Order information
 * @returns {Promise}
 */
export const sendOrderConfirmationService = async (receiverId, orderData) => {
  const templateData = {
    buttonText: "Xem chi tiết đơn hàng",
    buttonUrl: orderData.buttonUrl || "https://zalo.me/",
    title: orderData.title || "ZaUI Coffee - Xác nhận đơn hàng",
    contentTitle: "Xác nhận đơn hàng",
    contentDescription:
      orderData.contentDescription ||
      "Chúng tôi đã nhận yêu cầu đặt hàng từ bạn. Thông tin chi tiết đơn hàng",
  };

  return sendNotificationService(receiverId, templateData);
};

/**
 * Send custom notification
 * @param {string} receiverId - User ID
 * @param {string} title - Notification title
 * @param {string} contentTitle - Content title
 * @param {string} contentDescription - Content description
 * @param {string} buttonText - Button text
 * @param {string} buttonUrl - Button URL
 * @param {string} templateId - Template ID
 * @returns {Promise}
 */
export const sendCustomNotificationService = async (
  receiverId,
  title,
  contentTitle,
  contentDescription,
  buttonText = "Xem chi tiết",
  buttonUrl = "https://zalo.me/",
  templateId = "00126fd75392bacce383"
) => {
  const templateData = {
    buttonText,
    buttonUrl,
    title,
    contentTitle,
    contentDescription,
  };

  return sendNotificationService(receiverId, templateData, templateId);
};
