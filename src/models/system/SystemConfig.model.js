'use strict';

/**
 * Model SystemConfig (Cấu hình hệ thống)
 * 
 * Lưu trữ toàn bộ cài đặt hệ thống dưới dạng JSON để phản ánh cấu trúc từ SystemSettings.jsx
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
      // Lưu trữ toàn bộ cài đặt dưới dạng JSON (bao gồm settings, notificationSettings, defaultPermissions, integrations, attendanceLocations, activityLog)
      settings: {
        type: DataTypes.JSONB, // Sử dụng JSONB cho PostgreSQL để query hiệu quả
        allowNull: false,
        defaultValue: {},
        comment: 'Toàn bộ cài đặt hệ thống dưới dạng JSON',
      },
      // Người cập nhật
      updated_by: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'Người dùng cập nhật cài đặt',
      },
      // Thời gian cập nhật
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'system_configs',
      timestamps: false,
      indexes: [
        { fields: ['updated_by'] },
        { fields: ['updated_at'] },
      ],
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
