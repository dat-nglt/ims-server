import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả quyền hạn
 */
export const getAllPermissionsService = async () => {
  try {
    const permissions = await db.Permission.findAll();
    return { success: true, data: permissions };
  } catch (error) {
    logger.error("Error in getAllPermissionsService:", error.message);
    throw error;
  }
};

/**
 * Lấy quyền hạn theo ID
 */
export const getPermissionByIdService = async (id) => {
  try {
    const permission = await db.Permission.findByPk(id);
    if (!permission) {
      throw new Error("Quyền hạn không tồn tại");
    }
    return { success: true, data: permission };
  } catch (error) {
    logger.error("Error in getPermissionByIdService:", error.message);
    throw error;
  }
};

/**
 * Tạo quyền hạn mới
 */
export const createPermissionService = async (permissionData) => {
  try {
    const { name, description } = permissionData;

    if (!name) {
      throw new Error("Tên quyền hạn là bắt buộc");
    }

    // Kiểm tra tên đã tồn tại
    const existingPermission = await db.Permission.findOne({ where: { name } });
    if (existingPermission) {
      throw new Error("Tên quyền hạn đã tồn tại");
    }

    const permission = await db.Permission.create({
      name,
      description,
    });

    return { success: true, data: permission };
  } catch (error) {
    logger.error("Error in createPermissionService:", error.message);
    throw error;
  }
};

/**
 * Cập nhật quyền hạn
 */
export const updatePermissionService = async (id, updateData) => {
  try {
    const permission = await db.Permission.findByPk(id);
    if (!permission) {
      throw new Error("Quyền hạn không tồn tại");
    }

    const { name, description } = updateData;

    // Kiểm tra tên nếu thay đổi
    if (name && name !== permission.name) {
      const existingPermission = await db.Permission.findOne({ where: { name } });
      if (existingPermission) {
        throw new Error("Tên quyền hạn đã tồn tại");
      }
    }

    await permission.update({
      name,
      description,
      updated_at: new Date(),
    });

    return { success: true, data: permission };
  } catch (error) {
    logger.error("Error in updatePermissionService:", error.message);
    throw error;
  }
};

/**
 * Xóa quyền hạn
 */
export const deletePermissionService = async (id) => {
  try {
    const permission = await db.Permission.findByPk(id);
    if (!permission) {
      throw new Error("Quyền hạn không tồn tại");
    }

    await permission.destroy();

    return { success: true, message: "Xóa quyền hạn thành công" };
  } catch (error) {
    logger.error("Error in deletePermissionService:", error.message);
    throw error;
  }
};
