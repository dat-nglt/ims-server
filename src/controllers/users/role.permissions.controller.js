import rolePermissionsService from '../../services/users/rolePermissions.service.js';

const assignPermission = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;

        // Validate input
        if (!roleId || !Array.isArray(permissionIds) || permissionIds.length === 0) {
            return res.status(400).json({ error: 'roleId và permissionIds (mảng) là bắt buộc' });
        }

        const assignments = await rolePermissionsService.assignPermissionsToRole(roleId, permissionIds);
        res.status(201).json({
            message: `Gán ${assignments.length} quyền thành công`,
            data: assignments
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const removePermission = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;

        // Validate input
        if (!roleId || !Array.isArray(permissionIds) || permissionIds.length === 0) {
            return res.status(400).json({ error: 'roleId và permissionIds (mảng) là bắt buộc' });
        }

        const removedCount = await rolePermissionsService.removePermissionsFromRole(roleId, permissionIds);
        res.json({
            message: `Đã gỡ ${removedCount} quyền thành công`
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export default { assignPermission, removePermission };
