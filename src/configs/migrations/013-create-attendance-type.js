"use strict";

/**
 * Migration 014: Tạo bảng Check In Types (Loại chấm công)
 *
 * Lưu trữ các loại chấm công có sẵn
 */

export async function up(queryInterface, Sequelize) {
    // Create reference table for check-in types
    await queryInterface.createTable("attendance_type", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: Sequelize.STRING(50),
            allowNull: false,
            comment: "Mã loại chấm công",
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: "Tên loại chấm công",
        },
        default_duration_minutes: {
            type: Sequelize.INTEGER,
            allowNull: true,
            comment: "Thời lượng mặc định (phút)",
        },
        // Giờ bắt đầu, giờ kết thúc cho loại chấm công (HH:MM:SS)
        start_time: {
            type: Sequelize.TIME,
            allowNull: true,
            comment: "Giờ bắt đầu (HH:MM:SS)",
        },
        end_time: {
            type: Sequelize.TIME,
            allowNull: true,
            comment: "Giờ kết thúc (HH:MM:SS)",
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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

    // Trigger function: compute default_duration_minutes from start_time/end_time when not provided
    await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION set_check_in_type_default_duration() RETURNS trigger AS $$
    DECLARE
      v_minutes integer;
    BEGIN
      IF (NEW.default_duration_minutes IS NULL OR NEW.default_duration_minutes = 0) AND NEW.start_time IS NOT NULL AND NEW.end_time IS NOT NULL THEN
        v_minutes := FLOOR(EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))/60);
        IF v_minutes < 0 THEN
          v_minutes := v_minutes + 24 * 60;
        END IF;
        NEW.default_duration_minutes := v_minutes;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

    await queryInterface.sequelize.query(`
    CREATE TRIGGER trg_set_default_duration
    BEFORE INSERT OR UPDATE ON attendance_type
    FOR EACH ROW EXECUTE PROCEDURE set_check_in_type_default_duration();
  `);
}

export async function down(queryInterface, Sequelize) {
    // Drop trigger and function if exist
    await queryInterface.sequelize.query(
        "DROP TRIGGER IF EXISTS trg_set_default_duration ON attendance_type;"
    );
    await queryInterface.sequelize.query(
        "DROP FUNCTION IF EXISTS set_check_in_type_default_duration();"
    );
    await queryInterface.dropTable("attendance_type");
}
