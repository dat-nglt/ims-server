"use strict";

/**
 * Migration 008: Tạo bảng Work History (Lịch sử công việc)
 *
 * Lưu trữ lịch sử thay đổi của công việc:
 * - Theo dõi tất cả thay đổi với old_values và new_values dưới dạng JSON
 * - Liên kết với công việc và người thay đổi
 * - Hỗ trợ theo dõi thay đổi trạng thái, phân công, và các trường khác
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("work_history", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        work_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "works",
                key: "id",
            },
            comment: "Công việc",
        },
        action: {
            type: Sequelize.ENUM(
                "created",
                "updated",
                "approved",
                "deleted",
                "assigned",
                "accepted",
                "rejected",
                "started",
                "completed",
                "reported",
                "report_updated",
                "report_approved",
                "report_rejected"
            ),
            defaultValue: "updated",
            comment: "Hành động thay đổi",
        },
        field_changed: {
            type: Sequelize.STRING(100),
            comment: "Tên trường thay đổi (nếu áp dụng)",
        },
        old_values: {
            type: Sequelize.JSONB,
            comment: "Giá trị trước thay đổi",
        },
        new_values: {
            type: Sequelize.JSONB,
            comment: "Giá trị sau thay đổi",
        },
        changed_by: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "id",
            },
            comment: "Người thay đổi",
        },
        changed_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            comment: "Thời gian thay đổi",
        },
        notes: {
            type: Sequelize.TEXT,
            comment: "Ghi chú về thay đổi",
        },
        ip_address: {
            type: Sequelize.STRING(45),
        },
        user_agent: {
            type: Sequelize.TEXT,
        },
    });

    await queryInterface.addIndex("work_history", ["work_id"]);
    await queryInterface.addIndex("work_history", ["action"]);
    await queryInterface.addIndex("work_history", ["field_changed"]);
    await queryInterface.addIndex("work_history", ["changed_at"]);
    await queryInterface.addIndex("work_history", ["changed_by"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("work_history");
}
