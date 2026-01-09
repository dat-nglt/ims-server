import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Get department with its positions
 * Returns department info along with all positions in that department
 *
 * @param {number} departmentId
 * @returns {Object} Department with positions and roles
 */
export const getDepartmentWithRolesByIdService = async (departmentId) => {
    try {
        const department = await db.Department.findByPk(departmentId, {
            include: [
                {
                    association: "manager",
                    attributes: ["id", "name", "email"],
                },
                {
                    association: "positions",
                    where: { is_deleted: false },
                    required: false,
                    include: [
                        {
                            association: "positionRoles",
                            required: false,
                            include: [
                                {
                                    association: "role",
                                    attributes: ["id", "name"],
                                },
                            ],
                        },
                    ],
                    attributes: ["id", "name", "code", "level", "status"],
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
        logger.error(`Error in getDepartmentWithRolesByIdService: ${error.message}`);
        return {
            success: false,
            message: error.message || "Lấy thông tin phòng ban thất bại",
        };
    }
};

/**
 * Get all departments (for dropdown/select in UI)
 * Always includes manager information and positions
 *
 * @param {Object} options - Filter options: { includeInactive: false, includeRoles: false }
 * @returns {Array} Departments with positions and optional roles
 */
export const getAllDepartmentsService = async (options = { includeInactive: false, includeRoles: false, isSelection: false }) => {
    try {
        const { includeInactive = false, includeRoles = false, isSelection = false } = options || {};
        const where = { is_deleted: false };
        if (!includeInactive) {
            where.status = "active";
        }

        // If caller only needs selection (id + name) for dropdowns, return minimal fields
        if (isSelection) {
            const departments = await db.Department.findAll({
                where,
                attributes: ["id", "name"],
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                message: "Lấy danh sách phòng ban (selection) thành công",
                data: departments,
            };
        }

        const include = [
            {
                association: "manager",
                attributes: ["id", "name", "email"],
                required: false,
            },
            {
                association: "positions",
                where: { is_deleted: false },
                required: false,
                attributes: ["id", "name", "code", "level", "status"],
                include: [
                    {
                        association: "positionRoles",
                        required: false,
                        include: [
                            {
                                association: "role",
                                attributes: ["id", "name"],
                            },
                        ],
                    },
                ],
            },
        ];

        // Optionally include department-level roles if requested
        if (includeRoles) {
            include.push({ association: "departmentRoles", required: false });
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
    const transaction = await db.sequelize.transaction();
    try {
        const payload = departmentData || {};

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

        const department = await db.Department.create(
            {
                ...payload,
                created_by: createdBy,
                updated_by: createdBy,
            },
            { transaction }
        );

        await transaction.commit();

        logger.info(`Created new department: ${department.id} - ${department.name}`);

        // reload with roles (for position management)
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

        const departmentPayload = updateData || {};

        await department.update(
            {
                ...departmentPayload,
                updated_by: updatedBy,
            },
            { transaction }
        );

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


