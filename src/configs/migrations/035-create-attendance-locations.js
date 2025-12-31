"use strict";

/**
 * Migration 035: Tạo bảng Attendance Locations (Địa điểm điểm danh)
 *
 * Định nghĩa các địa điểm chấm công
 * Bao gồm văn phòng, công trường, kho hàng, v.v.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("attendance_locations", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    location_code: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Mã định danh duy nhất cho địa điểm (vd: warehouse, office-hanoi)",
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "Tên địa điểm (vd: Văn phòng Proshop - Daikin)",
    },
    type: {
      type: Sequelize.STRING(50),
      allowNull: false,
      comment: "Loại địa điểm (vd: warehouse, office, site)",
    },
    address: {
      type: Sequelize.TEXT,
      comment: "Địa chỉ chi tiết của địa điểm",
    },
    latitude: {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: false,
      comment: "Tọa độ vĩ độ",
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: false,
      comment: "Tọa độ kinh độ",
    },
    radius: {
      type: Sequelize.INTEGER,
      defaultValue: 50,
      comment: "Bán kính cho phép chấm công (mét)",
    },
    icon: {
      type: Sequelize.STRING(100),
      comment: "Biểu tượng cho địa điểm trên bản đồ",
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      comment: "Địa điểm có hoạt động hay không",
    },
    notes: {
      type: Sequelize.TEXT,
      comment: "Ghi chú thêm về địa điểm",
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

  // Add indexes
  await queryInterface.addIndex("attendance_locations", ["location_code"], { unique: true });
  await queryInterface.addIndex("attendance_locations", ["type"]);
  await queryInterface.addIndex("attendance_locations", ["is_active"]);
  await queryInterface.addIndex("attendance_locations", ["latitude", "longitude"]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("attendance_locations");
}
