"use strict";

/**
 * Migration: Create Positions Table
 *
 * Tạo bảng positions để quản lý chức vụ của nhân viên trong công ty
 * Hỗ trợ cấu trúc phân cấp (parent-child positions)
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("positions", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false,
            comment: "Tên chức vụ",
        },
        code: {
            type: Sequelize.STRING(50),
            allowNull: true,
            comment: "Mã chức vụ (vd: ENG001, MGR001)",
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: "Mô tả chi tiết về chức vụ, trách nhiệm",
        },
        department_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "departments",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            comment: "ID của phòng ban sở hữu chức vụ này",
        },
        level: {
            type: Sequelize.STRING(50),
            defaultValue: "staff",
            comment: "Cấp độ chức vụ: intern, staff, senior, lead, manager, director",
        },
        parent_position_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "positions",
                key: "id",
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
            comment: "ID của chức vụ cha (nếu có cấu trúc phân cấp)",
        },
        salary_range_min: {
            type: Sequelize.DECIMAL(15, 2),
            allowNull: true,
            comment: "Mức lương tối thiểu cho chức vụ này",
        },
        salary_range_max: {
            type: Sequelize.DECIMAL(15, 2),
            allowNull: true,
            comment: "Mức lương tối đa cho chức vụ này",
        },
        expected_headcount: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            comment: "Số lượng nhân viên dự kiến cho chức vụ này",
        },
        status: {
            type: Sequelize.ENUM("active", "inactive", "archived"),
            defaultValue: "active",
            comment: "Trạng thái: active, inactive, archived",
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            comment: "Soft delete flag",
        },
        created_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
            comment: "Người tạo",
        },
        updated_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
            comment: "Người cập nhật",
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            comment: "Thời điểm tạo",
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            comment: "Thời điểm cập nhật",
        },
    });

    // Create indexes
    await queryInterface.addIndex("positions", ["name", "department_id", "is_deleted"], {
        unique: true,
        name: "unique_position_name_department_deleted",
    });
    await queryInterface.addIndex("positions", ["code", "is_deleted"], {
        unique: true,
        name: "unique_position_code_deleted",
    });
    await queryInterface.addIndex("positions", ["department_id"]);
    await queryInterface.addIndex("positions", ["parent_position_id"]);
    await queryInterface.addIndex("positions", ["level"]);
    await queryInterface.addIndex("positions", ["status"]);
    await queryInterface.addIndex("positions", ["is_deleted"]);
    await queryInterface.addIndex("positions", ["created_by"]);
    await queryInterface.addIndex("positions", ["updated_by"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("positions");
}
