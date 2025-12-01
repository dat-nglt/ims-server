"use strict";

export default (sequelize, DataTypes) => {
    const UserRolePermission = sequelize.define(
        "UserRolePermission",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            permission_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "permissions",
                    key: "id",
                },
            },
            is_granted: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            granted_by: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            granted_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "user_roles_permissions",
            timestamps: false,
            // SỬ DỤNG INDEXES THAY CHO UNIQUEKEYS ĐỂ ỔN ĐỊNH
            indexes: [
                {
                    unique: true,
                    fields: ["user_id", "permission_id"],
                    name: "unique_user_permission_index",
                },
                { fields: ["user_id"] },
                { fields: ["permission_id"] },
                { fields: ["is_granted"] }, // Tối ưu query lọc quyền
            ],
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
