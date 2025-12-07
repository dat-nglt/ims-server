import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả kỹ năng
 * SQL: SELECT ts.*, u.* FROM technician_skills ts LEFT JOIN users u ON ts.technician_id = u.id;
 */
export const getAllTechnicianSkillsService = async () => {
    try {
        const skills = await db.TechnicianSkill.findAll({
            include: [{ model: db.User, as: "technician" }],
            order: [["assigned_at", "DESC"]],
        });

        return { success: true, data: skills };
    } catch (error) {
        logger.error("Error in getAllTechnicianSkillsService:" + error.message);
        throw error;
    }
};

/**
 * Lấy kỹ năng theo technician ID
 * SQL: SELECT ts.*, u.* FROM technician_skills ts LEFT JOIN users u ON ts.technician_id = u.id WHERE ts.technician_id = ?;
 */
export const getTechnicianSkillByTechnicianIdService = async (technicianId) => {
    try {
        const skills = await db.TechnicianSkill.findAll({
            where: { technician_id: technicianId },
            include: [{ model: db.User, as: "technician" }],
            order: [["assigned_at", "DESC"]],
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
 * Tạo kỹ năng
 * SQL: INSERT INTO technician_skills (technician_id, technician_level, assigned_at, created_at) VALUES (?, ?, NOW(), NOW());
 */
export const createTechnicianSkillService = async (skillData) => {
    try {
        let { technician_id, technician_level } = skillData;

        if (!technician_id || !technician_level) {
            throw new Error("technician_id và technician_level là bắt buộc");
        }

        // Normalize technician_level
        const allowedLevels = [
            "Kỹ thuật chính",
            "Kỹ thuật phụ",
            "Kỹ thuật viên thực tập",
        ];
        const normalizedLevel = allowedLevels.find(
            (level) =>
                level.toLowerCase() === technician_level.toLowerCase().trim()
        );
        if (!normalizedLevel) {
            throw new Error("Cấp bậc kỹ thuật viên không hợp lệ");
        }
        technician_level = normalizedLevel;

        // Kiểm tra user tồn tại
        const user = await db.User.findByPk(technician_id);
        if (!user || !user.is_active) {
            throw new Error("Kỹ thuật viên không tồn tại hoặc không hoạt động");
        }

        // Kiểm tra kỹ năng đã tồn tại cho technician này
        const existingSkill = await db.TechnicianSkill.findOne({
            where: { technician_id, technician_level },
        });
        if (existingSkill) {
            throw new Error("Kỹ năng này đã tồn tại cho kỹ thuật viên");
        }

        const skill = await db.TechnicianSkill.create({
            technician_id,
            technician_level,
            assigned_at: new Date(),
        });

        return { success: true, data: skill };
    } catch (error) {
        logger.error("Error in createTechnicianSkillService:" + error.message);
        throw error;
    }
};

/**
 * Cập nhật kỹ năng
 * SQL: UPDATE technician_skills SET technician_level = ?, assigned_at = NOW() WHERE technician_id = ?;
 */
export const updateTechnicianSkillService = async (
    technicianId,
    updateData
) => {
    try {
        const { technician_level } = updateData;

        console.log(technician_level, technicianId);
        

        const skill = await db.TechnicianSkill.findOne({
            where: { technician_id: technicianId },
        });

        if (!skill) {
            throw new Error("Kỹ năng kỹ thuật viên không tồn tại");
        }

        await skill.update({
            technician_level,
            assigned_at: new Date(),
        });

        return { success: true, data: skill };
    } catch (error) {
        logger.error("Error in updateTechnicianSkillService:" + error.message);
        throw error;
    }
};

/**
 * Xóa kỹ năng
 * SQL: DELETE FROM technician_skills WHERE id = ?;
 */
export const deleteTechnicianSkillService = async (id) => {
    try {
        const skill = await db.TechnicianSkill.findByPk(id);
        if (!skill) {
            throw new Error("Kỹ năng kỹ thuật viên không tồn tại");
        }

        await skill.destroy();

        return {
            success: true,
            message: "Xóa kỹ năng kỹ thuật viên thành công",
        };
    } catch (error) {
        logger.error("Error in deleteTechnicianSkillService:" + error.message);
        throw error;
    }
};
