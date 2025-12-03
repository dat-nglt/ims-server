import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả người dùng
 * SQL: SELECT u.*, ur.*, r.*, m.*, ep.*, ts.* FROM users u
 * LEFT JOIN user_roles ur ON u.id = ur.user_id
 * LEFT JOIN roles r ON ur.role_id = r.id AND r.is_deleted = false
 * LEFT JOIN users m ON u.manager_id = m.id
 * LEFT JOIN employee_profiles ep ON u.id = ep.user_id AND ep.is_active = true
 * LEFT JOIN technician_skills ts ON u.id = ts.technician_id;
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
                {
                    model: db.TechnicianSkill,
                    as: "skills",
                    required: false, // Left join
                },
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
 * SQL: SELECT u.*, ur.*, r.*, m.*, ep.*, ts.* FROM users u
 * LEFT JOIN user_roles ur ON u.id = ur.user_id
 * LEFT JOIN roles r ON ur.role_id = r.id AND r.is_deleted = false
 * LEFT JOIN users m ON u.manager_id = m.id
 * LEFT JOIN employee_profiles ep ON u.id = ep.user_id AND ep.is_active = true
 * LEFT JOIN technician_skills ts ON u.id = ts.technician_id
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
                {
                    model: db.TechnicianSkill,
                    as: "skills",
                    required: false,
                },
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
 * SQL: INSERT INTO users (employee_id, name, position, email, phone, department, manager_id, created_at, updated_at)
 * VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
 */
export const createUserService = async (userData) => {
    try {
        const {
            employee_id,
            name,
            position,
            email,
            phone,
            department,
            manager_id,
        } = userData;

        // Validation
        if (
            !employee_id ||
            !name ||
            !position
        ) {
            throw new Error("Thiếu thông tin bắt buộc: employee_id, name, position");
        }

        // Validate email format nếu có
        if (email && !emailRegex.test(email)) {
            throw new Error("Email không hợp lệ");
        }

        // Validate phone format nếu có
        if (phone && !phoneRegex.test(phone)) {
            throw new Error("Số điện thoại không hợp lệ");
        }

        // Kiểm tra email đã tồn tại nếu có email
        if (email) {
            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error("Email đã được sử dụng");
            }
        }

        // Kiểm tra phone đã tồn tại nếu có phone
        if (phone) {
            const existingPhone = await db.User.findOne({ where: { phone } });
            if (existingPhone) {
                throw new Error("Số điện thoại đã được sử dụng");
            }
        }

        // Kiểm tra employee_id đã tồn tại
        const existingEmployee = await db.User.findOne({
            where: { employee_id },
        });

        if (existingEmployee) {
            throw new Error("Mã nhân viên đã tồn tại");
        }

        const user = await db.User.create({
            employee_id,
            name,
            position,
            email,
            phone,
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
 * SQL: UPDATE users SET name = ?, position = ?, email = ?, phone = ?, role_id = ?, department = ?, manager_id = ?, status = ?, is_active = ?, updated_at = NOW()
 * WHERE id = ?;
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
        logger.error("Error in deleteUserService:", error.message);
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
        logger.error("Error in getUserByPhoneService:", error.message);
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
        logger.error("Error in getUserByZaloIdService:", error.message);
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

        const roles = userRoles.map(ur => ur.role).filter(r => r);
        return { success: true, data: roles };
    } catch (error) {
        logger.error("Error in getUserRolesService:", error.message);
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
            include: [{
                model: db.Role,
                as: "role",
                include: [{
                    model: db.RolePermissions,
                    as: "rolePermissions",
                    include: [{ model: db.Permission, as: "permission" }]
                }]
            }],
        });

        const permissions = [];
        userRoles.forEach(ur => {
            if (ur.role && ur.role.rolePermissions) {
                ur.role.rolePermissions.forEach(rp => {
                    if (rp.permission) {
                        permissions.push(rp.permission);
                    }
                });
            }
        });

        // Remove duplicates
        const uniquePermissions = permissions.filter((perm, index, self) =>
            index === self.findIndex(p => p.id === perm.id)
        );

        return { success: true, data: uniquePermissions };
    } catch (error) {
        logger.error("Error in getUserPermissionsService:", error.message);
        throw error;
    }
};
