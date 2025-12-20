"use strict";

/**
 * Migration 020: Tạo bảng Notifications (Thông báo)
 *
 * Lưu trữ các thông báo cho người dùng
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            comment: 'Người dùng nhận thông báo',
        },
        title: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: 'Tiêu đề thông báo',
        },
        message: {
            type: Sequelize.TEXT,
            comment: 'Nội dung chi tiết',
        },
        type: {
            type: Sequelize.STRING(50),
            comment: 'Loại thông báo',
        },
        related_work_id: {
            type: Sequelize.INTEGER,
            references: {
                model: "works",
                key: "id",
            },
            comment: 'ID công việc liên quan (nếu có)',
        },
        related_project_id: {
            type: Sequelize.INTEGER,
            references: {
                model: "projects",
                key: "id",
            },
            comment: 'ID dự án liên quan (nếu có)',
        },
        is_read: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            comment: 'Đã đọc thông báo',
        },
        read_at: {
            type: Sequelize.DATE,
            comment: 'Thời điểm đọc thông báo',
        },
        action_url: {
            type: Sequelize.STRING(255),
            comment: 'URL để xử lý hành động',
        },
        priority: {
            type: Sequelize.STRING(20),
            allowNull: false,
            defaultValue: 'low',
            comment: 'Mức độ ưu tiên: high|medium|low',
        },
        meta: {
            type: Sequelize.JSON,
            allowNull: true,
            comment: 'Dữ liệu bổ sung cho thông báo (JSON)',
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
    });

    await queryInterface.addIndex("notifications", ["user_id"]);
    await queryInterface.addIndex("notifications", ["is_read"]);
    await queryInterface.addIndex("notifications", ["type"]);
    await queryInterface.addIndex("notifications", ["priority"]);
    await queryInterface.addIndex("notifications", ["created_at"]);
    await queryInterface.addIndex("notifications", ["user_id", "is_read"]);
    await queryInterface.addIndex("notifications", ["related_project_id"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notifications");
}
