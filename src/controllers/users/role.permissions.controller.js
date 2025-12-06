import rolePermissionsService from "../../services/users/rolePermissions.service.js";

const assignPermission = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;

        // Validate input
        if (
            !roleId ||
            !Array.isArray(permissionIds) ||
            permissionIds.length === 0
        ) {
            return res
                .status(400)
                .json({ error: "roleId và permissionIds (mảng) là bắt buộc" });
        }

        const assignments =
            await rolePermissionsService.assignPermissionsToRole(
                roleId,
                permissionIds
            );
        res.status(201).json({
            message: `Gán ${assignments.length} quyền thành công`,
            data: assignments,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const removePermission = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;

        // Validate input
        if (
            !roleId ||
            !Array.isArray(permissionIds) ||
            permissionIds.length === 0
        ) {
            return res
                .status(400)
                .json({ error: "roleId và permissionIds (mảng) là bắt buộc" });
        }

        const removedCount =
            await rolePermissionsService.removePermissionsFromRole(
                roleId,
                permissionIds
            );
        res.json({
            message: `Đã gỡ ${removedCount} quyền thành công`,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const bulkAssignPermissions = async (req, res) => {
    try {
        const rolePermissionMap = req.body;

        // Validate input
        if (!rolePermissionMap || typeof rolePermissionMap !== "object") {
            return res.status(400).json({
                error: "Dữ liệu phải là object với key là roleId và value là mảng permissionIds",
            });
        }

        const assignments =
            await rolePermissionsService.bulkAssignPermissionsToRoles(
                rolePermissionMap
            );
        res.status(201).json({
            message: `Gán quyền thành công cho ${
                Object.keys(rolePermissionMap).length
            } vai trò`,
            data: assignments,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const bulkRemovePermissions = async (req, res) => {
    try {
        const rolePermissionMap = req.body;

        // Validate input
        if (!rolePermissionMap || typeof rolePermissionMap !== "object") {
            return res.status(400).json({
                error: "Dữ liệu phải là object với key là roleId và value là mảng permissionIds",
            });
        }

        const removedCount =
            await rolePermissionsService.bulkRemovePermissionsFromRoles(
                rolePermissionMap
            );
        res.json({
            message: `Đã gỡ quyền thành công cho ${
                Object.keys(rolePermissionMap).length
            } vai trò`,
            data: removedCount,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export default { assignPermission, removePermission, bulkAssignPermissions, bulkRemovePermissions };
