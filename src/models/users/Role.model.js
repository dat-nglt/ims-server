"use strict";

export default (sequelize, DataTypes) => {
    const Role = sequelize.define(
        "Role",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(50),
                unique: true,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 50],
                },
                comment: "Tên vai trò: admin, manager, sales, technician",
            },
            description: {
                type: DataTypes.TEXT,
                validate: {
                    len: [0, 500],
                },
                comment: "Mô tả chi tiết về vai trò",
            },
            level: {
                type: DataTypes.INTEGER,
                defaultValue: 10,
                comment: "Cấp độ vai trò",
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                comment: "Soft delete flag",
            },
            created_by: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            updated_by: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
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
            tableName: "roles",
            timestamps: false, // Tắt timestamp tự động vì đã khai báo tay
            indexes: [
                { fields: ["name"] },
                { fields: ["level"] },
                { fields: ["is_deleted"] },
            ],
        }
    );

    Role.associate = (models) => {
        // Quan hệ với bảng trung gian UserRoles
        Role.hasMany(models.UserRoles, {
            foreignKey: "role_id",
            as: "userAssignments",
        });

        // Quan hệ với bảng trung gian RolePermissions
        Role.hasMany(models.RolePermissions, {
            foreignKey: "role_id",
            as: "permissions",
        });

        // Người tạo/sửa role
        Role.belongsTo(models.User, {
            foreignKey: "created_by",
            as: "creator",
        });
        Role.belongsTo(models.User, {
            foreignKey: "updated_by",
            as: "updater",
        });
    };

    return Role;
};
