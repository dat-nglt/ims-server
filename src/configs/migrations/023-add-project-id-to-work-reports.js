'use strict';

/**
 * Migration 023: Thêm cột project_id vào bảng work_reports
 * 
 * Để hỗ trợ lọc báo cáo theo dự án mà không cần join với bảng works
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('work_reports', 'project_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'projects',
      key: 'id',
    },
    comment: 'ID dự án',
  });

  await queryInterface.addIndex('work_reports', ['project_id']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex('work_reports', ['project_id']);
  await queryInterface.removeColumn('work_reports', 'project_id');
}