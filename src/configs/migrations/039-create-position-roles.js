"use strict";

/**
 * Migration: Create Position Roles Junction Table
 *
 * Tạo bảng position_roles để quản lý many-to-many relationship giữa Position và Role
 * Cho phép một chức vụ có nhiều role, một role có thể thuộc nhiều chức vụ
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("position_roles", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        position_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "positions",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            comment: "ID của chức vụ",
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "roles",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            comment: "ID của role",
        },
        is_primary: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            comment: "Role chính (mặc định gán cho nhân viên trong chức vụ)",
        },
        is_default: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            comment: "Tự động assign khi nhân viên cập nhật chức vụ",
        },
        priority: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "Thứ tự ưu tiên (0 = cao nhất)",
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
    await queryInterface.addIndex("position_roles", ["position_id", "role_id"], {
        unique: true,
        name: "unique_position_role",
    });
    await queryInterface.addIndex("position_roles", ["position_id"]);
    await queryInterface.addIndex("position_roles", ["role_id"]);
    await queryInterface.addIndex("position_roles", ["is_default"]);
    await queryInterface.addIndex("position_roles", ["priority"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("position_roles");
}
