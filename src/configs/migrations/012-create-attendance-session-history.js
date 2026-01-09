"use strict";

/**
 * Migration 012: Tạo bảng Attendance Session History
 *
 * Lưu lại lịch sử của các phiên chấm công đã kết thúc
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendance_session_histories", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        original_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
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
            type: Sequelize.STRING(20),
        },
        duration_minutes: {
            type: Sequelize.INTEGER,
        },
        check_in_id: {
            type: Sequelize.INTEGER,
        },
        check_out_id: {
            type: Sequelize.INTEGER,
        },
        attendance_type_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        // Danh sách user IDs tham gia phiên (primary + co-technicians)
        attendee_user_ids: {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        notes: {
            type: Sequelize.TEXT,
        },
        metadata: {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        archived_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        archived_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
        },
        latitude: {
            type: Sequelize.DECIMAL(10, 8),
            allowNull: true,
        },
        longitude: {
            type: Sequelize.DECIMAL(11, 8),
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

    await queryInterface.addIndex("attendance_session_histories", ["original_id"]);
    await queryInterface.addIndex("attendance_session_histories", ["user_id"]);
    await queryInterface.addIndex("attendance_session_histories", ["work_id"]);
    await queryInterface.addIndex("attendance_session_histories", ["project_id"]);
    await queryInterface.addIndex("attendance_session_histories", ["archived_at"]);
    await queryInterface.addIndex("attendance_session_histories", ["attendance_type_id"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("attendance_session_histories");
}
