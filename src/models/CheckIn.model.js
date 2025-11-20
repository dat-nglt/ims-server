'use strict';

/**
 * Model CheckIn (Chấm công)
 * 
 * Lưu trữ thông tin check-in/check-out:
 * - Vị trí GPS
 * - Ảnh chứng minh
 * - Thời gian làm việc
 * - Kiểm tra phạm vi
 */
export default (sequelize, DataTypes) => {
  const CheckIn = sequelize.define(
    'CheckIn',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // ID người dùng (FK)
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      // ID công việc (FK)
      work_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'works',
          key: 'id',
        },
      },
      // Thời gian check-in
      check_in_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      // Thời gian check-out
      check_out_time: {
        type: DataTypes.DATE,
      },
      // Vĩ độ với validation
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        validate: {
          min: -90,
          max: 90,
        },
      },
      // Kinh độ với validation
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        validate: {
          min: -180,
          max: 180,
        },
      },
      // Tên địa điểm
      location_name: {
        type: DataTypes.STRING(255),
      },
      // Địa chỉ đầy đủ
      address: {
        type: DataTypes.TEXT,
      },
      // URL ảnh
      photo_url: {
        type: DataTypes.TEXT,
      },
      // Trạng thái
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'checked_in',
      },
      // Khoảng cách từ công việc với validation
      distance_from_work: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
          min: 0,
        },
      },
      // Có trong phạm vi hay không
      is_within_radius: {
        type: DataTypes.BOOLEAN,
      },
      // Thời gian làm việc với validation
      duration_minutes: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
      },
      // Thông tin thiết bị
      device_info: {
        type: DataTypes.TEXT,
      },
      // IP address
      ip_address: {
        type: DataTypes.STRING(45),
      },
      // Ghi chú
      notes: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'check_ins',
      timestamps: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['work_id'] },
        { fields: ['check_in_time'] },
        { fields: ['is_within_radius'] },
        { fields: ['status'] },
        { fields: ['user_id', 'check_in_time'] }, // Composite index cho truy vấn theo user và thời gian
      ],
    }
  );

  // Định nghĩa các mối quan hệ
  CheckIn.associate = (models) => {
    CheckIn.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    CheckIn.belongsTo(models.Work, {
      foreignKey: 'work_id',
      as: 'work',
    });
  };

  return CheckIn;
};
