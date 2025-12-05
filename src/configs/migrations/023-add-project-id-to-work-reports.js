'use strict';

/**
 * Migration 023: Thêm cột project_id vào bảng work_reports
 * 
 * Để hỗ trợ lọc báo cáo theo dự án mà không cần join với bảng works
 */

export async function up(queryInterface, Sequelize) {
  // Removed redundant addColumn and addIndex for project_id, as it already exists from migration 008
}

export async function down(queryInterface, Sequelize) {
  // Removed redundant removeColumn and removeIndex, as project_id is managed in migration 008
}