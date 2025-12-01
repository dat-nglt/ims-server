'use strict';

/**
 * Model DashboardMetric (Thống kê dashboard)
 * 
 * Lưu trữ các thống kê hàng ngày cho dashboard
 */
export default (sequelize, DataTypes) => {
  const DashboardMetric = sequelize.define(
    'DashboardMetric',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // ID người dùng (FK)
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      // Ngày thống kê
      metric_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      // Loại thống kê
      metric_type: {
        type: DataTypes.STRING(50),
        comment: 'completed_works, total_hours, quality_score...',
      },
      // Giá trị thống kê
      metric_value: {
        type: DataTypes.DECIMAL(10, 2),
      },
      // Dữ liệu JSON chi tiết
      metric_json: {
        type: DataTypes.JSONB,
        comment: 'Dữ liệu chi tiết dạng JSON',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'dashboard_metrics',
      timestamps: false,
      indexes: [
        { fields: ['user_id', 'metric_date'] },
        { fields: ['metric_type'] },
      ],
    }
  );

  DashboardMetric.associate = (models) => {
    DashboardMetric.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return DashboardMetric;
};
