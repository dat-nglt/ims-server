'use strict';

/**
 * Model SystemConfig (Cấu hình hệ thống)
 * 
 * Lưu trữ các cấu hình toàn hệ thống
 */
export default (sequelize, DataTypes) => {
  const SystemConfig = sequelize.define(
    'SystemConfig',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Khóa cấu hình
      config_key: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
      },
      // Giá trị cấu hình
      config_value: {
        type: DataTypes.TEXT,
      },
      // Loại dữ liệu
      config_type: {
        type: DataTypes.STRING(50),
      },
      // Mô tả
      description: {
        type: DataTypes.TEXT,
      },
      // Người cập nhật
      updated_by: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      // Thời gian cập nhật
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'system_config',
      timestamps: false,
      indexes: [{ fields: ['config_key'] }],
    }
  );

  SystemConfig.associate = (models) => {
    SystemConfig.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updatedByUser',
    });
  };

  return SystemConfig;
};
