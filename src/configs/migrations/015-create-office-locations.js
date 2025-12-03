'use strict';

/**
 * Migration 015: Tạo bảng Office Locations (Vị trí văn phòng/kho)
 * 
 * Lưu trữ vị trí cố định của văn phòng, kho, và các địa điểm làm việc
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('office_locations', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM('office', 'warehouse', 'branch', 'other'),
      defaultValue: 'office',
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(20),
    },
    working_hours: {
      type: Sequelize.STRING(100),
    },
    latitude: {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: false,
    },
    radius: {
      type: Sequelize.INTEGER,
      defaultValue: 100,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('office_locations', ['type']);
  await queryInterface.addIndex('office_locations', ['is_active']);
  await queryInterface.addIndex('office_locations', ['latitude', 'longitude']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('office_locations');
}
