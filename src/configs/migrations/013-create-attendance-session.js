"use strict";

/**
 * Migration 013: Tạo bảng Attendance Sessions
 *
 * Lưu trữ phiên chấm công cho 1 kỹ thuật trên 1 công việc
 * Một phiên = một cặp check-in/out
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendance_sessions", {
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
        },
        work_id: {
            type: Sequelize.INTEGER,
            references: {
                model: "works",
                key: "id",
            },
        },
        project_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "projects",
                key: "id",
            },
        },
        started_at: {
            type: Sequelize.DATE,
        },
        ended_at: {
            type: Sequelize.DATE,
        },
        status: {
            type: Sequelize.ENUM("open", "closed"),
            defaultValue: "open",
        },
        duration_minutes: {
            type: Sequelize.INTEGER,
            validate: {
                min: 0,
            },
        },
        // Optional references to the first/last attendance records
        // FK constraint will be added after attendance table is created
        check_in_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        check_out_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        notes: {
            type: Sequelize.TEXT,
        },
        metadata: {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: {},
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

    await queryInterface.addIndex("attendance_sessions", ["user_id"]);
    await queryInterface.addIndex("attendance_sessions", ["work_id"]);
    await queryInterface.addIndex("attendance_sessions", ["started_at"]);
    await queryInterface.addIndex("attendance_sessions", ["ended_at"]);
    await queryInterface.addIndex("attendance_sessions", ["status"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("attendance_sessions");
}
