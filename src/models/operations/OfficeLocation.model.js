'use strict';

/**
 * Model OfficeLocation (Vị trí văn phòng/kho)
 * 
 * Lưu trữ thông tin vị trí cố định của văn phòng, kho, và các địa điểm làm việc
 */
export default (sequelize, DataTypes) => {
  const OfficeLocation = sequelize.define(
    'OfficeLocation',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Tên địa điểm
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      // Loại địa điểm (office, warehouse, etc.)
      type: {
        type: DataTypes.ENUM('office', 'warehouse', 'branch', 'other'),
        defaultValue: 'office',
      },
      // Địa chỉ
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // Số điện thoại
      phone: {
        type: DataTypes.STRING(20),
      },
      // Giờ làm việc
      working_hours: {
        type: DataTypes.STRING(100),
      },
      // Vĩ độ
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
        },
      },
      // Kinh độ
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
        },
      },
      // Bán kính cho phép (m)
      radius: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
      },
      // Trạng thái hoạt động
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'office_locations',
      timestamps: false,
      indexes: [
        { fields: ['type'] },
        { fields: ['is_active'] },
        { fields: ['latitude', 'longitude'] }, // Index cho truy vấn vị trí
      ],
    }
  );

  // Định nghĩa các mối quan hệ (nếu cần)
  OfficeLocation.associate = (models) => {
    // Có thể thêm belongsTo User nếu cần quản lý người tạo
  };

  return OfficeLocation;
};
