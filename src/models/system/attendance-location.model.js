"use strict";

/**
 * Model AttendanceLocation (Địa điểm điểm danh)
 *
 * Định nghĩa các địa điểm điểm danh công việc
 * Bao gồm văn phòng, công trường, kho hàng, v.v.
 */
export default (sequelize, DataTypes) => {
  const AttendanceLocation = sequelize.define(
    "AttendanceLocation",
    {
      // ID: khóa chính
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Mã định danh duy nhất cho địa điểm (vd: "warehouse", "office-hanoi")
      location_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      // Tên địa điểm (vd: "Văn phòng Proshop - Daikin")
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      // Loại địa điểm (vd: "warehouse", "office", "site")
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // Địa chỉ chi tiết
      address: {
        type: DataTypes.TEXT,
      },
      // Tọa độ vĩ độ
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },
      // Tọa độ kinh độ
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },
      // Bán kính cho phép (mét)
      radius: {
        type: DataTypes.INTEGER,
        defaultValue: 50,
      },
      // Biểu tượng cho địa điểm
      icon: {
        type: DataTypes.STRING(100),
      },
      // Trạng thái hoạt động
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      // Ghi chú
      notes: {
        type: DataTypes.TEXT,
      },
      // Timestamp
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "attendance_locations",
      timestamps: false,
      indexes: [
        { fields: ["location_code"], unique: true },
        { fields: ["type"] },
        { fields: ["is_active"] },
        { fields: ["latitude", "longitude"] },
      ],
    }
  );

  // Định nghĩa các mối quan hệ
  AttendanceLocation.associate = (models) => {
    // Một địa điểm có nhiều bản ghi điểm danh
    if (models.Attendance) {
      AttendanceLocation.hasMany(models.Attendance, {
        foreignKey: "location_id",
        as: "attendances",
      });
    }
  };

  return AttendanceLocation;
};
