import db from "../../models/index.js";

const assignPermissionToRole = async (roleId, permissionId) => {
    try {
        const existing = await db.RolePermissions.findOne({
            where: { role_id: roleId, permission_id: permissionId },
        });
        if (existing) {
            throw new Error("Quyền đã được gán");
        }
        const assignment = await db.RolePermissions.create({
            role_id: roleId,
            permission_id: permissionId,
        });
        return assignment;
    } catch (error) {
        throw error;
    }
};

const removePermissionFromRole = async (roleId, permissionId) => {
    try {
        const deleted = await db.RolePermissions.destroy({
            where: { role_id: roleId, permission_id: permissionId },
        });
        return deleted > 0;
    } catch (error) {
        throw error;
    }
};

export default { assignPermissionToRole, removePermissionFromRole };
