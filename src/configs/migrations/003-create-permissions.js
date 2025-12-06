"use strict";

/**
 * Migration 002: Tạo bảng Permissions (Quyền hạn)
 *
 * Lưu trữ các quyền hạn có sẵn trong hệ thống
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("permissions", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false,
            comment:
                "Tên hiển thị quyền hạn bằng tiếng Việt: Bảng điều khiển, Chỉnh sửa công việc...",
        },
        code: {
            type: Sequelize.STRING(100),
            allowNull: false,
            comment:
                "Mã quyền hạn dùng trong logic: dashboard_permission, edit_work, approve_report...",
        },
        description: {
            type: Sequelize.TEXT,
        },
        category: {
            type: Sequelize.STRING(50),
            comment: "Danh mục quyền hạn: user_management, work_management...",
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            comment: "Soft delete flag",
        },
        created_by: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "id",
            },
        },
        updated_by: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "id",
            },
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
    });

    await queryInterface.addIndex("permissions", ["code", "is_deleted"], {
        unique: true,
    }); // Composite unique index for active records
    await queryInterface.addIndex("permissions", ["category"]);
    await queryInterface.addIndex("permissions", ["is_deleted"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("permissions");
}
