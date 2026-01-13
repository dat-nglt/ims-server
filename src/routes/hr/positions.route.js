import express from "express";
import * as positionControllers from "../../controllers/hr/position.controller.js";

const router = express.Router();

/**
 * GET /api/positions
 * Lấy danh sách tất cả chức vụ
 * Query: ?departmentId=1&level=staff&status=active&includeRoles=true&includeInactive=false
 */
router.get("/", positionControllers.getAllPositionsController);

/**
 * POST /api/positions
 * Tạo chức vụ mới
 * Body: { name, poscode, posdescription, posdepartment_id, poslevel, posparent_position_id, possalary_range_min, possalary_range_max, posexpected_headcount }
 */
router.post("/", positionControllers.createPositionController);

/**
 * GET /api/positions/:id
 * Lấy chi tiết chức vụ
 */
router.get("/:id", positionControllers.getPositionByIdController);

/**
 * PUT /api/positions/:id
 * Cập nhật chức vụ
 * Body: { name, poscode, posdescription, posdepartment_id, poslevel, posparent_position_id, possalary_range_min, possalary_range_max, posexpected_headcount, posstatus }
 */
router.put("/:id", positionControllers.updatePositionController);

/**
 * DELETE /api/positions/:id
 * Xóa (soft delete) chức vụ
 */
router.delete("/:id", positionControllers.deletePositionController);

/**
 * GET /api/positions/department/:departmentId
 * Lấy danh sách chức vụ theo phòng ban
 * Query: ?level=staff&status=active&includeInactive=false
 */
router.get("/department/:departmentId", positionControllers.getPositionsByDepartmentController);

/**
 * POST /api/positions/:id/roles/:roleId
 * Gán vai trò cho chức vụ
 * Body: { is_default: true|false }
 */
router.post("/:id/roles/:roleId", positionControllers.assignRoleToPositionController);

/**
 * DELETE /api/positions/:id/roles/:roleId
 * Gỡ vai trò khỏi chức vụ
 */
router.delete("/:id/roles/:roleId", positionControllers.removeRoleFromPositionController);

export default router;
