'use strict';

/**
 * Migration 002: Tạo bảng Permissions (Quyền hạn)
 * 
 * Lưu trữ các quyền hạn có sẵn trong hệ thống
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('permissions', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('permissions', ['name']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('permissions');
}
