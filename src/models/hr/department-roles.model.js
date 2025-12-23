"use strict";

/**
 * Model DepartmentRoles (Roles của Phòng ban)
 *
 * Junction table để quản lý many-to-many relationship giữa Department và Role
 * Cho phép một phòng ban có nhiều role, một role có thể thuộc nhiều phòng ban
 *
 * Fields:
 * - is_primary: Role chính (mặc định gán cho nhân viên mới)
 * - is_default: Có tự động assign khi cập nhật phòng ban không
 * - priority: Thứ tự gán (0 = cao nhất, không bắt buộc)
 */
export default (sequelize, DataTypes) => {
    const DepartmentRoles = sequelize.define(
        "DepartmentRoles",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            department_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "departments",
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
            // Nhóm role chính mặc định gán
            is_primary: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            // Có tự động assign không
            is_default: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            // Thứ tự ưu tiên
            priority: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
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
            tableName: "department_roles",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [
                {
                    unique: true,
                    fields: ["department_id", "role_id"],
                    name: "unique_department_role",
                },
                { fields: ["department_id"] },
                { fields: ["role_id"] },
                { fields: ["is_default"] },
                { fields: ["priority"] },
            ],
        }
    );

    DepartmentRoles.associate = (models) => {
        DepartmentRoles.belongsTo(models.Department, {
            foreignKey: "department_id",
            as: "department",
        });

        DepartmentRoles.belongsTo(models.Role, {
            foreignKey: "role_id",
            as: "role",
        });
    };

    return DepartmentRoles;
};
