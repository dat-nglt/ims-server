"use strict";

/**
 * Migration 023: Tạo bảng Projects (Dự án)
 *
 * Lưu trữ thông tin dự án:
 * - Thông tin cơ bản: tên, mô tả, trạng thái, ưu tiên
 * - Thời gian: bắt đầu, kết thúc
 * - Quản lý: người quản lý, người tạo
 * - Tài chính: ngân sách, chi tiêu
 * - Tiến độ: phần trăm hoàn thành
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("projects", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: "Tên dự án",
        },
        description: {
            type: Sequelize.TEXT,
            comment: "Mô tả chi tiết dự án",
        },
        status: {
            type: Sequelize.ENUM(
                "active",
                "in_progress",
                "completed",
                "on_hold",
                "cancelled"
            ),
            defaultValue: "active",
            comment: "Trạng thái dự án",
        },
        priority: {
            type: Sequelize.ENUM("low", "medium", "high"),
            defaultValue: "medium",
            comment: "Mức ưu tiên dự án",
        },
        progress: {
            type: Sequelize.DECIMAL(5, 2),
            defaultValue: 0,
            comment: "Phần trăm tiến độ hoàn thành (0-100)",
        },
        start_date: {
            type: Sequelize.DATE,
            comment: "Ngày bắt đầu dự án",
        },
        end_date: {
            type: Sequelize.DATE,
            comment: "Ngày kết thúc dự án",
        },
        manager_id: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "id",
            },
            comment: "ID người quản lý dự án",
        },
        budget: {
            type: Sequelize.DECIMAL(10, 2),
            comment: "Ngân sách dự án",
        },
        spent: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0,
            comment: "Số tiền đã chi tiêu",
        },
        totalTasks: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "Tổng số công việc trong dự án",
        },
        completedTasks: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "Số công việc đã hoàn thành",
        },
        overdueTasks: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "Số công việc quá hạn",
        },
        pendingReports: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "Số báo cáo đang chờ xử lý",
        },
        created_by: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "id",
            },
            comment: "ID người tạo dự án",
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            comment: "Thời gian tạo bản ghi (tự động)",
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            comment: "Thời gian cập nhật bản ghi cuối cùng (tự động)",
        },
    });

    await queryInterface.addIndex("projects", ["name"]);
    await queryInterface.addIndex("projects", ["status"]);
    await queryInterface.addIndex("projects", ["priority"]);
    await queryInterface.addIndex("projects", ["start_date"]);
    await queryInterface.addIndex("projects", ["end_date"]);
    await queryInterface.addIndex("projects", ["manager_id"]);
    await queryInterface.addIndex("projects", ["created_by"]);
    await queryInterface.addIndex("projects", ["totalTasks"]);
    await queryInterface.addIndex("projects", ["completedTasks"]);
    await queryInterface.addIndex("projects", ["overdueTasks"]);
    await queryInterface.addIndex("projects", ["pendingReports"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("projects");
}
