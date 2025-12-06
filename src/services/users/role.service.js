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
                {
                    model: db.Permission,
                    as: "permissions",
                    through: { attributes: [] },
                    attributes: ["id", "name", "description"],
                },
            ],
            order: [
                ["level", "ASC"],
                ["created_at", "DESC"],
            ],
        });
        return { success: true, data: roles };
    } catch (error) {
        logger.error("Error in getAllRolesService:" + error.message);
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
                {
                    model: db.Permission,
                    as: "permissions",
                    through: { attributes: [] },
                    attributes: ["id", "name", "description"],
                },
            ],
        });
        if (!role) {
            throw new Error("Vai trò không tồn tại");
        }
        return { success: true, data: role };
    } catch (error) {
        logger.error("Error in getRoleByIdService:" + error.message);
        throw error;
    }
};

/**
 * Tạo vai trò mới
 */
export const createRoleService = async (roleData) => {
  try {
    const { name, description, level, created_by, permissions } = roleData;

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

    // Kiểm tra created_by tồn tại
    if (created_by) {
      const creator = await db.User.findByPk(created_by);
      if (!creator) {
        throw new Error("Người tạo không tồn tại");
      }
    }

    const role = await db.Role.create({
      name,
      description,
      level: level || 10,
      created_by,
    });

    // Gán permissions nếu có
    if (permissions && permissions.length > 0) {
      // Kiểm tra permissions tồn tại
      const perms = await db.Permission.findAll({
        where: { id: permissions },
      });
      if (perms.length !== permissions.length) {
        throw new Error("Một hoặc nhiều quyền hạn không tồn tại");
      }

      // Gán permissions
      await db.RolePermissions.bulkCreate(
        permissions.map((permissionId) => ({
          role_id: role.id,
          permission_id: permissionId,
        }))
      );
    }

    return { success: true, data: role };
  } catch (error) {
    logger.error("Error in createRoleService:" + error.message);
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

    // Kiểm tra updated_by tồn tại
    if (updated_by) {
      const updater = await db.User.findByPk(updated_by);
      if (!updater) {
        throw new Error("Người cập nhật không tồn tại");
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
    logger.error("Error in updateRoleService:" + error.message);
    throw error;
  }
};
