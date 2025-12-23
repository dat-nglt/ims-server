"use strict";

/**
 * Model Department (Phòng ban)
 *
 * Lưu trữ thông tin về các phòng ban trong công ty
 * Hỗ trợ cấu trúc phân cấp (parent-child departments)
 * Liên kết với roles để auto-assign khi nhân viên thay đổi phòng ban
 */
export default (sequelize, DataTypes) => {
    const Department = sequelize.define(
        "Department",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            // Tên phòng ban (Required, Unique trên active records)
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 100],
                },
            },
            // Mã phòng ban (Optional, Unique)
            code: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            // Mô tả chi tiết
            description: {
                type: DataTypes.TEXT,
            },
            // Quản lý trực tiếp
            manager_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            // Số điện thoại phòng
            phone: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            // Email phòng ban
            email: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            // Vị trí/Địa điểm làm việc
            location: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            // Phòng ban cha (nếu có cấu trúc phân cấp)
            parent_department_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "departments",
                    key: "id",
                },
            },
            // Trạng thái
            status: {
                type: DataTypes.ENUM("active", "inactive", "archived"),
                defaultValue: "active",
            },
            // Soft Delete
            is_deleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            // Audit Trail
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
            // Timestamps
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
            tableName: "departments",
            timestamps: false,
            indexes: [
                {
                    fields: ["name", "is_deleted"],
                    unique: true,
                    name: "unique_department_name_deleted",
                },
                {
                    fields: ["code", "is_deleted"],
                    unique: true,
                    name: "unique_department_code_deleted",
                },
                { fields: ["manager_id"] },
                { fields: ["parent_department_id"] },
                { fields: ["status"] },
                { fields: ["is_deleted"] },
            ],
        }
    );

    Department.associate = (models) => {
        // Manager relationship
        Department.belongsTo(models.User, {
            foreignKey: "manager_id",
            as: "manager",
        });

        // Parent department (self-referencing for hierarchy)
        Department.belongsTo(models.Department, {
            foreignKey: "parent_department_id",
            as: "parentDepartment",
        });

        // Child departments
        Department.hasMany(models.Department, {
            foreignKey: "parent_department_id",
            as: "childDepartments",
        });

        // Employees in this department
        Department.hasMany(models.EmployeeProfile, {
            foreignKey: "department_id",
            as: "employees",
        });

        // Many-to-Many với Role qua DepartmentRoles
        Department.belongsToMany(models.Role, {
            through: models.DepartmentRoles,
            foreignKey: "department_id",
            otherKey: "role_id",
            as: "roles",
        });

        // One-to-Many với DepartmentRoles
        Department.hasMany(models.DepartmentRoles, {
            foreignKey: "department_id",
            as: "departmentRoles",
        });

        // Audit trail
        Department.belongsTo(models.User, {
            foreignKey: "created_by",
            as: "creator",
        });
        Department.belongsTo(models.User, {
            foreignKey: "updated_by",
            as: "updater",
        });
    };

    return Department;
};
