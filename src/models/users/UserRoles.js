"use strict";

export default (sequelize, DataTypes) => {
    const UserRoles = sequelize.define(
        "UserRoles",
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
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "roles",
                    key: "id",
                },
            },
            assigned_by: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            assigned_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
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
            tableName: "user_roles",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [
                {
                    unique: true,
                    fields: ["user_id", "role_id"],
                    name: "unique_user_role_index",
                },
                { fields: ["user_id"] },
                { fields: ["role_id"] },
            ],
        }
    );

    UserRoles.associate = (models) => {
        UserRoles.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });
        UserRoles.belongsTo(models.Role, {
            foreignKey: "role_id",
            as: "role",
        });
        UserRoles.belongsTo(models.User, {
            foreignKey: "assigned_by",
            as: "assigner",
        });
    };

    return UserRoles;
};
