import express from "express";
import {
  getAllDepartmentsController,
  getDepartmentByIdController,
  createDepartmentController,
  updateDepartmentController,
  deleteDepartmentController,
  removeRoleFromDepartmentController,
  updateEmployeeDepartmentController,
  updateEmployeeController,
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

/**
 * DELETE /api/departments/:id/roles/:roleId
 * Gỡ vai trò khỏi phòng ban
 */
router.delete("/:id/roles/:roleId", removeRoleFromDepartmentController);

// Employee Department Routes (Auto-Assign Roles)

/**
 * PUT /api/employees/:employeeId/department
 * Cập nhật phòng ban cho nhân viên + auto-assign roles
 * Body: { department_id }
 */
router.put("/employees/:employeeId/department", updateEmployeeDepartmentController);

/**
 * PUT /api/employees/:employeeId
 * Cập nhật nhân viên (có thể bao gồm department + auto-assign roles)
 * Body: { name, position, department_id, email, phone, ... }
 */
router.put("/employees/:employeeId", updateEmployeeController);

export default router;
