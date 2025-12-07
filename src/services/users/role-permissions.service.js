import db from "../../models/index.js";

const assignPermissionsToRole = async (roleId, permissionIds) => {
    try {
        // Kiểm tra roleId tồn tại
        const role = await db.Role.findByPk(roleId);
        if (!role) {
            throw new Error("Vai trò không tồn tại");
        }

        // Kiểm tra tất cả permissionIds tồn tại
        const permissions = await db.Permission.findAll({
            where: { id: permissionIds },
        });
        if (permissions.length !== permissionIds.length) {
            throw new Error("Một hoặc nhiều quyền hạn không tồn tại");
        }

        // Lọc ra những permission chưa được gán
        const existingAssignments = await db.RolePermissions.findAll({
            where: { role_id: roleId, permission_id: permissionIds },
            attributes: ["permission_id"],
        });
        const existingPermissionIds = existingAssignments.map(
            (a) => a.permission_id
        );
        const newPermissionIds = permissionIds.filter(
            (id) => !existingPermissionIds.includes(id)
        );

        if (newPermissionIds.length === 0) {
            throw new Error("Tất cả quyền đã được gán cho vai trò này");
        }

        // Bulk create assignments
        const assignments = await db.RolePermissions.bulkCreate(
            newPermissionIds.map((permissionId) => ({
                role_id: roleId,
                permission_id: permissionId,
            }))
        );

        return assignments;
    } catch (error) {
        throw error;
    }
};

const removePermissionsFromRole = async (roleId, permissionIds) => {
    try {
        // Kiểm tra roleId tồn tại
        const role = await db.Role.findByPk(roleId);
        if (!role) {
            throw new Error("Vai trò không tồn tại");
        }

        // Kiểm tra tất cả permissionIds tồn tại
        const permissions = await db.Permission.findAll({
            where: { id: permissionIds },
        });
        if (permissions.length !== permissionIds.length) {
            throw new Error("Một hoặc nhiều quyền hạn không tồn tại");
        }

        // Xóa assignments
        const deletedCount = await db.RolePermissions.destroy({
            where: {
                role_id: roleId,
                permission_id: permissionIds,
            },
        });

        return deletedCount;
    } catch (error) {
        throw error;
    }
};

const bulkAssignPermissionsToRoles = async (rolePermissionMap) => {
    // Đồng bộ quyền hạn: xóa tất cả quyền hiện tại của các roles và gán lại quyền mới
    try {
        const results = {};

        for (const [roleIdStr, permissionIds] of Object.entries(
            rolePermissionMap
        )) {
            const roleId = parseInt(roleIdStr);
            if (!Array.isArray(permissionIds)) {
                throw new Error(
                    `permissionIds cho role ${roleId} phải là mảng`
                );
            }

            // Kiểm tra role tồn tại
            const role = await db.Role.findByPk(roleId);
            if (!role) {
                throw new Error(`Vai trò ${roleId} không tồn tại`);
            }

            // Kiểm tra permissions tồn tại (nếu có)
            if (permissionIds.length > 0) {
                const permissions = await db.Permission.findAll({
                    where: { id: permissionIds },
                });
                if (permissions.length !== permissionIds.length) {
                    throw new Error(
                        `Một hoặc nhiều quyền hạn cho role ${roleId} không tồn tại`
                    );
                }
            }

            // Xóa tất cả assignments hiện tại của role
            const deletedCount = await db.RolePermissions.destroy({
                where: { role_id: roleId },
            });

            results[roleId] = { removed: deletedCount, assigned: 0 };

            // Gán lại permissions mới
            if (permissionIds.length > 0) {
                const assignments = await db.RolePermissions.bulkCreate(
                    permissionIds.map((permissionId) => ({
                        role_id: roleId,
                        permission_id: permissionId,
                    }))
                );
                results[roleId].assigned = assignments.length;
            }
        }

        return results;
    } catch (error) {
        throw error;
    }
};

export default {
    assignPermissionsToRole,
    removePermissionsFromRole,
    bulkAssignPermissionsToRoles,
};
