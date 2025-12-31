"use strict";

/**
 * Model AttendanceType (Loại Chấm Công)
 *
 * Định nghĩa các loại chấm công
 * Bao gồm ca đêm, ca ngày, tăng ca ngoài giờ, tăng ca trưa, v.v.
 */
export default (sequelize, DataTypes) => {
  const AttendanceType = sequelize.define(
    "AttendanceType",
    {
      // ID: khóa chính
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Mã định danh duy nhất cho loại chấm công (vd: "REGULAR", "NIGHT_SHIFT")
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      // Tên loại chấm công (vd: "Chấm Công Ca Ngày")
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      // Khoảng thời gian áp dụng (vd: "08:00 - 17:00")
      time: {
        type: DataTypes.STRING(50),
        allowNull: false,
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
      tableName: "attendance_types",
      timestamps: false,
      indexes: [
        { fields: ["code"], unique: true },
        { fields: ["is_active"] },
      ],
    }
  );

  // Định nghĩa các mối quan hệ
  AttendanceType.associate = (models) => {
    // Một loại chấm công có nhiều bản ghi điểm danh
    if (models.Attendance) {
      AttendanceType.hasMany(models.Attendance, {
        foreignKey: "check_in_type_id",
        as: "attendances",
      });
    }
  };

  return AttendanceType;
};
