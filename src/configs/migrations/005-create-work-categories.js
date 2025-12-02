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
      allowNull: false,
      comment: 'Tên danh mục công việc (Công trình hoặc Dịch vụ)',
    },
    description: {
      type: Sequelize.TEXT,
      comment: 'Mô tả chi tiết về danh mục',
    },
    icon: {
      type: Sequelize.STRING(50),
      comment: 'Tên icon từ thư viện (vd: zap, wind)',
    },
    color: {
      type: Sequelize.STRING(7),
      comment: 'Mã màu hex (vd: #FF6B6B)',
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      comment: 'Danh mục có hoạt động hay không',
    },
    display_order: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: 'Thứ tự hiển thị trong UI (1, 2, 3...)',
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

  await queryInterface.addIndex('work_categories', ['name', 'is_active'], { unique: true }); // Composite unique index for active records
  await queryInterface.addIndex('work_categories', ['is_active']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('work_categories');
}
