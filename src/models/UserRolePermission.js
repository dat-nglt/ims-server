"use strict";

/**
 * Model UserRolePermission (Quyền hạn người dùng)
 *
 * Lưu trữ quyền hạn chi tiết của người dùng
 */
export default (sequelize, DataTypes) => {
    const UserRolePermission = sequelize.define(
        "UserRolePermission",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            // ID người dùng (FK)
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            // ID quyền hạn (FK)
            permission_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "permissions",
                    key: "id",
                },
                comment: "ID quyền hạn: edit_work, approve_report...",
            },
            // Được cấp quyền hay không
            is_granted: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            // Người cấp quyền (FK)
            granted_by: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            // Thời gian cấp quyền
            granted_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "user_roles_permissions",
            timestamps: false,
            indexes: [
                { fields: ["user_id"] },
                { fields: ["permission_id"] },
            ],
            uniqueKeys: {
                unique_user_permission: {
                    fields: ["user_id", "permission_id"],
                },
            },
        }
    );

    UserRolePermission.associate = (models) => {
        UserRolePermission.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });

        UserRolePermission.belongsTo(models.Permission, {
            foreignKey: "permission_id",
            as: "permission",
        });

        UserRolePermission.belongsTo(models.User, {
            foreignKey: "granted_by",
            as: "grantedByUser",
        });
    };

    return UserRolePermission;
};
