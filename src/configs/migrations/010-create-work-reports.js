'use strict';

/**
 * Migration 007: Tạo bảng Work Reports (Báo cáo công việc)
 * 
 * Lưu trữ báo cáo tiến độ/hoàn thành công việc
 * - Bao gồm vị trí, hình ảnh phân loại, người phê duyệt được giao
 */

export async function up(queryInterface, Sequelize) {
  // Drop any existing conflicting types
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS work_reports CASCADE;');
  
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
      comment: 'ID công việc',
    },
    project_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id',
      },
      comment: 'ID dự án',
    },
    reported_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'ID người báo cáo',
    },
    progress_percentage: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.STRING(50),
      defaultValue: 'in_progress',
      comment: 'Trạng thái: in_progress, completed',
    },
    description: {
      type: Sequelize.TEXT,
      comment: 'Mô tả chi tiết công việc đã làm',
    },
    notes: {
      type: Sequelize.TEXT,
      comment: 'Ghi chú thêm',
    },
    photo_urls: {
      type: Sequelize.JSONB,
    },
    location: {
      type: Sequelize.STRING(255),
      comment: 'Vị trí công việc',
    },
    before_images: {
      type: Sequelize.JSONB,
      comment: 'Danh sách URL ảnh trước khi làm (JSON)',
    },
    during_images: {
      type: Sequelize.JSONB,
      comment: 'Danh sách URL ảnh trong quá trình làm (JSON)',
    },
    after_images: {
      type: Sequelize.JSONB,
      comment: 'Danh sách URL ảnh sau khi làm (JSON)',
    },
    assigned_approver: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'ID người được giao phê duyệt',
    },
    materials_used: {
      type: Sequelize.TEXT,
      comment: 'Vật liệu, thiết bị sử dụng',
    },
    issues_encountered: {
      type: Sequelize.TEXT,
      comment: 'Các vấn đề/khó khăn gặp phải',
    },
    solution_applied: {
      type: Sequelize.TEXT,
      comment: 'Giải pháp đã áp dụng',
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
  await queryInterface.addIndex('work_reports', ['project_id']);
  await queryInterface.addIndex('work_reports', ['reported_by']);
  await queryInterface.addIndex('work_reports', ['approval_status']);
  await queryInterface.addIndex('work_reports', ['reported_at']);
  await queryInterface.addIndex('work_reports', ['quality_rating']);
  await queryInterface.addIndex('work_reports', ['assigned_approver']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('work_reports');
}
