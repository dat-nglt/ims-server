import express from "express";
import {
  getAllDepartmentsController,
  getDepartmentByIdController,
  createDepartmentController,
  updateDepartmentController,
  deleteDepartmentController,
} from "../../controllers/hr/department.controller.js";

const router = express.Router();

// Department Routes

/**
 * GET /api/departments
 * Lấy danh sách tất cả phòng ban
 * Query: ?includeRoles=true&includeInactive=false
 */
router.get("/", getAllDepartmentsController);

/**
 * POST /api/departments
 * Tạo phòng ban mới
 */
router.post("/", createDepartmentController);

/**
 * GET /api/departments/:id
 * Lấy chi tiết phòng ban với vai trò mặc định
 */
router.get("/:id", getDepartmentByIdController);

/**
 * PUT /api/departments/:id
 * Cập nhật phòng ban
 */
router.put("/:id", updateDepartmentController);

/**
 * DELETE /api/departments/:id
 * Xóa (soft delete) phòng ban
 */
router.delete("/:id", deleteDepartmentController);

// Assignment via roles array in PUT /api/departments/:id (use request body `roles: [roleId, ...]`)

export default router;
