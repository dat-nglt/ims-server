import logger from "../../utils/logger.js";
import {
    updateEmployeeWithDepartmentService,
    getDepartmentWithRolesService,
    getAllDepartmentsService,
    createDepartmentService,
    updateDepartmentService,
    deleteDepartmentService,
    removeRoleFromDepartmentService,
} from "../../services/hr/index.js";

/**
 * GET /api/departments
 * Lấy danh sách tất cả phòng ban
 * Query params: includeRoles=true|false, includeInactive=true|false
 */
export const getAllDepartmentsController = async (req, res) => {
    try {
        const { includeRoles = false, includeInactive = false } = req.query;

        const result = await getAllDepartmentsService({
            includeRoles: includeRoles === "true",
            includeInactive: includeInactive === "true",
        });

        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách phòng ban thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getAllDepartmentsController:`, error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * GET /api/departments/:id
 * Lấy chi tiết phòng ban với các vai trò mặc định
 */
export const getDepartmentByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await getDepartmentWithRolesService(id);

        res.json({
            status: "success",
            data: result.data,
            message: "Lấy chi tiết phòng ban thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getDepartmentByIdController:`, error.message);
        res.status(404).json({ error: error.message });
    }
};

/**
 * POST /api/departments
 * Tạo phòng ban mới
 * Body: { name, code, description, manager_id, phone, email, location, parent_department_id }
 */
export const createDepartmentController = async (req, res) => {
    try {
        const departmentData = req.body;
        const createdBy = req.user?.id;

        if (!createdBy) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const result = await createDepartmentService(departmentData, createdBy);

        res.status(201).json({
            status: "success",
            data: result.data,
            message: "Tạo phòng ban thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in createDepartmentController:`, error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * PUT /api/departments/:id
 * Cập nhật phòng ban
 * Body: { name, code, description, manager_id, phone, email, location, parent_department_id, status }
 */
export const updateDepartmentController = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // const updatedBy = req.user?.id;
        const updatedBy = 1;

        if (!updatedBy) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const result = await updateDepartmentService(id, updateData, updatedBy);

        res.json({
            status: "success",
            data: result.data,
            message: "Cập nhật phòng ban thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in updateDepartmentController:`, error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * DELETE /api/departments/:id
 * Xóa (soft delete) phòng ban
 */
export const deleteDepartmentController = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deleteDepartmentService(id);

        res.json({
            status: "success",
            message: result.message,
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in deleteDepartmentController:`, error.message);
        res.status(404).json({ error: error.message });
    }
};

// assignRoleToDepartmentController removed — assignments are handled by updateDepartmentController when `roles` is present in the request body.

/**
 * DELETE /api/departments/:id/roles/:roleId
 * Gỡ vai trò khỏi phòng ban
 */
export const removeRoleFromDepartmentController = async (req, res) => {
    try {
        const { id: departmentId, roleId } = req.params;

        const result = await removeRoleFromDepartmentService(departmentId, roleId);

        res.json({
            status: "success",
            message: result.message,
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in removeRoleFromDepartmentController:`, error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * PUT /api/employees/:employeeId/department
 * Cập nhật phòng ban cho nhân viên + auto-assign roles
 * Body: { department_id }
 *
 * Logic:
 * 1. Get department với default roles
 * 2. Lấy current roles của user
 * 3. Remove old roles, add new roles
 * 4. Update employee profile
 * 5. Trả về kết quả (roles assigned/removed)
 */
export const updateEmployeeDepartmentController = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { department_id } = req.body;
        const updatedBy = req.user?.id;

        // Validation
        if (!department_id) {
            return res.status(400).json({ error: "department_id is required" });
        }

        if (!updatedBy) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Call service with auto-assign logic
        const result = await updateEmployeeWithDepartmentService(employeeId, department_id, updatedBy);

        res.json({
            status: "success",
            data: result,
            message: "Cập nhật phòng ban và vai trò cho nhân viên thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in updateEmployeeDepartmentController:`, error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * PUT /api/employees/:employeeId
 * Cập nhật thông tin nhân viên (có thể bao gồm department)
 * Body: { name, position, department_id, email, phone, ... }
 *
 * Logic:
 * - Nếu có department_id: gọi updateEmployeeWithDepartmentService (auto-assign roles)
 * - Nếu không: cập nhật thông tin khác như bình thường
 */
export const updateEmployeeController = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { department_id, ...otherData } = req.body;
        const updatedBy = req.user?.id;

        if (!updatedBy) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        let result;

        // Nếu có thay đổi department, gọi service auto-assign
        if (department_id) {
            result = await updateEmployeeWithDepartmentService(employeeId, department_id, updatedBy);

            return res.json({
                status: "success",
                data: result,
                message: "Cập nhật phòng ban và vai trò thành công",
            });
        }

        // Nếu không thay đổi department, cập nhật các field khác
        if (Object.keys(otherData).length > 0) {
            const db = await import("../../models/index.js").then((m) => m.default);
            const employee = await db.EmployeeProfile.findByPk(employeeId);

            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
            }

            await employee.update(otherData);

            return res.json({
                status: "success",
                data: employee,
                message: "Cập nhật thông tin nhân viên thành công",
            });
        }

        // Nếu không có dữ liệu cập nhật
        res.status(400).json({ error: "No data provided for update" });
    } catch (error) {
        logger.error(`[${req.id}] Error in updateEmployeeController:`, error.message);
        res.status(400).json({ error: error.message });
    }
};
