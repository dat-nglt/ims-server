import express from 'express';
import rolePermissionsController from '../../controllers/users/role.permissions.controller.js';

const router = express.Router();

// POST route to assign a permission to a role
router.post('/assign', rolePermissionsController.assignPermission);

// DELETE route to remove a permission from a role
router.delete('/remove', rolePermissionsController.removePermission);

export default router;
