"use strict";

export default (sequelize, DataTypes) => {
    const Permission = sequelize.define(
        "Permission",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
                unique: true,
                allowNull: false,
                comment: "Tên quyền hạn: edit_work, approve_report...",
            },
            description: {
                type: DataTypes.TEXT,
                comment: "Mô tả chi tiết về quyền hạn",
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "permissions",
            timestamps: false,
            indexes: [{ fields: ["name"] }],
        }
    );

    Permission.associate = (models) => {
        // Một quyền hạn có thể được gán riêng cho nhiều user
        Permission.hasMany(models.UserRolePermission, {
            foreignKey: "permission_id",
            as: "userAssignments",
        });

        // Một quyền hạn có thể thuộc về nhiều Role
        Permission.hasMany(models.RolePermissions, {
            // Chú ý: Tên model RolePermissions
            foreignKey: "permission_id",
            as: "roleAssignments",
        });
    };

    return Permission;
};
