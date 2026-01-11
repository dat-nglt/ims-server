import { Op } from "sequelize";
import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import * as employeeProfileService from "../hr/employee-profile.service.js";
/**
 * Lấy danh sách tất cả người dùng
 * SQL: SELECT u.*, ur.*, r.*, m.*, ep.* FROM users u
 * LEFT JOIN user_roles ur ON u.id = ur.user_id
 * LEFT JOIN roles r ON ur.role_id = r.id AND r.is_deleted = false
 * LEFT JOIN users m ON u.manager_id = m.id
 * LEFT JOIN employee_profiles ep ON u.id = ep.user_id AND ep.is_active = true
 */
export const getAllUsersService = async () => {
  try {
    const users = await db.User.findAll({
      include: [
        {
          model: db.UserRoles,
          as: "userRoles",
          include: [{ model: db.Role, as: "role" }],
        },
        {
          model: db.EmployeeProfile,
          as: "profile",
          where: { is_active: true },
          required: false, // Left join
        },
      ],
      order: [["created_at", "DESC"]], // Sắp xếp theo ngày mới tạo giảm dần
    });
    return { success: true, data: users };
  } catch (error) {
    logger.error("Error in getAllUsersService:" + error.message);
    throw error;
  }
};

/**
 * Lấy thông tin người dùng theo ID
 * SQL: SELECT u.*, ur.*, r.*, m.*, ep.* FROM users u
 * LEFT JOIN user_roles ur ON u.id = ur.user_id
 * LEFT JOIN roles r ON ur.role_id = r.id AND r.is_deleted = false
 * LEFT JOIN users m ON u.manager_id = m.id
 * LEFT JOIN employee_profiles ep ON u.id = ep.user_id AND ep.is_active = true
 * WHERE u.id = ?;
 */
export const getUserByIdService = async (id) => {
  try {
    const user = await db.User.findByPk(id, {
      include: [
        {
          model: db.UserRoles,
          as: "userRoles",
          include: [{ model: db.Role, as: "role" }],
        },
        {
          model: db.EmployeeProfile,
          as: "profile",
          where: { is_active: true },
          required: false,
        },
      ],
    });

    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    return { success: true, data: user };
  } catch (error) {
    logger.error("Error in getUserByIdService:" + error.message);
    throw error;
  }
};

/**
 * Tạo người dùng mới
 * SQL: INSERT INTO users (employee_id, name, position, email, phone, department, manager_id, avatar_url, zalo_id, status, is_active, created_at, updated_at)
 * VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
 * Note: Chỉ validate conflict với user có is_active = true, cho phép tạo trùng với user đã bị deactivate
 */
export const createUserService = async (userData) => {
  try {
    const {
      avatar_url,
      name,
      phone,
      email,
      zalo_id,
      employee_id,
      manager_id,
      status = "active", // Default status
      is_active = true, // Default is_active
    } = userData;

    // Validation cơ bản
    if (!employee_id || !name) {
      throw new Error("Thiếu thông tin bắt buộc: employee_id, name");
    }

    // Validation conflict với user active - sử dụng 1 query duy nhất
    const whereConditions = {}; // Check all users, not just active, since employee_id should be unique globally
    const orConditions = [];

    if (zalo_id) {
      orConditions.push({ zalo_id });
    }
    if (email) {
      orConditions.push({ email });
    }
    if (phone) {
      orConditions.push({ phone });
    }
    orConditions.push({ employee_id }); // Luôn kiểm tra employee_id

    if (orConditions.length > 0) {
      whereConditions[Op.or] = orConditions;

      const existingUser = await db.User.findOne({
        where: whereConditions,
      });
      if (existingUser) {
        // Xác định trường nào bị conflict
        let conflictField = "";
        if (existingUser.employee_id === employee_id) {
          conflictField = "Mã nhân viên";
        } else if (zalo_id && existingUser.zalo_id === zalo_id) {
          conflictField = "Zalo ID";
        } else if (email && existingUser.email === email) {
          conflictField = "Email";
        } else if (phone && existingUser.phone === phone) {
          conflictField = "Số điện thoại";
        }
        throw new Error(`${conflictField} đã tồn tại trong hệ thống`);
      }
    }

    // Note: department moved to EmployeeProfile. Do not include department in Users table inserts to avoid DB errors.
    const user = await db.User.create({
      employee_id,
      name,
      email,
      phone,
      manager_id,
      avatar_url,
      zalo_id,
      status,
      is_active,
    });
    return { success: true, data: user };
  } catch (error) {
    if (error instanceof db.Sequelize.ValidationError) {
      const messages = error.errors.map((e) => e.message).join(", ");
      logger.error("Validation error in createUserService: " + messages);
      throw new Error("Dữ liệu không hợp lệ: " + messages);
    }
    logger.error("Error in createUserService:" + error.message);
    throw error;
  }
};

