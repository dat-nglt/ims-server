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
                allowNull: false,
                comment: "Tên quyền hạn: edit_work, approve_report...",
            },
            description: {
                type: DataTypes.TEXT,
                comment: "Mô tả chi tiết về quyền hạn",
            },
            category: {
                type: DataTypes.STRING(50),
                comment:
                    "Danh mục quyền hạn: user_management, work_management...",
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
            tableName: "permissions",
            timestamps: false,
            indexes: [
                { fields: ["name", "is_deleted"], unique: true }, // Composite unique index for active records
                { fields: ["category"] },
                { fields: ["is_deleted"] },
            ],
        }
    );

    Permission.associate = (models) => {
        // Một quyền hạn có thể thuộc về nhiều Role
        Permission.hasMany(models.RolePermissions, {
            // Chú ý: Tên model RolePermissions
            foreignKey: "permission_id",
            as: "roleAssignments",
        });

        // Many-to-many với Role
        Permission.belongsToMany(models.Role, {
            through: models.RolePermissions,
            foreignKey: "permission_id",
            otherKey: "role_id",
            as: "roles",
        });

        // Người tạo/sửa permission
        Permission.belongsTo(models.User, {
            foreignKey: "created_by",
            as: "creator",
        });
        Permission.belongsTo(models.User, {
            foreignKey: "updated_by",
            as: "updater",
        });
    };

    return Permission;
};
