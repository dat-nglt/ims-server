'use strict';

/**
 * Migration 014: Tạo bảng Approval Workflows (Quy trình phê duyệt)
 * 
 * Lưu trữ quy trình phê duyệt báo cáo
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('approval_workflow', {
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
    report_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'work_reports',
        key: 'id',
      },
    },
    current_approver_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    approval_step: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    current_step_status: {
      type: Sequelize.STRING(50),
      defaultValue: 'pending',
    },
    comments: {
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

  await queryInterface.addIndex('approval_workflow', ['work_id']);
  await queryInterface.addIndex('approval_workflow', ['report_id']);
  await queryInterface.addIndex('approval_workflow', ['approval_step']);
  await queryInterface.addIndex('approval_workflow', ['current_step_status']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('approval_workflow');
}
