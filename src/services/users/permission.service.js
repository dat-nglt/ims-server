import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả quyền hạn (không bao gồm đã xóa mềm)
 */
export const getAllPermissionsService = async () => {
    try {
        const permissions = await db.Permission.findAll({
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
        if (!permission) {
            throw new Error("Quyền hạn không tồn tại");
        }
        return { success: true, data: permission };
    } catch (error) {
        logger.error("Error in getPermissionByIdService:" + error.message);
        throw error;
    }
};

/**
 * Tạo quyền hạn mới
 */
export const createPermissionService = async (permissionData) => {
  try {
    const { name, description, category, created_by } = permissionData;

    if (!name) {
      throw new Error("Tên quyền hạn là bắt buộc");
    }

    // Kiểm tra tên đã tồn tại
    const existingPermission = await db.Permission.findOne({
      where: { name, is_deleted: false },
    });
    if (existingPermission) {
      throw new Error("Tên quyền hạn đã tồn tại");
    }

    // Kiểm tra created_by tồn tại
    if (created_by) {
      const creator = await db.User.findByPk(created_by);
      if (!creator) {
        throw new Error("Người tạo không tồn tại");
      }
    }

    const permission = await db.Permission.create({
      name,
      description,
      category,
      created_by,
    });

    return { success: true, data: permission };
  } catch (error) {
    logger.error("Error in createPermissionService:" + error.message);
    throw error;
  }
};

/**
 * Cập nhật quyền hạn
 */
export const updatePermissionService = async (id, updateData) => {
  try {
    const permission = await db.Permission.findOne({
      where: { id, is_deleted: false },
    });
    if (!permission) {
      throw new Error("Quyền hạn không tồn tại");
    }

    const { name, description, category, updated_by } = updateData;

    // Kiểm tra tên nếu thay đổi
    if (name && name !== permission.name) {
      const existingPermission = await db.Permission.findOne({
        where: { name, is_deleted: false },
      });
      if (existingPermission) {
        throw new Error("Tên quyền hạn đã tồn tại");
      }
    }

    // Kiểm tra updated_by tồn tại
    if (updated_by) {
      const updater = await db.User.findByPk(updated_by);
      if (!updater) {
        throw new Error("Người cập nhật không tồn tại");
      }
    }

    await permission.update({
      name,
      description,
      category,
      updated_by,
      updated_at: new Date(),
    });

    return { success: true, data: permission };
  } catch (error) {
    logger.error("Error in updatePermissionService:" + error.message);
    throw error;
  }
};

/**
 * Xóa quyền hạn (soft delete)
 */
export const deletePermissionService = async (id, deleted_by) => {
  try {
    const permission = await db.Permission.findOne({
      where: { id, is_deleted: false },
    });
    if (!permission) {
      throw new Error("Quyền hạn không tồn tại");
    }

    // Kiểm tra có user nào đang dùng permission này không
    const usersCount = await db.UserRolePermission.count({
      where: { permission_id: id },
    });
    if (usersCount > 0) {
      throw new Error("Không thể xóa quyền hạn đang được sử dụng");
    }

    // Kiểm tra deleted_by tồn tại
    if (deleted_by) {
      const deleter = await db.User.findByPk(deleted_by);
      if (!deleter) {
        throw new Error("Người xóa không tồn tại");
      }
    }

    await permission.update({
      is_deleted: true,
      updated_by: deleted_by,
      updated_at: new Date(),
    });

    return { success: true, message: "Xóa quyền hạn thành công" };
  } catch (error) {
    logger.error("Error in deletePermissionService:" + error.message);
    throw error;
  }
};
