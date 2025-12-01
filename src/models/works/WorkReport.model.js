'use strict';

/**
 * Model WorkReport (Báo cáo công việc)
 * 
 * Lưu trữ báo cáo tiến độ/hoàn thành công việc:
 * - Phần trăm hoàn thành
 * - Ảnh chứng minh (trước, trong, sau)
 * - Vấn đề & giải pháp
 * - Phê duyệt
 * - Đánh giá chất lượng
 * - Vị trí công việc
 * - Người được giao phê duyệt
 */
export default (sequelize, DataTypes) => {
  const WorkReport = sequelize.define(
    'WorkReport',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      work_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'works',
          key: 'id',
        },
        comment: 'ID công việc',
      },
      reported_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'ID người báo cáo',
      },
      progress_percentage: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
          max: 100,
        },
        comment: 'Phần trăm hoàn thành (0-100)',
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'in_progress',
        comment: 'Trạng thái: in_progress, completed',
      },
      description: {
        type: DataTypes.TEXT,
        comment: 'Mô tả chi tiết công việc đã làm',
      },
      notes: {
        type: DataTypes.TEXT,
        comment: 'Ghi chú thêm',
      },
      photo_urls: {
        type: DataTypes.JSONB,
        comment: 'Danh sách URL ảnh chứng minh (JSON) - deprecated, sử dụng before_images, during_images, after_images',
      },
      location: {
        type: DataTypes.STRING(255),
        comment: 'Vị trí công việc',
      },
      before_images: {
        type: DataTypes.JSONB,
        comment: 'Danh sách URL ảnh trước khi làm (JSON)',
      },
      during_images: {
        type: DataTypes.JSONB,
        comment: 'Danh sách URL ảnh trong quá trình làm (JSON)',
      },
      after_images: {
        type: DataTypes.JSONB,
        comment: 'Danh sách URL ảnh sau khi làm (JSON)',
      },
      assigned_approver: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'ID người được giao phê duyệt',
      },
      materials_used: {
        type: DataTypes.TEXT,
        comment: 'Vật liệu, thiết bị sử dụng',
      },
      issues_encountered: {
        type: DataTypes.TEXT,
        comment: 'Các vấn đề/khó khăn gặp phải',
      },
      solution_applied: {
        type: DataTypes.TEXT,
        comment: 'Giải pháp đã áp dụng',
      },
      time_spent_hours: {
        type: DataTypes.DECIMAL(5, 2),
        comment: 'Giờ công đã dùng',
      },
      next_steps: {
        type: DataTypes.TEXT,
        comment: 'Bước tiếp theo cần làm',
      },
      submitted_by_role: {
        type: DataTypes.STRING(50),
        comment: 'Vai trò người báo cáo',
      },
      approval_status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending',
        comment: 'Trạng thái phê duyệt: pending, approved, rejected',
      },
      approved_by: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'ID người phê duyệt',
      },
      approved_at: {
        type: DataTypes.DATE,
        comment: 'Thời điểm phê duyệt',
      },
      quality_rating: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 5,
        },
        comment: 'Đánh giá chất lượng (1-5 sao)',
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        comment: 'Lý do từ chối báo cáo',
      },
      reported_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Thời điểm báo cáo',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'work_reports',
      timestamps: false,
      indexes: [
        { fields: ['work_id'] },
        { fields: ['reported_by'] },
        { fields: ['approval_status'] },
        { fields: ['reported_at'] },
        { fields: ['quality_rating'] },
        { fields: ['assigned_approver'] },
      ],
    }
  );

  // Định nghĩa các mối quan hệ
  WorkReport.associate = (models) => {
    // Thuộc công việc
    WorkReport.belongsTo(models.Work, {
      foreignKey: 'work_id',
      as: 'work',
    });

    // Người báo cáo
    WorkReport.belongsTo(models.User, {
      foreignKey: 'reported_by',
      as: 'reporter',
    });

    // Người phê duyệt
    WorkReport.belongsTo(models.User, {
      foreignKey: 'approved_by',
      as: 'approver',
    });

    // Người được giao phê duyệt
    WorkReport.belongsTo(models.User, {
      foreignKey: 'assigned_approver',
      as: 'assignedApprover',
    });

    // Một báo cáo có nhiều tập tin đính kèm
    WorkReport.hasMany(models.Attachment, {
      foreignKey: 'report_id',
      as: 'attachments',
    });

    // Một báo cáo có nhiều quy trình phê duyệt
    WorkReport.hasMany(models.ApprovalWorkflow, {
      foreignKey: 'report_id',
      as: 'approvalWorkflows',
    });
  };

  return WorkReport;
};
