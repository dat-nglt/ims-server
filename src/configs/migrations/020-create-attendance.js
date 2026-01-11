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
      allowNull: true,
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
    check_in_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    check_out_time: {
      type: Sequelize.DATE,
    },
    check_in_time_on_local: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Thời gian check-in theo múi giờ địa phương (không chuyển đổi UTC)",
    },
    check_out_time_on_local: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Thời gian check-out theo múi giờ địa phương (không chuyển đổi UTC)",
    },
    latitude: {
      type: Sequelize.DECIMAL(10, 8),
      comment: "Vĩ độ check-in",
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 8),
      comment: "Kinh độ check-in",
    },
    latitude_check_out: {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
      comment: "Vĩ độ check-out",
    },
    longitude_check_out: {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
      comment: "Kinh độ check-out",
    },
    location_name: {
      type: Sequelize.STRING(255),
    },
    location_name_check_out: {
      type: Sequelize.STRING(255),
    },
    address: {
      type: Sequelize.TEXT,
    },
    photo_url: {
      type: Sequelize.TEXT,
    },
    photo_url_check_out: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "URL ảnh check-out",
    },
    address_check_out: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Địa chỉ check-out",
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
    distance_from_work_check_out: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: "Khoảng cách từ công việc khi check-out",
    },
    is_within_radius_check_out: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment: "Có trong phạm vi hay không khi check-out",
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
    // Metadata (JSONB) - used for hub info and other metadata
    metadata: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: "Additional metadata (e.g. hub: 'warehouse'|'office')",
    },
    // Check-in metadata - lưu trữ metadata riêng cho check-in
    check_in_metadata: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: "Metadata cho check-in (attendanceMode, isAtHub, locationType)",
    },
    // Check-out metadata - lưu trữ metadata riêng cho check-out
    check_out_metadata: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: "Metadata cho check-out (attendanceMode, isAtHub, locationType)",
    },
    // Thêm attendance_type_id: FK tới bảng attendance_type
    attendance_type_id: {
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
    violation_distance_check_out: {
      type: Sequelize.DECIMAL(10, 2),
      comment: "Khoảng cách vi phạm vị trí khi check-out",
    },
    // Bản ghi chấm công hợp lệ về mặt thời gian (null = chưa đánh giá, true/false = đã đánh giá)
    is_valid_time_check_in: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: "Bản ghi chấm công hợp lệ về thời gian (null = chưa đánh giá)",
    },
    is_valid_time_check_out: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: "Bản ghi chấm công hợp lệ về thời gian (null = chưa đánh giá)",
    },

    // Xử lý hoàn thành sớm (kỹ thuật viên hoàn thành việc sớm hơn giờ checkout)
    early_completion_flag: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: "Đánh dấu công việc được hoàn thành sớm",
    },
    early_completion_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Thời gian kỹ thuật viên báo hoàn thành công việc",
    },
    early_completion_notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Ghi chú của kỹ thuật viên về lý do hoàn thành sớm",
    },
    early_completion_reviewed: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: "Trạng thái xét duyệt hoàn thành sớm (null = chưa xét duyệt, true = duyệt, false = từ chối)",
    },
    early_completion_reviewer_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      comment: "ID người xét duyệt hoàn thành sớm",
    },
    early_completion_review_at: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Thời gian xét duyệt hoàn thành sớm",
    },
    early_completion_review_notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Ghi chú xét duyệt từ người quản lý",
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
  // Indexes for quick lookup of validity states (check-in and check-out)
  await queryInterface.addIndex("attendance", ["is_valid_time_check_in"]);
  await queryInterface.addIndex("attendance", ["is_valid_time_check_out"]);
  // Indexes for early completion handling
  await queryInterface.addIndex("attendance", ["early_completion_flag"]);
  await queryInterface.addIndex("attendance", ["early_completion_reviewed"]);
  await queryInterface.addIndex("attendance", ["early_completion_reviewer_id"]);
  await queryInterface.addIndex("attendance", ["user_id", "check_in_time"]); // Composite index cho truy vấn theo user và thời gian
  // Thêm indexes mới
  await queryInterface.addIndex("attendance", ["project_id"]);
  await queryInterface.addIndex("attendance", ["attendance_type_id"]);
  await queryInterface.addIndex("attendance", ["attendance_session_id"]);
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

  // Create expression index for metadata.hub to speed hub lookups (Postgres)
  await queryInterface.sequelize.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'i'
          AND c.relname = 'attendance_metadata_hub_idx'
      ) THEN
        CREATE INDEX attendance_metadata_hub_idx ON attendance ((metadata->>'hub'));
      END IF;
    END
    $$;
  `);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("attendance");
}
