import express from "express";
import {
  getAllPositionsController,
  getPositionByIdController,
  createPositionController,
  updatePositionController,
  deletePositionController,
  getPositionsByDepartmentController,
  assignRoleToPositionController,
  removeRoleFromPositionController,
} from "../../controllers/hr/position.controller.js";

const router = express.Router();

/**
 * GET /api/positions
 * Lấy danh sách tất cả chức vụ
 * Query: ?departmentId=1&level=staff&status=active&includeRoles=true&includeInactive=false
 */
router.get("/", getAllPositionsController);

/**
 * POST /api/positions
 * Tạo chức vụ mới
 * Body: { name, code, description, department_id, level, parent_position_id, salary_range_min, salary_range_max, expected_headcount }
 */
router.post("/", createPositionController);

/**
 * GET /api/positions/:id
 * Lấy chi tiết chức vụ
 */
router.get("/:id", getPositionByIdController);

/**
 * PUT /api/positions/:id
 * Cập nhật chức vụ
 * Body: { name, code, description, department_id, level, parent_position_id, salary_range_min, salary_range_max, expected_headcount, status }
 */
router.put("/:id", updatePositionController);

/**
 * DELETE /api/positions/:id
 * Xóa (soft delete) chức vụ
 */
router.delete("/:id", deletePositionController);

/**
 * GET /api/positions/department/:departmentId
 * Lấy danh sách chức vụ theo phòng ban
 * Query: ?level=staff&status=active&includeInactive=false
 */
router.get("/department/:departmentId", getPositionsByDepartmentController);

/**
 * POST /api/positions/:id/roles/:roleId
 * Gán vai trò cho chức vụ
 * Body: { is_default: true|false }
 */
router.post("/:id/roles/:roleId", assignRoleToPositionController);

/**
 * DELETE /api/positions/:id/roles/:roleId
 * Gỡ vai trò khỏi chức vụ
 */
router.delete("/:id/roles/:roleId", removeRoleFromPositionController);

export default router;
