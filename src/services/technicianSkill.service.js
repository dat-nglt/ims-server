import db from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * Lấy danh sách tất cả cấp bậc
 */
export const getAllTechnicianSkillsService = async () => {
  try {
    const skills = await db.TechnicianSkill.findAll({
      include: [{ model: db.User, as: "technician" }],
    });

    return { success: true, data: skills };
  } catch (error) {
    logger.error("Error in getAllTechnicianSkillsService:", error.message);
    throw error;
  }
};

/**
 * Lấy cấp bậc theo technician ID
 */
export const getTechnicianSkillByTechnicianIdService = async (technicianId) => {
  try {
    const skills = await db.TechnicianSkill.findAll({
      where: { technician_id: technicianId },
      include: [{ model: db.User, as: "technician" }],
    });

    return { success: true, data: skills };
  } catch (error) {
    logger.error(
      "Error in getTechnicianSkillByTechnicianIdService:",
      error.message
    );
    throw error;
  }
};

/**
 * Phân công cấp bậc
 */
export const assignTechnicianSkillService = async (skillData) => {
  try {
    const { technician_id, technician_level } = skillData;

    if (!technician_id || !technician_level) {
      throw new Error("Thiếu thông tin bắt buộc: technician_id, technician_level");
    }

    // Kiểm tra giá trị hợp lệ
    const validLevels = ["Kỹ thuật chính", "Kỹ thuật phụ", "Kỹ thuật viên thực tập"];
    if (!validLevels.includes(technician_level)) {
      throw new Error(
        `Cấp bậc không hợp lệ. Chỉ chấp nhận: ${validLevels.join(", ")}`
      );
    }

    const skill = await db.TechnicianSkill.create({
      technician_id,
      technician_level,
      assigned_at: new Date(),
    });

    return { success: true, data: skill };
  } catch (error) {
    logger.error("Error in assignTechnicianSkillService:", error.message);
    throw error;
  }
};

/**
 * Cập nhật cấp bậc
 */
export const updateTechnicianSkillService = async (id, updateData) => {
  try {
    const skill = await db.TechnicianSkill.findByPk(id);
    if (!skill) {
      throw new Error("Cấp bậc không tồn tại");
    }

    const { technician_level } = updateData;

    // Kiểm tra giá trị hợp lệ nếu cập nhật
    if (technician_level) {
      const validLevels = ["Kỹ thuật chính", "Kỹ thuật phụ", "Kỹ thuật viên thực tập"];
      if (!validLevels.includes(technician_level)) {
        throw new Error(
          `Cấp bậc không hợp lệ. Chỉ chấp nhận: ${validLevels.join(", ")}`
        );
      }
    }

    await skill.update({
      ...updateData,
      assigned_at: new Date(),
    });

    return { success: true, data: skill };
  } catch (error) {
    logger.error("Error in updateTechnicianSkillService:", error.message);
    throw error;
  }
};

/**
 * Xóa cấp bậc
 */
export const deleteTechnicianSkillService = async (id) => {
  try {
    const skill = await db.TechnicianSkill.findByPk(id);
    if (!skill) {
      throw new Error("Cấp bậc không tồn tại");
    }

    await skill.destroy();

    return { success: true, message: "Xóa cấp bậc thành công" };
  } catch (error) {
    logger.error("Error in deleteTechnicianSkillService:", error.message);
    throw error;
  }
};
