'use strict';

/**
 * Model CheckIn (Chấm công)
 * 
 * Lưu trữ thông tin check-in/check-out:
 * - Vị trí GPS
 * - Ảnh chứng minh
 * - Thời gian làm việc
 * - Kiểm tra phạm vi
 * - Loại chấm công (mới: check_in_type)
 * - Liên kết dự án (mới: project_id, optional)
 * - Khoảng cách vi phạm (mới: violation_distance)
 * - Trạng thái enum (cập nhật: status với enum)
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
      // ID dự án (FK, mới: để hỗ trợ lọc theo dự án trong TrackAttendance, optional vì công việc có thể không thuộc dự án)
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional để hỗ trợ công việc không liên kết dự án
        references: {
          model: 'projects',
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
      // Trạng thái (cập nhật: enum để hỗ trợ 'on_leave' từ TrackAttendance)
      status: {
        type: DataTypes.ENUM('checked_in', 'checked_out', 'on_leave'),
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
      // Loại chấm công (mới: từ checkInTypes trong CheckIn.jsx)
      check_in_type: {
        type: DataTypes.STRING(50),
      },
      // Khoảng cách vi phạm (mới: từ violationDistance trong CheckIn.jsx)
      violation_distance: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
          min: 0,
        },
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
        { fields: ['project_id'] }, // Index mới cho lọc theo dự án
        { fields: ['check_in_type'] }, // Index mới cho lọc theo loại chấm công
      ],
      hooks: {
        // Hook mới: Tự động tính duration_minutes khi cập nhật check_out_time
        beforeSave: (checkIn, options) => {
          if (checkIn.check_out_time && checkIn.check_in_time) {
            const durationMs = new Date(checkIn.check_out_time) - new Date(checkIn.check_in_time);
            checkIn.duration_minutes = Math.floor(durationMs / (1000 * 60));
          }
        },
      },
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

    CheckIn.belongsTo(models.Project, {
      foreignKey: 'project_id',
      as: 'project',
    });
  };

  return CheckIn;
};
