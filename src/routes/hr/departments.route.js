import express from "express";
import * as departmentControllers from "../../controllers/hr/department.controller.js";

const router = express.Router();

/**
 * GET /api/departments
 * Lấy danh sách tất cả phòng ban
 * Query: ?includeRoles=true&includeInactive=false
 */
router.get("/", departmentControllers.getAllDepartmentsController);

/**
 * POST /api/departments
 * Tạo phòng ban mới
 */
router.post("/", departmentControllers.createDepartmentController);

/**
 * GET /api/departments/:id
 * Lấy chi tiết phòng ban với vai trò mặc định
 */
router.get("/:id", departmentControllers.getDepartmentByIdController);

/**
 * PUT /api/departments/:id
 * Cập nhật phòng ban
 */
router.put("/:id", departmentControllers.updateDepartmentController);

/**
 * DELETE /api/departments/:id
 * Xóa (soft delete) phòng ban
 */
router.delete("/:id", departmentControllers.deleteDepartmentController);

// Assignment via roles array in PUT /api/departments/:id (use request body `roles: [roleId, ...]`)

export default router;
