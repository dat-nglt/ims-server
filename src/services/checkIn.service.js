import db from "../models/index.js";
import logger from "../utils/logger.js";
import axios from "axios";

/**
 * Lấy danh sách tất cả check-in
 */
export const getAllCheckInsService = async () => {
  try {
    const checkIns = await db.CheckIn.findAll({
      include: [
        { model: db.User, as: "user" },
        { model: db.Work, as: "work" },
      ],
    });
    return { success: true, data: checkIns };
  } catch (error) {
    logger.error("Error in getAllCheckInsService:", error.message);
    throw error;
  }
};

/**
 * Lấy thông tin toạ độ (chưa triển khai)
 */
export const getLocationService = async (accessToken, code) => {
  try {
    const secretKey = process.env.ZALO_SECRET_KEY;
    const response = await axios.get("https://graph.zalo.me/v2.0/me/info", {
      headers: {
        access_token: accessToken,
        code: code,
        secret_key: secretKey,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    logger.error("Error in getLocationService:", error.message);
    throw error;
  }
};

/**
 * Lấy check-in theo ID
 */
export const getCheckInByIdService = async (id) => {
  try {
    const checkIn = await db.CheckIn.findByPk(id, {
      include: [
        { model: db.User, as: "user" },
        { model: db.Work, as: "work" },
      ],
    });
    if (!checkIn) {
      throw new Error("Check-in không tồn tại");
    }
    return { success: true, data: checkIn };
  } catch (error) {
    logger.error("Error in getCheckInByIdService:", error.message);
    throw error;
  }
};

/**
 * Check-in người dùng
 */
export const checkInService = async (checkInData) => {
  try {
    const {
      user_id,
      work_id,
      latitude,
      longitude,
      location_name,
      address,
      photo_url,
      device_info,
      ip_address,
      notes,
    } = checkInData;

    if (!user_id || !latitude || !longitude) {
      throw new Error("Thiếu thông tin bắt buộc");
    }

    const checkIn = await db.CheckIn.create({
      user_id,
      work_id,
      check_in_time: new Date(),
      latitude,
      longitude,
      location_name,
      address,
      photo_url,
      status: "checked_in",
      device_info,
      ip_address,
      notes,
    });

    return { success: true, data: checkIn };
  } catch (error) {
    logger.error("Error in checkInService:", error.message);
    throw error;
  }
};

/**
 * Check-out người dùng
 */
export const checkOutService = async (id) => {
  try {
    const checkIn = await db.CheckIn.findByPk(id);
    if (!checkIn) {
      throw new Error("Check-in không tồn tại");
    }

    if (checkIn.check_out_time) {
      throw new Error("Đã check-out rồi");
    }

    const checkOutTime = new Date();
    const durationMinutes = Math.round(
      (checkOutTime - checkIn.check_in_time) / 60000
    );

    await checkIn.update({
      check_out_time: checkOutTime,
      status: "checked_out",
      duration_minutes: durationMinutes,
    });

    return { success: true, data: checkIn };
  } catch (error) {
    logger.error("Error in checkOutService:", error.message);
    throw error;
  }
};

/**
 * Lấy lịch sử check-in của một người dùng
 */
export const getCheckInHistoryByUserIdService = async (userId) => {
  try {
    const checkIns = await db.CheckIn.findAll({
      where: { user_id: userId },
      include: [{ model: db.Work, as: "work" }],
      order: [["check_in_time", "DESC"]],
    });

    return { success: true, data: checkIns };
  } catch (error) {
    logger.error("Error in getCheckInHistoryByUserIdService:", error.message);
    throw error;
  }
};
