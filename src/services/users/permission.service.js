import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả quyền hạn (không bao gồm đã xóa mềm)
 */
export const getAllPermissionsService = async () => {
    try {
        const permissions = await db.Permission.findAll({
            where: { is_deleted: false },
            order: [
                ["category", "ASC"],
                ["name", "ASC"],
            ],
        });
        return { success: true, data: permissions };
    } catch (error) {
        logger.error("Error in getAllPermissionsService:" + error.message);
        throw error;
    }
};

/**
 * Lấy quyền hạn theo ID
 */
export const getPermissionByIdService = async (id) => {
    try {
        const permission = await db.Permission.findOne({
            where: { id, is_deleted: false },
        });
        if (!permission) {
            throw new Error("Quyền hạn không tồn tại");
        }
        return { success: true, data: permission };
    } catch (error) {
        logger.error("Error in getPermissionByIdService:" + error.message);
        throw error;
    }
};

// Các service CRUD khác đã được loại bỏ - chỉ giữ lại read operations
