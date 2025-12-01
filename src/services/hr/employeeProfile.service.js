import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả hồ sơ
 */
export const getAllEmployeeProfilesService = async () => {
  try {
    const profiles = await db.EmployeeProfile.findAll({
      include: [{ model: db.User, as: "user" }],
    });

    return { success: true, data: profiles };
  } catch (error) {
    logger.error("Error in getAllEmployeeProfilesService:", error.message);
    throw error;
  }
};

/**
 * Lấy hồ sơ theo user ID
 */
export const getEmployeeProfileByUserIdService = async (userId) => {
  try {
    const profile = await db.EmployeeProfile.findOne({
      where: { user_id: userId },
      include: [{ model: db.User, as: "user" }],
    });

    if (!profile) {
      throw new Error("Hồ sơ nhân viên không tồn tại");
    }

    return { success: true, data: profile };
  } catch (error) {
    logger.error("Error in getEmployeeProfileByUserIdService:", error.message);
    throw error;
  }
};

/**
 * Tạo hồ sơ
 */
export const createEmployeeProfileService = async (profileData) => {
  try {
    const { user_id } = profileData;

    if (!user_id) {
      throw new Error("user_id là bắt buộc");
    }

    const profile = await db.EmployeeProfile.create(profileData);

    return { success: true, data: profile };
  } catch (error) {
    logger.error("Error in createEmployeeProfileService:", error.message);
    throw error;
  }
};

/**
 * Cập nhật hồ sơ
 */
export const updateEmployeeProfileService = async (userId, updateData) => {
  try {
    const profile = await db.EmployeeProfile.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new Error("Hồ sơ nhân viên không tồn tại");
    }

    await profile.update({
      ...updateData,
      updated_at: new Date(),
    });

    return { success: true, data: profile };
  } catch (error) {
    logger.error("Error in updateEmployeeProfileService:", error.message);
    throw error;
  }
};
