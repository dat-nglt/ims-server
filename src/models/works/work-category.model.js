'use strict';

/**
 * Model WorkCategory (Danh mục công việc)
 * 
 * Định nghĩa các loại công việc/dịch vụ:
 * - Công trình
 * - Dịch vụ
 */
export default (sequelize, DataTypes) => {
  const WorkCategory = sequelize.define(
    'WorkCategory',
    {
      // ID: khóa chính
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Tên danh mục: chỉ cho phép 'Công trình' hoặc 'Dịch vụ'
      name: {
        type: DataTypes.ENUM('Công trình', 'Dịch vụ'),
        allowNull: false,
        comment: 'Tên danh mục công việc (Công trình hoặc Dịch vụ)',
      },
      // Mô tả chi tiết
      description: {
        type: DataTypes.TEXT,
        comment: 'Mô tả chi tiết về danh mục',
      },
      // Icon hiển thị
      icon: {
        type: DataTypes.STRING(50),
        comment: 'Tên icon từ thư viện (vd: zap, wind)',
      },
      // Mã màu hex
      color: {
        type: DataTypes.STRING(7),
        comment: 'Mã màu hex (vd: #FF6B6B)',
      },
      // Trạng thái hoạt động
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Danh mục có hoạt động hay không',
      },
      // Thứ tự hiển thị
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Thứ tự hiển thị trong UI (1, 2, 3...)',
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
      tableName: 'work_categories',
      timestamps: false,
      indexes: [
        { fields: ['name', 'is_active'], unique: true }, // Composite unique index for active records
        { fields: ['is_active'] }
      ],
    }
  );

  // Định nghĩa các mối quan hệ
  WorkCategory.associate = (models) => {
    // Một danh mục có nhiều công việc
    WorkCategory.hasMany(models.Work, {
      foreignKey: 'category_id',
      as: 'works',
    });
  };

  return WorkCategory;
};
