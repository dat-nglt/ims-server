"use strict";

/**
 * Migration 015: Tạo bảng Attendance/Check Ins (Chấm công)
 *
 * Lưu trữ thông tin check-in/check-out
 * Phụ thuộc vào migration 014 (attendance_type)
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendance", {
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
        // Thêm project_id: để hỗ trợ lọc theo dự án, optional
        project_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "projects",
                key: "id",
            },
        },
        attendance_session_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "attendance_sessions",
                key: "id",
            },
        },
        parent_attendance_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "attendance",
                key: "id",
            },
        },
        check_in_time: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        check_out_time: {
            type: Sequelize.DATE,
        },
        latitude: {
            type: Sequelize.DECIMAL(10, 8),
            comment: "Vĩ độ",
        },
        longitude: {
            type: Sequelize.DECIMAL(11, 8),
            comment: "Kinh độ",
        },
        location_name: {
            type: Sequelize.STRING(255),
        },
        address: {
            type: Sequelize.TEXT,
        },
        photo_url: {
            type: Sequelize.TEXT,
        },
        // Cập nhật status thành ENUM để hỗ trợ 'on_leave'
        status: {
            type: Sequelize.ENUM("checked_in", "checked_out", "on_leave"),
            defaultValue: "checked_in",
        },
        distance_from_work: {
            type: Sequelize.DECIMAL(10, 2),
            comment: "Khoảng cách từ công việc",
        },
        is_within_radius: {
            type: Sequelize.BOOLEAN,
            comment: "Có trong phạm vi hay không",
        },
        duration_minutes: {
            type: Sequelize.INTEGER,
            comment: "Thời gian làm việc",
        },
        device_info: {
            type: Sequelize.TEXT,
            comment: "Thông tin thiết bị",
        },
        ip_address: {
            type: Sequelize.STRING(45),
        },
        notes: {
            type: Sequelize.TEXT,
        },
        // Thêm check_in_type_id: FK tới bảng attendance_type
        check_in_type_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "attendance_type",
                key: "id",
            },
            comment: "FK tới loại chấm công",
        },
        // Thêm violation_distance: khoảng cách vi phạm
        violation_distance: {
            type: Sequelize.DECIMAL(10, 2),
            comment: "Khoảng cách vi phạm vị trí",
        },
        photo_urls: {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: "URL ảnh (1 ảnh duy nhất cho mỗi bản ghi)",
        },
        technicians: {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: "Danh sách technicians (denormalized fallback)",
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

    await queryInterface.addIndex("attendance", ["user_id"]);
    await queryInterface.addIndex("attendance", ["work_id"]);
    await queryInterface.addIndex("attendance", ["check_in_time"]);
    await queryInterface.addIndex("attendance", ["is_within_radius"]);
    await queryInterface.addIndex("attendance", ["status"]);
    await queryInterface.addIndex("attendance", ["user_id", "check_in_time"]); // Composite index cho truy vấn theo user và thời gian
    // Thêm indexes mới
    await queryInterface.addIndex("attendance", ["project_id"]);
    await queryInterface.addIndex("attendance", ["check_in_type_id"]);
    await queryInterface.addIndex("attendance", ["attendance_session_id"]);
    await queryInterface.addIndex("attendance", ["parent_attendance_id"]);
    // Additional indexes
    await queryInterface.addIndex("attendance", ["project_id", "check_in_time"]);
    await queryInterface.addIndex("attendance", ["work_id", "check_in_time"]);
    // Composite index for location queries
    await queryInterface.addIndex("attendance", ["latitude", "longitude"]);
    // Partial index for quick violation lookup (Postgres) - create only if not exists
    await queryInterface.sequelize.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'i'
          AND c.relname = 'attendance_is_within_radius'
      ) THEN
        CREATE INDEX attendance_is_within_radius ON attendance (is_within_radius) WHERE is_within_radius = false;
      END IF;
    END
    $$;
  `);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("attendance");
}
