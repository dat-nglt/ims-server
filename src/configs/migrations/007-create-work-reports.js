'use strict';

/**
 * Migration 007: Tạo bảng Work Reports (Báo cáo công việc)
 * 
 * Lưu trữ báo cáo tiến độ/hoàn thành công việc
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('work_reports', {
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
    reported_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    progress_percentage: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.STRING(50),
      defaultValue: 'in_progress',
    },
    description: {
      type: Sequelize.TEXT,
    },
    notes: {
      type: Sequelize.TEXT,
    },
    photo_urls: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    materials_used: {
      type: Sequelize.TEXT,
    },
    issues_encountered: {
      type: Sequelize.TEXT,
    },
    solution_applied: {
      type: Sequelize.TEXT,
    },
    time_spent_hours: {
      type: Sequelize.DECIMAL(5, 2),
    },
    next_steps: {
      type: Sequelize.TEXT,
    },
    submitted_by_role: {
      type: Sequelize.STRING(50),
    },
    approval_status: {
      type: Sequelize.STRING(50),
      defaultValue: 'pending',
    },
    approved_by: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    approved_at: {
      type: Sequelize.DATE,
    },
    quality_rating: {
      type: Sequelize.INTEGER,
    },
    rejection_reason: {
      type: Sequelize.TEXT,
    },
    reported_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
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

  await queryInterface.addIndex('work_reports', ['work_id']);
  await queryInterface.addIndex('work_reports', ['reported_by']);
  await queryInterface.addIndex('work_reports', ['approval_status']);
  await queryInterface.addIndex('work_reports', ['reported_at']);
  await queryInterface.addIndex('work_reports', ['quality_rating']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('work_reports');
}
