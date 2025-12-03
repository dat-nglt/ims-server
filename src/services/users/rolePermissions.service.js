import db from "../../models/index.js";

const assignPermissionToRole = async (roleId, permissionId) => {
    try {
        // Kiểm tra roleId tồn tại
        const role = await db.Role.findByPk(roleId);
        if (!role) {
            throw new Error("Vai trò không tồn tại");
        }

        // Kiểm tra permissionId tồn tại
        const permission = await db.Permission.findByPk(permissionId);
        if (!permission) {
            throw new Error("Quyền hạn không tồn tại");
        }

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
        // Kiểm tra roleId tồn tại
        const role = await db.Role.findByPk(roleId);
        if (!role) {
            throw new Error("Vai trò không tồn tại");
        }

        // Kiểm tra permissionId tồn tại
        const permission = await db.Permission.findByPk(permissionId);
        if (!permission) {
            throw new Error("Quyền hạn không tồn tại");
        }

        const deleted = await db.RolePermissions.destroy({
            where: { role_id: roleId, permission_id: permissionId },
        });
        return deleted > 0;
    } catch (error) {
        throw error;
    }
};

export default { assignPermissionToRole, removePermissionFromRole };
