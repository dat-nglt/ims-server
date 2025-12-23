import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Service: Auto-assign roles based on department
 *
 * Khi cập nhật phòng ban của nhân viên:
 * 1. Fetch department với default roles
 * 2. Get current user roles
 * 3. Calculate roles to add/remove
 * 4. Update employee profile
 * 5. Remove old roles
 * 6. Add new roles
 *
 * @param {number} employeeId - Employee profile user_id
 * @param {number} departmentId - New department ID
 * @param {number} updatedBy - User ID of person making the update
 * @returns {Object} { success, employee, rolesAssigned, rolesRemoved }
 */
export const updateEmployeeWithDepartmentService = async (employeeId, departmentId, updatedBy) => {
    const transaction = await db.sequelize.transaction();

    try {
        // 1. Get Department with default roles
        const department = await db.Department.findByPk(departmentId, {
            include: [
                {
                    association: "departmentRoles",
                    where: { is_default: true },
                    required: false,
                    include: [{ association: "role" }],
                },
            ],
            transaction,
        });

        if (!department) {
            try {
                await transaction.rollback();
            } catch (rbErr) {
                logger.error(`Rollback failed: ${rbErr.message}`);
            }
            logger.error(`Không tìm thấy phòng ban có ID ${departmentId}`);
            return {
                success: false,
                message: `Không tìm thấy phòng ban có ID ${departmentId}`,
            };
        }

        // 2. Get EmployeeProfile
        const employee = await db.EmployeeProfile.findByPk(employeeId, {
            include: [{ association: "user" }],
            transaction,
        });

        if (!employee) {
            try {
                await transaction.rollback();
            } catch (rbErr) {
                logger.error(`Rollback failed: ${rbErr.message}`);
            }
            logger.error(`Không tìm thấy nhân viên có ID ${employeeId}`);
            return {
                success: false,
                message: `Không tìm thấy nhân viên có ID ${employeeId}`,
            };
        }

        const userId = employee.user_id;

        // 3. Get Current User Roles
        const currentUserRoles = await db.UserRoles.findAll({
            where: { user_id: userId },
            attributes: ["role_id"],
            transaction,
        });

        const currentRoleIds = currentUserRoles.map((ur) => ur.role_id);

        // 4. Calculate New Roles to Assign
        // Prioritize primary roles first
        const departmentRoleIds = department.departmentRoles.map((dr) => dr.role_id);
        const rolesAssigned = departmentRoleIds.filter((id) => !currentRoleIds.includes(id));
        const rolesRemoved = currentRoleIds.filter((id) => !departmentRoleIds.includes(id));

        // 5. Update EmployeeProfile with new department
        await employee.update({ department_id: departmentId }, { transaction });

        // 6. Remove Old Roles (only if there are roles to remove)
        if (rolesRemoved.length > 0) {
            await db.UserRoles.destroy({
                where: {
                    user_id: userId,
                    role_id: rolesRemoved,
                },
                transaction,
            });

            logger.info(`Removed roles [${rolesRemoved.join(", ")}] from user ${userId}`);
        }

        // 7. Add New Roles (only if there are new roles to add)
        if (rolesAssigned.length > 0) {
            const newUserRoles = rolesAssigned.map((roleId) => ({
                user_id: userId,
                role_id: roleId,
                assigned_by: updatedBy,
                assigned_at: new Date(),
            }));

            await db.UserRoles.bulkCreate(newUserRoles, { transaction });

            logger.info(`Assigned roles [${rolesAssigned.join(", ")}] to user ${userId}`);
        }

        // 8. Commit transaction
        await transaction.commit();

        logger.info(`Successfully updated employee ${employeeId} to department ${departmentId}`);

        return {
            success: true,
            message: "Cập nhật phòng ban cho nhân viên thành công",
            employee: {
                id: employee.id,
                user_id: userId,
                department_id: departmentId,
            },
            rolesAssigned,
            rolesRemoved,
            department: {
                id: department.id,
                name: department.name,
            },
        };
    } catch (error) {
        try {
            await transaction.rollback();
        } catch (rbErr) {
            logger.error(`Rollback failed: ${rbErr.message}`);
        }
        logger.error(`Error in updateEmployeeWithDepartmentService: ${error.message}`);
        return {
            success: false,
            message: error.message || "Cập nhật phòng ban cho nhân viên thất bại",
        };
    }
};

/**
 * Get department with its default roles
 * For UI preview before employee assignment
 *
 * @param {number} departmentId
 * @returns {Object} Department with roles
 */
