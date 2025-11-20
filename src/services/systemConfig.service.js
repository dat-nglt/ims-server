import db from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * Lấy tất cả cấu hình
 */
export const getAllSystemConfigService = async () => {
  try {
    const configs = await db.SystemConfig.findAll({
      include: [{ model: db.User, as: "updatedByUser" }],
    });

    return { success: true, data: configs };
  } catch (error) {
    logger.error("Error in getAllSystemConfigService:", error.message);
    throw error;
  }
};

/**
 * Lấy cấu hình theo key
 */
export const getSystemConfigByKeyService = async (key) => {
  try {
    const config = await db.SystemConfig.findOne({
      where: { config_key: key },
      include: [{ model: db.User, as: "updatedByUser" }],
    });

    if (!config) {
      throw new Error("Cấu hình không tồn tại");
    }

    return { success: true, data: config };
  } catch (error) {
    logger.error("Error in getSystemConfigByKeyService:", error.message);
    throw error;
  }
};

/**
 * Tạo cấu hình
 */
export const createSystemConfigService = async (configData) => {
  try {
    const { config_key } = configData;

    if (!config_key) {
      throw new Error("config_key là bắt buộc");
    }

    const config = await db.SystemConfig.create(configData);

    return { success: true, data: config };
  } catch (error) {
    logger.error("Error in createSystemConfigService:", error.message);
    throw error;
  }
};

/**
 * Cập nhật cấu hình
 */
export const updateSystemConfigService = async (key, updateData) => {
  try {
    const config = await db.SystemConfig.findOne({
      where: { config_key: key },
    });

    if (!config) {
      throw new Error("Cấu hình không tồn tại");
    }

    await config.update({
      ...updateData,
      updated_at: new Date(),
    });

    return { success: true, data: config };
  } catch (error) {
    logger.error("Error in updateSystemConfigService:", error.message);
    throw error;
  }
};

/**
 * Xóa cấu hình
 */
export const deleteSystemConfigService = async (key) => {
  try {
    const config = await db.SystemConfig.findOne({
      where: { config_key: key },
    });

    if (!config) {
      throw new Error("Cấu hình không tồn tại");
    }

    await config.destroy();

    return { success: true, message: "Xóa cấu hình thành công" };
  } catch (error) {
    logger.error("Error in deleteSystemConfigService:", error.message);
    throw error;
  }
};
