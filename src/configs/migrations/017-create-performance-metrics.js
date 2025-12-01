'use strict';

/**
 * Migration 017: Tạo bảng Performance Metrics (Thống kê hiệu suất)
 * 
 * Lưu trữ thống kê hiệu suất hàng tháng của nhân viên
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('performance_metrics', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    month: {
      type: Sequelize.DATE,
      allowNull: false,
      comment: 'Tháng thống kê (chỉ cần năm và tháng)',
    },
    works_completed: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    works_total: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    on_time_percentage: {
      type: Sequelize.DECIMAL(5, 2),
    },
    quality_score: {
      type: Sequelize.DECIMAL(3, 2),
    },
    average_completion_time: {
      type: Sequelize.DECIMAL(8, 2),
    },
    reports_submitted: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('performance_metrics', ['user_id', 'month']);
  await queryInterface.addIndex('performance_metrics', ['month']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('performance_metrics');
}
