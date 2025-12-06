import express from 'express';
import rolePermissionsController from '../../controllers/users/role.permissions.controller.js';

const router = express.Router();

// POST route to assign multiple permissions to a role
// Body: { roleId: number, permissionIds: number[] }
router.post('/assign', rolePermissionsController.assignPermission);

// DELETE route to remove multiple permissions from a role
// Body: { roleId: number, permissionIds: number[] }
router.delete('/remove', rolePermissionsController.removePermission);

// POST route to bulk assign permissions to multiple roles
// Body: { "roleId": [permissionIds], ... }
router.post('/bulk-assign', rolePermissionsController.bulkAssignPermissions);

// POST route to bulk remove permissions from multiple roles
// Body: { "roleId": [permissionIds], ... }
router.post('/bulk-remove', rolePermissionsController.bulkRemovePermissions);

export default router;
