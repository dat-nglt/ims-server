import db from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * Lấy danh sách tất cả vai trò
 */
export const getAllRolesService = async () => {
  try {
    const roles = await db.Role.findAll();
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
    const role = await db.Role.findByPk(id);
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
    const { name, description } = roleData;

    if (!name) {
      throw new Error("Tên vai trò là bắt buộc");
    }

    // Kiểm tra tên đã tồn tại
    const existingRole = await db.Role.findOne({ where: { name } });
    if (existingRole) {
      throw new Error("Tên vai trò đã tồn tại");
    }

    const role = await db.Role.create({
      name,
      description,
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
    const role = await db.Role.findByPk(id);
    if (!role) {
      throw new Error("Vai trò không tồn tại");
    }

    const { name, description } = updateData;

    // Kiểm tra tên nếu thay đổi
    if (name && name !== role.name) {
      const existingRole = await db.Role.findOne({ where: { name } });
      if (existingRole) {
        throw new Error("Tên vai trò đã tồn tại");
      }
    }

    await role.update({
      name,
      description,
      updated_at: new Date(),
    });

    return { success: true, data: role };
  } catch (error) {
    logger.error("Error in updateRoleService:", error.message);
    throw error;
  }
};

/**
 * Xóa vai trò
 */
export const deleteRoleService = async (id) => {
  try {
    const role = await db.Role.findByPk(id);
    if (!role) {
      throw new Error("Vai trò không tồn tại");
    }

    await role.destroy();

    return { success: true, message: "Xóa vai trò thành công" };
  } catch (error) {
    logger.error("Error in deleteRoleService:", error.message);
    throw error;
  }
};
