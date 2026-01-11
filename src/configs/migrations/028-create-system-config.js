'use strict';

/**
 * Migration 019: Tạo bảng System Config (Cấu hình hệ thống)
 * 
 * Lưu trữ các cấu hình toàn hệ thống
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('system_config', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    config_key: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: false,
    },
    config_value: {
      type: Sequelize.TEXT,
    },
    config_type: {
      type: Sequelize.STRING(50),
    },
    description: {
      type: Sequelize.TEXT,
    },
    updated_by: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Người cập nhật',
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('system_config', ['config_key']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('system_config');
}
