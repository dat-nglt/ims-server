'use strict';

/**
 * Migration 014: Tạo bảng Location Histories (Lịch sử vị trí)
 * 
 * Lưu trữ lịch sử vị trí GPS của kỹ thuật viên
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('location_histories', {
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
    latitude: {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: false,
    },
    accuracy: {
      type: Sequelize.DECIMAL(10, 2),
    },
    status: {
      type: Sequelize.ENUM('working', 'idle', 'break', 'offline'),
      defaultValue: 'idle',
    },
    timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    device_info: {
      type: Sequelize.TEXT,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('location_histories', ['user_id']);
  await queryInterface.addIndex('location_histories', ['timestamp']);
  await queryInterface.addIndex('location_histories', ['status']);
  await queryInterface.addIndex('location_histories', ['user_id', 'timestamp']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('location_histories');
}
