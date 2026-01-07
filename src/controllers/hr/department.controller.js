import logger from "../../utils/logger.js";
import {
    getDepartmentWithRolesByIdService,
    getAllDepartmentsService,
    createDepartmentService,
    updateDepartmentService,
    deleteDepartmentService,
} from "../../services/hr/index.js";

/**
 * GET /api/departments
 * Lấy danh sách tất cả phòng ban kèm danh sách chức vụ
 * Query params: includeRoles=true|false, includeInactive=true|false
 * 
 * Response: {
 *   status: "success",
 *   data: [
 *     {
 *       id: 1,
 *       name: "Phòng Kỹ Thuật",
 *       code: "TECH",
 *       status: "active",
 *       positions: [
 *         { id: 1, name: "Giám đốc", code: "DIR", level: "director", status: "active" },
 *         ...
 *       ]
 *     },
 *     ...
 *   ]
 * }
 */
export const getAllDepartmentsController = async (req, res) => {
    try {
        const { includeRoles = false, includeInactive = false, isSelection = false } = req.query;

        const result = await getAllDepartmentsService({
            includeRoles: includeRoles === "true",
            includeInactive: includeInactive === "true",
            isSelection: isSelection === "true",
        });

        if (!result.success) {
            return res.status(400).json({ status: "error", message: result.message });
        }

        res.json({ status: "success", data: result.data, message: result.message });
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

        const result = await getDepartmentWithRolesByIdService(id);

        if (!result.success) {
            return res.status(404).json({ status: "error", message: result.message });
        }

        res.json({ status: "success", data: result.data, message: result.message });
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
        const createdBy = 1;
        // const createdBy = req.user?.id;

        if (!createdBy) {
            return res.status(401).json({ error: "Không có quyền" });
        }

        const result = await createDepartmentService(departmentData, createdBy);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.status(201).json(result);
    } catch (error) {
        logger.error(`[${req.id}] Error in createDepartmentController:` + error.message);
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
            return res.status(401).json({ error: "Không có quyền" });
        }

        const result = await updateDepartmentService(id, updateData, updatedBy);

        if (!result.success) {
            // if not found, return 404
            if (result.message && result.message.includes("Không tìm thấy")) {
                return res.status(404).json({ status: "error", message: result.message });
            }
            return res.status(400).json({ status: "error", message: result.message });
        }

        res.json({ status: "success", data: result.data, message: result.message });
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

        if (!result.success) {
            // not found -> 404
            if (result.message && result.message.includes("Không tìm thấy")) {
                return res.status(404).json({ status: "error", message: result.message });
            }
            return res.status(400).json({ status: "error", message: result.message });
        }

        res.json({ status: "success", message: result.message });
    } catch (error) {
        logger.error(`[${req.id}] Error in deleteDepartmentController:`, error.message);
        res.status(404).json({ error: error.message });
    }
};