/**
 * Cập nhật thông tin người dùng
 * SQL: UPDATE users SET name = ?, position = ?, email = ?, phone = ?, zalo_id = ?, employee_id = ?, role_id = ?, department = ?, manager_id = ?, status = ?, is_active = ?, approved = ?, updated_at = NOW()
 * WHERE id = ?;
 * Note: Chỉ validate conflict với user có is_active = true, cho phép cập nhật trùng với user đã bị deactivate
 */
export const updateUserService = async (id, updateData) => {
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return { success: false, message: "Người dùng không tồn tại" };
    }

    const { email, phone, zalo_id, employee_id } = updateData;

    // Validation conflict với user active khác - sử dụng 1 query duy nhất
    const whereConditions = {
      id: { [Op.ne]: id }, // Exclude current user, check all users
      is_active: true, // Only check conflicts with active users
    };
    const orConditions = [];

    // Chỉ kiểm tra các trường được cung cấp và khác với giá trị hiện tại
    if (zalo_id && zalo_id !== user.zalo_id) {
      orConditions.push({ zalo_id });
    }
    if (email && email !== user.email) {
      orConditions.push({ email });
    }
    if (phone && phone !== user.phone) {
      orConditions.push({ phone });
    }
    if (employee_id && employee_id !== user.employee_id) {
      orConditions.push({ employee_id });
    }

    if (orConditions.length > 0) {
      whereConditions[Op.or] = orConditions;

      const existingUser = await db.User.findOne({
        where: whereConditions,
      });
      if (existingUser) {
        // Xác định trường nào bị conflict
        let conflictField = "";
        if (employee_id && existingUser.employee_id === employee_id) {
          conflictField = "Mã nhân viên";
        } else if (zalo_id && existingUser.zalo_id === zalo_id) {
          conflictField = "Zalo ID";
        } else if (email && existingUser.email === email) {
          conflictField = "Email";
        } else if (phone && existingUser.phone === phone) {
          conflictField = "Số điện thoại";
        }
        return { success: false, message: `${conflictField} đã tồn tại trong hệ thống` };
      }
    }

    const updatableFields = [
      "name",
      "position_id",
      "email",
      "phone",
      "zalo_id",
      "employee_id",
      "role_id",
      "manager_id",
      "status",
      "is_active",
      "approved",
      "password",
    ];

    const updates = {};
    for (const f of updatableFields) {
      if (typeof updateData[f] !== "undefined") {
        updates[f] = updateData[f];
      }
    }
    updates.updated_at = new Date();

    await user.update(updates);

    // Note: department field has beoved from EmployeeProfile (legacy field)
    // Use updateEmployeeProfileAPI/updateEmployeeProfileService with department_id
    // Department association now handled via departmentInfo relationship

    return { success: true, data: user };
  } catch (error) {
    logger.error("Error in updateUserService:" + error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Xóa người dùng (soft delete)
 * SQL: UPDATE users SET is_active = false, updated_at = NOW() WHERE id = ?;
 */
export const deleteUserService = async (id) => {
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // Optional: Check if user has active roles or other constraints before soft delete
    // For now, allow soft delete

    await user.update({
      is_active: false,
      updated_at: new Date(),
    });

    return { success: true, message: "Xóa người dùng thành công" };
  } catch (error) {
    logger.error("Error in deleteUserService:" + error.message);
    throw error;
  }
};

/**
 * Duyệt tài khoản người dùng
 * SQL: UPDATE users SET approved = 'approved', updated_at = NOW() WHERE id = ?;
 */
export const approveUserService = async (employee_id) => {
  try {
    console.log("Đã đến đây" + employee_id);
    const user = await db.User.findOne({ where: { employee_id } });
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // Kiểm tra trạng thái hiện tại
    if (user.approved === "approved") {
      throw new Error("Tài khoản đã được duyệt");
    }

    // Approve and create profile atomically
    const result = await db.sequelize.transaction(async (t) => {
      await user.update(
        {
          approved: "approved",
          updated_at: new Date(),
        },
        { transaction: t }
      );

      // Create a default employee profile if not exists
      const [profile, created] = await db.EmployeeProfile.findOrCreate({
        where: { user_id: user.id },
        defaults: {
          user_id: user.id,
          department_id: null,
          specialization: [],
          certification: [],
          phone_secondary: null,
          address: null,
          date_of_birth: null,
          gender: null,
          id_number: null,
          hire_date: null,
          contract_date: null,
          bank_account_number: null,
          bank_name: "ACB",
          total_experience_years: null,
          performance_rating: null,
          dailySalary: 500000.0,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        transaction: t,
      });

      return { user, profile, created };
    });

    return { success: true, data: result };
  } catch (error) {
    logger.error("Error in approveUserService:" + error.message);
    throw error;
  }
};

/**
 * Từ chối tài khoản người dùng
 * SQL: UPDATE users SET approved = 'rejected', updated_at = NOW() WHERE zalo_id = ?;
 */
export const rejectUserService = async (employee_id) => {
  try {
    const user = await db.User.findOne({ where: { employee_id } });
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // Kiểm tra trạng thái hiện tại
    if (user.approved === "rejected") {
      throw new Error("Tài khoản đã bị từ chối");
    }

    await user.update({
      approved: "rejected",
      updated_at: new Date(),
    });

    return { success: true, data: user };
  } catch (error) {
    logger.error("Error in rejectUserService:" + error.message);
    throw error;
  }
};

/**
 * Lấy thông tin người dùng theo số điện thoại
 */
export const getUserByPhoneService = async (phone) => {
  try {
    const user = await db.User.findOne({
      where: { phone },
      include: [
        {
          model: db.UserRoles,
          as: "userRoles",
          include: [{ model: db.Role, as: "role" }],
        },
      ],
    });

    if (!user) {
      return { success: false, message: "Người dùng không tồn tại" };
    }

    return { success: true, data: user };
  } catch (error) {
    logger.error("Error in getUserByPhoneService:" + error.message);
    throw error;
  }
};

/**
 * Lấy thông tin người dùng theo Zalo ID
 */
export const getUserByZaloIdService = async (zalo_id) => {
  try {
    const user = await db.User.findOne({
      where: { zalo_id },
      include: [
        {
          model: db.UserRoles,
          as: "userRoles",
          include: [{ model: db.Role, as: "role" }],
        },
      ],
    });

    if (!user) {
      return { success: false, message: "Người dùng không tồn tại" };
    }

    return { success: true, data: user };
  } catch (error) {
    logger.error("Error in getUserByZaloIdService:" + error.message);
    throw error;
  }
};

/**
 * Lấy roles của user
 */
export const getUserRolesService = async (userId) => {
  try {
    const userRoles = await db.UserRoles.findAll({
      where: { user_id: userId },
      include: [{ model: db.Role, as: "role" }],
    });

    const roles = userRoles.map((ur) => ur.role).filter((r) => r);
    return { success: true, data: roles };
  } catch (error) {
    logger.error("Error in getUserRolesService:" + error.message);
    throw error;
  }
};

/**
 * Lấy permissions của user
 */
export const getUserPermissionsService = async (userId) => {
  try {
    const userRoles = await db.UserRoles.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Role,
          as: "role",
          include: [
            {
              model: db.RolePermissions,
              as: "rolePermissions",
              include: [{ model: db.Permission, as: "permission" }],
            },
          ],
        },
      ],
    });

    const permissions = [];
    userRoles.forEach((ur) => {
      if (ur.role && ur.role.rolePermissions) {
        ur.role.rolePermissions.forEach((rp) => {
          if (rp.permission) {
            permissions.push(rp.permission);
          }
        });
      }
    });

    // Remove duplicates
    const uniquePermissions = permissions.filter(
      (perm, index, self) => index === self.findIndex((p) => p.id === perm.id)
    );

    return { success: true, data: uniquePermissions };
  } catch (error) {
    logger.error("Error in getUserPermissionsService:" + error.message);
    throw error;
  }
};
