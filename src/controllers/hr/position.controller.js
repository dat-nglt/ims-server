import logger from "../../utils/logger.js";
import {
  getAllPositionsService,
  getPositionByIdService,
  createPositionService,
  updatePositionService,
  deletePositionService,
  getPositionsByDepartmentService,
  assignRoleToPositionService,
  removeRoleFromPositionService,
} from "../../services/hr/index.js";

/**
 * GET /api/positions
 * Lấy danh sách tất cả chức vụ
 * Query params: departmentId, level, status, includeRoles=true|false, includeInactive=true|false
 */
export const getAllPositionsController = async (req, res) => {
  try {
    const {
      departmentId,
      level,
      status,
      includeRoles = false,
      includeInactive = false,
    } = req.query;

    const result = await getAllPositionsService({
      departmentId: departmentId ? parseInt(departmentId) : undefined,
      level,
      status,
      includeRoles: includeRoles === "true",
      includeInactive: includeInactive === "true",
    });

    if (!result.success) {
      return res.status(400).json({ status: "error", message: result.message });
    }

    res.json({
      status: "success",
      data: result.data,
      message: result.message,
      total: result.total,
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllPositionsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/positions/:id
 * Lấy chi tiết chức vụ
 */
export const getPositionByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getPositionByIdService(id);

    if (!result.success) {
      return res.status(404).json({ status: "error", message: result.message });
    }

    res.json({ status: "success", data: result.data, message: result.message });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getPositionByIdController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * POST /api/positions
 * Tạo chức vụ mới
 * Body: { name, code, description, department_id, level, parent_position_id, salary_range_min, salary_range_max, expected_headcount }
 */
export const createPositionController = async (req, res) => {
  try {
    const positionData = req.body;
    const createdBy = 1;
    // const createdBy = req.user?.id;

    if (!createdBy) {
      return res.status(401).json({ error: "Không có quyền" });
    }

    if (!positionData.name || !positionData.department_id) {
      return res.status(400).json({
        error: "Tên chức vụ và phòng ban là bắt buộc",
      });
    }

    const result = await createPositionService(positionData, createdBy);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createPositionController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * PUT /api/positions/:id
 * Cập nhật chức vụ
 * Body: { name, code, description, department_id, level, parent_position_id, salary_range_min, salary_range_max, expected_headcount, status }
 */
export const updatePositionController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedBy = 1;
    // const updatedBy = req.user?.id;

    if (!updatedBy) {
      return res.status(401).json({ error: "Không có quyền" });
    }

    const result = await updatePositionService(id, updateData, updatedBy);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error(
      `[${req.id}] Error in updatePositionController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * DELETE /api/positions/:id
 * Xóa (soft delete) chức vụ
 */
export const deletePositionController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBy = 1;
    // const deletedBy = req.user?.id;

    if (!deletedBy) {
      return res.status(401).json({ error: "Không có quyền" });
    }

    const result = await deletePositionService(id, deletedBy);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error(
      `[${req.id}] Error in deletePositionController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * GET /api/positions/department/:departmentId
 * Lấy danh sách chức vụ theo phòng ban
 */
export const getPositionsByDepartmentController = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { level, status, includeRoles = false, includeInactive = false } =
      req.query;

    const result = await getPositionsByDepartmentService(
      departmentId,
      {
        level,
        status,
        includeRoles: includeRoles === "true",
        includeInactive: includeInactive === "true",
      }
    );

    if (!result.success) {
      return res.status(400).json({ status: "error", message: result.message });
    }

    res.json({
      status: "success",
      data: result.data,
      message: result.message,
      total: result.total,
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getPositionsByDepartmentController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/positions/:id/roles/:roleId
 * Gán vai trò cho chức vụ
 * Body: { is_default: true|false }
 */
export const assignRoleToPositionController = async (req, res) => {
  try {
    const { id, roleId } = req.params;
    const { is_default = false } = req.body;
    const assignedBy = 1;
    // const assignedBy = req.user?.id;

    if (!assignedBy) {
      return res.status(401).json({ error: "Không có quyền" });
    }

    const result = await assignRoleToPositionService(
      id,
      roleId,
      is_default,
      assignedBy
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    logger.error(
      `[${req.id}] Error in assignRoleToPositionController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * DELETE /api/positions/:id/roles/:roleId
 * Gỡ vai trò khỏi chức vụ
 */
export const removeRoleFromPositionController = async (req, res) => {
  try {
    const { id, roleId } = req.params;
    const removedBy = 1;
    // const removedBy = req.user?.id;

    if (!removedBy) {
      return res.status(401).json({ error: "Không có quyền" });
    }

    const result = await removeRoleFromPositionService(id, roleId, removedBy);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error(
      `[${req.id}] Error in removeRoleFromPositionController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};
