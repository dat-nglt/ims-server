"use strict";

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("overtime_requests", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
        },
        work_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "works", key: "id" },
        },
        department_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "departments", key: "id" },
        },
        requested_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        start_time: {
            type: Sequelize.TIME,
            allowNull: true,
        },
        end_time: {
            type: Sequelize.TIME,
            allowNull: true,
        },
        duration_minutes: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        actual_checkin_time: {
            type: Sequelize.TIME,
            allowNull: true,
        },
        actual_checkout_time: {
            type: Sequelize.TIME,
            allowNull: true,
        },
        actual_duration_minutes: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        reason: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        overtime_type: {
            type: Sequelize.ENUM("overtime_lunch", "overtime_night", "overtime_office", "other"),
            allowNull: false,
            defaultValue: "overtime_lunch",
        },
        overtime_category: {
            type: Sequelize.ENUM(
                "administrative_work",
                "project_support",
                "event_support",
                "report_processing",
                "data_entry",
                "meeting_support",
                "emergency_work",
                "other"
            ),
            allowNull: false,
            defaultValue: "administrative_work",
        },
        priority: {
            type: Sequelize.ENUM("low", "medium", "high", "urgent"),
            allowNull: false,
            defaultValue: "medium",
        },
        status: {
            type: Sequelize.ENUM("pending", "approved", "rejected", "cancelled"),
            allowNull: false,
            defaultValue: "pending",
        },
        approver_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "users", key: "id" },
        },
        approved_at: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        is_paid: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        reviewed_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "users", key: "id" },
        },
        rejected_reason: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        is_completed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        completion_notes: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        estimated_cost: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
        },
        actual_cost: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true,
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

    await queryInterface.addIndex("overtime_requests", ["user_id"]);
    await queryInterface.addIndex("overtime_requests", ["work_id"]);
    await queryInterface.addIndex("overtime_requests", ["status"]);
    await queryInterface.addIndex("overtime_requests", ["requested_date"]);
    await queryInterface.addIndex("overtime_requests", ["priority"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("overtime_requests");
}
