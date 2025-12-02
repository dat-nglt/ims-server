import rolePermissionsService from '../../services/users/rolePermissions.service.js';

const assignPermission = async (req, res) => {
    try {
        const { roleId, permissionId } = req.body;
        const assignment = await rolePermissionsService.assignPermissionToRole(roleId, permissionId);
        res.status(201).json({ message: 'Gán quyền thành công', data: assignment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const removePermission = async (req, res) => {
    try {
        const { roleId, permissionId } = req.body;
        const removed = await rolePermissionsService.removePermissionFromRole(roleId, permissionId);
        if (removed) {
            res.json({ message: 'Permission removed successfully' });
        } else {
            res.status(404).json({ error: 'Assignment not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export default { assignPermission, removePermission };
