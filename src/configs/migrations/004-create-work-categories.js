'use strict';

/**
 * Migration 004: Tạo bảng Work Categories (Danh mục công việc)
 * 
 * Định nghĩa các loại công việc/dịch vụ
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('work_categories', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.ENUM('Công trình', 'Dịch vụ'),
      unique: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    icon: {
      type: Sequelize.STRING(50),
    },
    color: {
      type: Sequelize.STRING(7),
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    display_order: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
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

  await queryInterface.addIndex('work_categories', ['name']);
  await queryInterface.addIndex('work_categories', ['is_active']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('work_categories');
}
