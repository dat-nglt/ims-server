'use strict';

/**
 * Migration 018: Tạo bảng Dashboard Metrics (Thống kê dashboard)
 * 
 * Lưu trữ các thống kê hàng ngày cho dashboard
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('dashboard_metrics', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    metric_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    metric_type: {
      type: Sequelize.STRING(50),
      comment: 'completed_works, total_hours, quality_score...',
    },
    metric_value: {
      type: Sequelize.DECIMAL(10, 2),
    },
    metric_json: {
      type: Sequelize.JSONB,
      comment: 'Dữ liệu chi tiết dạng JSON',
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('dashboard_metrics', ['user_id', 'metric_date']);
  await queryInterface.addIndex('dashboard_metrics', ['metric_type']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('dashboard_metrics');
}
