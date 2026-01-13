// This file handles routes for assigning and managing permissions for users via roles.
import express from "express";
import * as userRoleControllers from "../../controllers/users/user-role.controller.js";

const router = express.Router();

// Gán role cho user (to grant permissions via roles)
router.post("/assign-role", userRoleControllers.assignRoleController);

// Gán role cho user dựa trên mã phòng ban
router.post("/assign-by-position", userRoleControllers.assignRoleByPositionController);

// Lấy danh sách roles của user
router.get("/:userId/roles", userRoleControllers.getUserRolesController);

// Thu hồi role từ user
router.delete("/revoke-role", userRoleControllers.revokeRoleController);

// Lấy danh sách quyền của user (từ roles)
router.get("/:userId/permissions", userRoleControllers.getUserPermissionsController);

export default router;
