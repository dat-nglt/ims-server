import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả người dùng
 */
export const getAllUsersService = async () => {
  try {
    const users = await db.User.findAll({
      include: [
        { model: db.Role, as: "role" },
        { model: db.User, as: "manager" },
      ],
    });
    return { success: true, data: users };
  } catch (error) {
    logger.error("Error in getAllUsersService:", error.message);
    throw error;
  }
};

/**
 * Lấy thông tin người dùng theo ID
 */
export const getUserByIdService = async (id) => {
  try {
    const user = await db.User.findByPk(id, {
      include: [
        { model: db.Role, as: "role" },
        { model: db.User, as: "manager" },
      ],
    });
    
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    
    return { success: true, data: user };
  } catch (error) {
    logger.error("Error in getUserByIdService:", error.message);
    throw error;
  }
};

/**
 * Tạo người dùng mới
 */
export const createUserService = async (userData) => {
  try {
    const {
      employee_id,
      name,
      position,
      email,
      phone,
      role_id,
      department,
      manager_id,
    } = userData;

    // Validation
    if (!employee_id || !name || !position || !email || !role_id) {
      throw new Error("Thiếu thông tin bắt buộc");
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email đã được sử dụng");
    }

    // Kiểm tra employee_id đã tồn tại
    const existingEmployee = await db.User.findOne({ where: { employee_id } });
    if (existingEmployee) {
      throw new Error("Mã nhân viên đã tồn tại");
    }

    const user = await db.User.create({
      employee_id,
      name,
      position,
      email,
      phone,
      role_id,
      department,
      manager_id,
    });

    return { success: true, data: user };
  } catch (error) {
    logger.error("Error in createUserService:", error.message);
    throw error;
  }
};

/**
 * Cập nhật thông tin người dùng
 */
export const updateUserService = async (id, updateData) => {
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const {
      name,
      position,
      email,
      phone,
      role_id,
      department,
      manager_id,
      status,
      is_active,
    } = updateData;

    // Kiểm tra email nếu thay đổi
    if (email && email !== user.email) {
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("Email đã được sử dụng");
      }
    }

    await user.update({
      name,
      position,
      email,
      phone,
      role_id,
      department,
      manager_id,
      status,
      is_active,
      updated_at: new Date(),
    });

    return { success: true, data: user };
  } catch (error) {
    logger.error("Error in updateUserService:", error.message);
    throw error;
  }
};

/**
 * Xóa người dùng
 */
export const deleteUserService = async (id) => {
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    await user.destroy();

    return { success: true, message: "Xóa người dùng thành công" };
  } catch (error) {
    logger.error("Error in deleteUserService:", error.message);
    throw error;
  }
};
