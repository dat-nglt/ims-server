import express from "express";
import rolePermissionsController from "../../controllers/users/role-permissions.controller.js";

const router = express.Router();

// POST route to assign multiple permissions to a role
// Body: { roleId: number, permissionIds: number[] }
router.post("/assign", rolePermissionsController.assignPermission);

// DELETE route to remove multiple permissions from a role
// Body: { roleId: number, permissionIds: number[] }
router.delete("/remove", rolePermissionsController.removePermission);

// POST route to bulk sync permissions for multiple roles (remove all existing and assign new ones)
// Body: { "roleId": [permissionIds], ... }
router.post("/bulk-assign", rolePermissionsController.bulkAssignPermissions);

export default router;
