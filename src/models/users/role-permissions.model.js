"use strict";

export default (sequelize, DataTypes) => {
    const RolePermissions = sequelize.define(
        "RolePermissions",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "roles",
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
            tableName: "role_permissions",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [
                {
                    unique: true,
                    fields: ["role_id", "permission_id"],
                    name: "unique_role_permission_index",
                },
                { fields: ["role_id"] },
                { fields: ["permission_id"] },
            ],
        }
    );

    RolePermissions.associate = (models) => {
        RolePermissions.belongsTo(models.Role, {
            foreignKey: "role_id",
            as: "role",
        });
        RolePermissions.belongsTo(models.Permission, {
            foreignKey: "permission_id",
            as: "permission",
        });
    };

    return RolePermissions;
};
