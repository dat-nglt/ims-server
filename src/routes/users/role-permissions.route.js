import express from "express";
import * as rolePermissionsControllers from "../../controllers/users/role-permissions.controller.js";

const router = express.Router();

// POST route to assign multiple permissions to a role
// Body: { roleId: number, permissionIds: number[] }
router.post("/assign", rolePermissionsControllers.assignPermission);

// DELETE route to remove multiple permissions from a role
// Body: { roleId: number, permissionIds: number[] }
router.delete("/remove", rolePermissionsControllers.removePermission);

// POST route to bulk sync permissions for multiple roles (remove all existing and assign new ones)
// Body: { "roleId": [permissionIds], ... }
router.post("/bulk-assign", rolePermissionsControllers.bulkAssignPermissions);

export default router;
