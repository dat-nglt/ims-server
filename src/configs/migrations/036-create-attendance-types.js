"use strict";

/**
 * Migration 036: Tạo bảng Attendance Types (Loại Chấm Công)
 *
 * Định nghĩa các loại chấm công
 * Bao gồm ca đêm, ca ngày, tăng ca ngoài giờ, tăng ca trưa, v.v.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("attendance_types", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Mã định danh duy nhất cho loại chấm công (vd: REGULAR, NIGHT_SHIFT)",
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "Tên loại chấm công (vd: Chấm Công Ca Ngày)",
    },
    time: {
      type: Sequelize.STRING(50),
      allowNull: false,
      comment: "Khoảng thời gian áp dụng (vd: 08:00 - 17:00)",
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      comment: "Trạng thái hoạt động",
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Ghi chú",
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: "Ngày tạo",
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: "Ngày cập nhật",
    },
  });

  // Tạo indexes
  await queryInterface.addIndex("attendance_types", ["code"], {
    unique: true,
    name: "idx_attendance_types_code_unique",
  });

  await queryInterface.addIndex("attendance_types", ["is_active"], {
    name: "idx_attendance_types_is_active",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex(
    "attendance_types",
    "idx_attendance_types_is_active"
  );
  await queryInterface.removeIndex(
    "attendance_types",
    "idx_attendance_types_code_unique"
  );
  await queryInterface.dropTable("attendance_types");
}
