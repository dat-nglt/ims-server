'use strict';

/**
 * Model PerformanceMetric (Thống kê hiệu suất)
 * 
 * Lưu trữ thống kê hiệu suất hàng tháng của nhân viên
 */
export default (sequelize, DataTypes) => {
  const PerformanceMetric = sequelize.define(
    'PerformanceMetric',
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
      // Tháng thống kê
      month: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Tháng thống kê (chỉ cần năm và tháng)',
      },
      // Số công việc hoàn thành
      works_completed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      // Tổng số công việc
      works_total: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      // Phần trăm hoàn thành đúng hạn với validation
      on_time_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        validate: {
          min: 0,
          max: 100,
        },
      },
      // Điểm chất lượng với validation
      quality_score: {
        type: DataTypes.DECIMAL(3, 2),
        validate: {
          min: 1,
          max: 5,
        },
      },
      // Thời gian hoàn thành trung bình
      average_completion_time: {
        type: DataTypes.DECIMAL(8, 2),
      },
      // Số báo cáo đã gửi
      reports_submitted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'performance_metrics',
      timestamps: false,
      indexes: [
        { fields: ['user_id', 'month'] },
        { fields: ['month'] }, // Thêm index cho month để truy vấn theo tháng
      ],
    }
  );

  PerformanceMetric.associate = (models) => {
    PerformanceMetric.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return PerformanceMetric;
};