export const getDepartmentWithRolesService = async (departmentId) => {
    try {
        const department = await db.Department.findByPk(departmentId, {
            include: [
                {
                    association: "departmentRoles",
                    where: { is_default: true },
                    required: false,
                    include: [
                        {
                            association: "role",
                            include: [{ association: "permissions" }],
                        },
                    ],
                },
                {
                    association: "manager",
                    attributes: ["id", "name", "email"],
                },
            ],
        });

        if (!department) {
            logger.error(`Không tìm thấy phòng ban có ID ${departmentId}`);
            return {
                success: false,
                message: `Không tìm thấy phòng ban có ID ${departmentId}`,
            };
        }

        return {
            success: true,
            message: "Lấy thông tin phòng ban thành công",
            data: department,
        };
    } catch (error) {
        logger.error(`Error in getDepartmentWithRolesService: ${error.message}`);
        return {
            success: false,
            message: error.message || "Lấy thông tin phòng ban thất bại",
        };
    }
};

/**
 * Get all departments (for dropdown/select in UI)
 *
 * @param {Object} options - Filter options
 * @returns {Array} Departments
 */
export const getAllDepartmentsService = async (options = { includeRoles: false, includeInactive: false }) => {
    try {
        const where = { is_deleted: false };
        if (!options.includeInactive) {
            where.status = "active";
        }

        const include = [
            {
                association: "manager",
                attributes: ["id", "name", "email"],
                required: false,
            },
        ];

        if (options.includeRoles) {
            include.push({
                association: "departmentRoles",
                where: { is_default: true },
                required: false,
                include: [{ association: "role" }],
            });
        }

        const departments = await db.Department.findAll({
            where,
            include,
            order: [["name", "ASC"]],
        });

        return {
            success: true,
            message: "Lấy danh sách phòng ban thành công",
            data: departments,
        };
    } catch (error) {
        logger.error(`Error in getAllDepartmentsService: ${error.message}`);
        return {
            success: false,
            message: error.message || "Lấy danh sách phòng ban thất bại",
        };
    }
};

/**
 * Create new department
 *
 * @param {Object} departmentData
 * @param {number} createdBy - User ID
 * @returns {Object} Created department
 */
export const createDepartmentService = async (departmentData, createdBy) => {
    console.log("createDepartmentService called with:", departmentData, createdBy);
    const transaction = await db.sequelize.transaction();
    try {
        const { roles, ...payload } = departmentData || {};

        // Basic validation: name is required
        if (!payload.name || String(payload.name).trim().length === 0) {
            throw new Error("Tên phòng ban là bắt buộc");
        }

        // Check uniqueness: name (only active records)
        const existingName = await db.Department.findOne({
            where: { name: payload.name, is_deleted: false },
            transaction,
        });
        if (existingName) {
            throw new Error(`Tên phòng ban đã tồn tại`);
        }

        // Check uniqueness: code (if provided and not empty)
        if (payload.code && String(payload.code).trim().length > 0) {
            const existingCode = await db.Department.findOne({
                where: { code: payload.code, is_deleted: false },
                transaction,
            });
            if (existingCode) {
                throw new Error(`Mã phòng ban đã tồn tại`);
            }
        }

        console.log("Payload for department creation:", payload);

        const department = await db.Department.create(
            {
                ...payload,
                created_by: createdBy,
                updated_by: createdBy,
            },
            { transaction }
        );

        // If roles are provided, assign them (validate existence first)
        if (Array.isArray(roles) && roles.length > 0) {
            const roleIds = Array.from(new Set(roles.map((r) => Number(r)).filter(Boolean)));
            const existingRoles = await db.Role.findAll({ where: { id: roleIds }, attributes: ["id"], transaction });
            const existingRoleSet = new Set(existingRoles.map((r) => r.id));
            const assignments = roleIds
                .filter((id) => existingRoleSet.has(id))
                .map((roleId) => ({
                    department_id: department.id,
                    role_id: roleId,
                    is_primary: true,
                    is_default: true,
                    priority: 0,
                }));

            if (assignments.length > 0) {
                await db.DepartmentRoles.bulkCreate(assignments, { transaction });
            }
        }

        await transaction.commit();

        logger.info(`Created new department: ${department.id} - ${department.name}`);

        // reload with roles
        const created = await db.Department.findByPk(department.id, {
            include: [
                { association: "manager", attributes: ["id", "name", "email"], required: false },
                { association: "departmentRoles", required: false },
            ],
        });

        return {
            success: true,
            data: created,
            message: "Phòng ban được tạo thành công",
        };
    } catch (error) {
        try {
            await transaction.rollback();
        } catch (rbErr) {
            logger.error(`Rollback failed: ${rbErr.message}`);
        }
        logger.error(`Error in createDepartmentService: ${error.message}`);
        return {
            success: false,
            data: null,
            message: error.message || "Tạo phòng ban thất bại",
        };
    }
};

/**
 * Update department
 *
 * @param {number} departmentId
 * @param {Object} updateData
 * @param {number} updatedBy - User ID
 * @returns {Object} Updated department
 */
