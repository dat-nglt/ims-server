import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả vai trò (không bao gồm đã xóa mềm)
 */
export const getAllRolesService = async () => {
    try {
        const roles = await db.Role.findAll({
            where: { is_deleted: false },
            include: [
                {
                    model: db.User,
                    as: "creator",
                    attributes: ["id", "name"],
                },
                {
                    model: db.User,
                    as: "updater",
                    attributes: ["id", "name"],
                },
            ],
            order: [
                ["level", "ASC"],
                ["created_at", "DESC"],
            ],
        });
        return { success: true, data: roles };
    } catch (error) {
        logger.error("Error in getAllRolesService:", error.message);
        throw error;
    }
};

/**
 * Lấy vai trò theo ID
 */
export const getRoleByIdService = async (id) => {
    try {
        const role = await db.Role.findOne({
            where: { id, is_deleted: false },
            include: [
                {
                    model: db.User,
                    as: "creator",
                    attributes: ["id", "name"],
                },
                {
                    model: db.User,
                    as: "updater",
                    attributes: ["id", "name"],
                },
            ],
        });
        if (!role) {
            throw new Error("Vai trò không tồn tại");
        }
        return { success: true, data: role };
    } catch (error) {
        logger.error("Error in getRoleByIdService:", error.message);
        throw error;
    }
};

/**
 * Tạo vai trò mới
 */
export const createRoleService = async (roleData) => {
    try {
        const { name, description, level, created_by } = roleData;

        if (!name) {
            throw new Error("Tên vai trò là bắt buộc");
        }

        // Kiểm tra tên đã tồn tại
        const existingRole = await db.Role.findOne({
            where: { name, is_deleted: false },
        });
        if (existingRole) {
            throw new Error("Tên vai trò đã tồn tại");
        }

        const role = await db.Role.create({
            name,
            description,
            level: level || 10,
            created_by,
        });

        return { success: true, data: role };
    } catch (error) {
        logger.error("Error in createRoleService:", error.message);
        throw error;
    }
};

/**
 * Cập nhật vai trò
 */
export const updateRoleService = async (id, updateData) => {
    try {
        const role = await db.Role.findOne({
            where: { id, is_deleted: false },
        });
        if (!role) {
            throw new Error("Vai trò không tồn tại");
        }

        const { name, description, level, updated_by } = updateData;

        // Kiểm tra tên nếu thay đổi
        if (name && name !== role.name) {
            const existingRole = await db.Role.findOne({
                where: { name, is_deleted: false },
            });
            if (existingRole) {
                throw new Error("Tên vai trò đã tồn tại");
            }
        }

        await role.update({
            name,
            description,
            level,
            updated_by,
            updated_at: new Date(),
        });

        return { success: true, data: role };
    } catch (error) {
        logger.error("Error in updateRoleService:", error.message);
        throw error;
    }
};

/**
 * Xóa vai trò (soft delete)
 */
export const deleteRoleService = async (id, deleted_by) => {
    try {
        const role = await db.Role.findOne({
            where: { id, is_deleted: false },
        });
        if (!role) {
            throw new Error("Vai trò không tồn tại");
        }

        // Kiểm tra có user nào đang dùng role này không
        const usersCount = await db.User.count({
            where: { is_active: true },
        });
        if (usersCount > 0) {
            throw new Error("Không thể xóa vai trò đang được sử dụng");
        }

        await role.update({
            is_deleted: true,
            updated_by: deleted_by,
            updated_at: new Date(),
        });

        return { success: true, message: "Xóa vai trò thành công" };
    } catch (error) {
        logger.error("Error in deleteRoleService:", error.message);
        throw error;
    }
};
