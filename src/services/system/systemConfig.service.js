import db from "../../models/index.js";
import logger from "../../utils/logger.js";

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
    logger.error("Error in getAllSystemConfigService:" + error.message);
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
    logger.error("Error in getSystemConfigByKeyService:" + error.message);
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
    logger.error("Error in createSystemConfigService:" + error.message);
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
    logger.error("Error in updateSystemConfigService:" + error.message);
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
    logger.error("Error in deleteSystemConfigService:" + error.message);
    throw error;
  }
};

/**
 * Lấy toàn bộ cài đặt hệ thống
 */
export const getSystemSettingsService = async () => {
  try {
    let config = await db.SystemConfig.findOne({
      include: [{ model: db.User, as: "updatedByUser" }],
    });

    if (!config) {
      // Tạo record mặc định nếu chưa có
      config = await db.SystemConfig.create({
        settings: {
          companyName: "IMS Solutions",
          companyEmail: "info@imssolutions.com",
          companyPhone: "0123456789",
          lateThreshold: 20,
          attendanceRequired: true,
          maintenanceMode: false,
          emailNotifications: true,
          systemBackupTime: "02:00",
          maxSessionDuration: 480,
          passwordExpiryDays: 90,
          enableTwoFactor: false,
          apiRateLimit: 1000,
          dataRetentionDays: 365,
          shifts: [
            { id: 1, name: "Ca Sáng", startTime: "08:00", endTime: "12:00", isActive: true },
            { id: 2, name: "Ca Chiều", startTime: "13:00", endTime: "17:30", isActive: true },
          ],
          notificationSettings: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            notifyAbsentees: true,
            notifyLatecomers: true,
            dailyReportTime: "09:00",
          },
          defaultPermissions: {
            canViewAttendance: true,
            canViewPayroll: false,
            canViewReports: true,
            canRequestLeave: true,
            canViewProjects: true,
          },
          attendanceLocations: [
            { id: 1, name: "Văn Phòng Chính", latitude: 21.0285, longitude: 105.8542, radius: 100 },
            { id: 2, name: "Chi Nhánh Hà Nội", latitude: 21.0278, longitude: 105.8342, radius: 150 },
          ],
          integrations: {
            slackEnabled: false,
            slackWebhook: "",
            teamsEnabled: false,
            teamsWebhook: "",
            googleCalendarEnabled: false,
            googleCalendarKey: "",
          },
          activityLog: [],
        },
      });
    }

    return { success: true, data: config.settings };
  } catch (error) {
    logger.error("Error in getSystemSettingsService:" + error.message);
    throw error;
  }
};

/**
 * Cập nhật toàn bộ cài đặt hệ thống
 */
export const updateSystemSettingsService = async (settingsData) => {
  try {
    let config = await db.SystemConfig.findOne();

    if (!config) {
      config = await db.SystemConfig.create({ settings: settingsData });
    } else {
      await config.update({
        settings: settingsData,
        updated_at: new Date(),
      });
    }

    return { success: true, data: config.settings };
  } catch (error) {
    logger.error("Error in updateSystemSettingsService:" + error.message);
    throw error;
  }
};
