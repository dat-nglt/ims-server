'use strict';

/**
 * Migration 006: Tạo bảng Work Assignments (Phân công công việc)
 * 
 * Lưu trữ thông tin phân công công việc cho kỹ thuật viên
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('work_assignments', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    work_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'works',
        key: 'id',
      },
    },
    technician_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    assigned_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    assignment_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    assigned_status: {
      type: Sequelize.STRING(50),
      defaultValue: 'pending',
    },
    accepted_at: {
      type: Sequelize.DATE,
    },
    rejected_reason: {
      type: Sequelize.TEXT,
    },
    estimated_start_time: {
      type: Sequelize.DATE,
    },
    estimated_end_time: {
      type: Sequelize.DATE,
    },
    actual_start_time: {
      type: Sequelize.DATE,
    },
    actual_end_time: {
      type: Sequelize.DATE,
    },
    notes: {
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

  await queryInterface.addIndex('work_assignments', ['technician_id']);
  await queryInterface.addIndex('work_assignments', ['work_id']);
  await queryInterface.addIndex('work_assignments', ['assigned_status']);
  await queryInterface.addIndex('work_assignments', ['assignment_date']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('work_assignments');
}
