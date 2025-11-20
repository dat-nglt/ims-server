'use strict';

/**
 * Migration 013: Tạo bảng Attachments (Tập tin đính kèm)
 * 
 * Lưu trữ các tập tin đính kèm cho công việc/báo cáo
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('attachments', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    work_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'works',
        key: 'id',
      },
    },
    report_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'work_reports',
        key: 'id',
      },
    },
    file_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    file_url: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    file_type: {
      type: Sequelize.STRING(50),
    },
    file_size: {
      type: Sequelize.INTEGER,
    },
    uploaded_by: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    uploaded_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('attachments', ['work_id']);
  await queryInterface.addIndex('attachments', ['report_id']);
  await queryInterface.addIndex('attachments', ['uploaded_by']);
  await queryInterface.addIndex('attachments', ['uploaded_at']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('attachments');
}