export const updateDepartmentService = async (departmentId, updateData, updatedBy) => {
    const transaction = await db.sequelize.transaction();
    try {
        const department = await db.Department.findByPk(departmentId, { transaction });

        if (!department) {
            try {
                await transaction.rollback();
            } catch (rbErr) {
                logger.error(`Rollback failed: ${rbErr.message}`);
            }
            logger.error(`Không tìm thấy phòng ban có ID ${departmentId}`);
            return {
                success: false,
                message: `Không tìm thấy phòng ban có ID ${departmentId}`,
            };
        }

        // Separate roles payload if provided
        const { roles, ...departmentPayload } = updateData || {};

        await department.update(
            {
                ...departmentPayload,
                updated_by: updatedBy,
            },
            { transaction }
        );

        // If roles array is provided, sync department_roles table
        if (Array.isArray(roles)) {
            // Normalize ids
            const newRoleIds = Array.from(new Set(roles.map((r) => Number(r)).filter(Boolean)));

            // Fetch existing assignments
            const existingAssignments = await db.DepartmentRoles.findAll({
                where: { department_id: departmentId },
                attributes: ["role_id"],
                transaction,
            });

            const existingRoleIds = existingAssignments.map((a) => a.role_id);

            const toAdd = newRoleIds.filter((id) => !existingRoleIds.includes(id));
            const toRemove = existingRoleIds.filter((id) => !newRoleIds.includes(id));

            // Validate roles to add exist
            if (toAdd.length > 0) {
                const existingRoles = await db.Role.findAll({ where: { id: toAdd }, attributes: ["id"], transaction });
                const existingRoleSet = new Set(existingRoles.map((r) => r.id));
                const validToAdd = toAdd.filter((id) => existingRoleSet.has(id));

                const assignments = validToAdd.map((roleId) => ({
                    department_id: departmentId,
                    role_id: roleId,
                    is_primary: true,
                    is_default: true,
                    priority: 0,
                }));

                if (assignments.length > 0) {
                    await db.DepartmentRoles.bulkCreate(assignments, { transaction });
                }
            }

            // Remove assignments
            if (toRemove.length > 0) {
                await db.DepartmentRoles.destroy({
                    where: { department_id: departmentId, role_id: toRemove },
                    transaction,
                });
            }
        }

        await transaction.commit();

        // Reload and return updated department with default relations
        const updated = await db.Department.findByPk(departmentId, {
            include: [
                { association: "manager", attributes: ["id", "name", "email"], required: false },
                { association: "departmentRoles", required: false },
            ],
        });

        logger.info(`Updated department: ${departmentId}`);

        return {
            success: true,
            message: "Cập nhật phòng ban thành công",
            data: updated,
        };
    } catch (error) {
        try {
            await transaction.rollback();
        } catch (rbErr) {
            logger.error(`Rollback failed: ${rbErr.message}`);
        }
        logger.error(`Error in updateDepartmentService: ${error.message}`);
        return {
            success: false,
            message: error.message || "Cập nhật phòng ban thất bại",
        };
    }
};

/**
 * Delete (soft delete) department
 *
 * @param {number} departmentId
 * @returns {Object} Result
 */
export const deleteDepartmentService = async (departmentId) => {
    try {
        const department = await db.Department.findByPk(departmentId);

        if (!department) {
            logger.error(`Không tìm thấy phòng ban có ID ${departmentId}`);
            return {
                success: false,
                message: `Không tìm thấy phòng ban có ID ${departmentId}`,
            };
        }

        await department.update({ is_deleted: true });

        logger.info(`Soft deleted department: ${departmentId}`);

        return {
            success: true,
            message: "Xóa phòng ban thành công",
        };
    } catch (error) {
        logger.error(`Error in deleteDepartmentService: ${error.message}`);
        return {
            success: false,
            message: error.message || "Xóa phòng ban thất bại",
        };
    }
};

// Note: assignRoleToDepartmentService removed — role assignment is now handled inside updateDepartmentService when `roles` array is passed in update payload.;

/**
 * Remove role from department
 *
 * @param {number} departmentId
 * @param {number} roleId
 * @returns {Object} Result
 */
export const removeRoleFromDepartmentService = async (departmentId, roleId) => {
    try {
        const result = await db.DepartmentRoles.destroy({
            where: {
                department_id: departmentId,
                role_id: roleId,
            },
        });

        if (result === 0) {
            logger.error(`Vai trò ${roleId} không tồn tại trong phòng ban ${departmentId}`);
            return {
                success: false,
                message: `Vai trò ${roleId} không tồn tại trong phòng ban ${departmentId}`,
            };
        }

        logger.info(`Đã xóa vai trò ${roleId} khỏi phòng ban ${departmentId}`);

        return {
            success: true,
            message: "Xóa vai trò khỏi phòng ban thành công",
        };
    } catch (error) {
        logger.error(`Error in removeRoleFromDepartmentService: ${error.message}`);
        return {
            success: false,
            message: error.message || "Xóa vai trò khỏi phòng ban thất bại",
        };
    }
};
