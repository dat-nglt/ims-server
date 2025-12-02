// This file handles routes for assigning and managing permissions for users via roles.
import express from "express";
import {
    assignRoleController,
    getUserRolesController,
    revokeRoleController,
    getUserPermissionsController,
} from "../../controllers/users/user.role.controller.js";

const router = express.Router();

// Gán role cho user (to grant permissions via roles)
router.post("/assign-role", assignRoleController);

// Lấy danh sách roles của user
router.get("/:userId/roles", getUserRolesController);

// Thu hồi role từ user
router.delete("/revoke-role", revokeRoleController);

// Lấy danh sách quyền của user (từ roles)
router.get("/:userId/permissions", getUserPermissionsController);

export default router;
