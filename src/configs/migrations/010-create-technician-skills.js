'use strict';

/**
 * Migration 010: Tạo bảng Technician Skills (Cấp bậc kỹ thuật viên)
 * 
 * Lưu trữ cấp bậc của từng kỹ thuật viên
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('technician_skills', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    technician_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    technician_level: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    assigned_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('technician_skills', ['technician_id']);
  await queryInterface.addIndex('technician_skills', ['technician_level']);
  await queryInterface.addConstraint('technician_skills', {
    fields: ['technician_id', 'technician_level'],
    type: 'unique',
    name: 'unique_technician_level',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('technician_skills');
}
