"use strict";

/**
 * Migration 023: Tạo bảng Projects (Dự án)
 *
 * Lưu trữ thông tin dự án:
 * - Thông tin cơ bản: tên, mô tả, trạng thái, ưu tiên
 * - Thời gian: bắt đầu, kết thúc
 * - Quản lý: người quản lý, người tạo
 * - Tài chính: ngân sách, chi tiêu (budget/spent set to DECIMAL(13,2))
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
            type: Sequelize.DECIMAL(13, 2),
            comment: "Ngân sách dự án",
        },
        spent: {
            type: Sequelize.DECIMAL(13, 2),
            defaultValue: 0,
            comment: "Số tiền đã chi tiêu",
        },
        total_tasks: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "Tổng số công việc trong dự án",
        },
        completed_tasks: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "Số công việc đã hoàn thành",
        },
        overdue_tasks: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "Số công việc quá hạn",
        },
        pending_reports: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "Số báo cáo đang chờ xử lý",
        },
        planned_manpower: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "Planned manpower (person-days)",
        },
        consumed_manpower: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "Consumed manpower (person-days)",
        },
        timeline: {
            type: Sequelize.JSONB,
            comment: "Project timeline points",
        },
        budget_details: {
            type: Sequelize.JSONB,
            comment: "Budget breakdown by category",
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
    await queryInterface.addIndex("projects", ["total_tasks"]);
    await queryInterface.addIndex("projects", ["completed_tasks"]);
    await queryInterface.addIndex("projects", ["overdue_tasks"]);
    await queryInterface.addIndex("projects", ["pending_reports"]);
    await queryInterface.addIndex("projects", ["planned_manpower"]);
    await queryInterface.addIndex("projects", ["consumed_manpower"]);

    // Create project_team_members table
    await queryInterface.createTable("project_team_members", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        project_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "projects", key: "id" },
            onDelete: "CASCADE",
        },
        user_id: {
            type: Sequelize.INTEGER,
            references: { model: "users", key: "id" },
            onDelete: "SET NULL",
        },
        name: { type: Sequelize.STRING(255) },
        role: { type: Sequelize.STRING(100) },
        days_worked: { type: Sequelize.INTEGER, defaultValue: 0 },
        allocation_percent: { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
        created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });

    await queryInterface.addIndex("project_team_members", ["project_id"]);
    await queryInterface.addIndex("project_team_members", ["user_id"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("project_team_members");
    await queryInterface.dropTable("projects");
}
