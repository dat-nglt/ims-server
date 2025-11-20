'use strict';

/**
 * Model ApprovalWorkflow (Quy trình phê duyệt)
 * 
 * Lưu trữ quy trình phê duyệt báo cáo
 */
export default (sequelize, DataTypes) => {
  const ApprovalWorkflow = sequelize.define(
    'ApprovalWorkflow',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // ID công việc
      work_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'works',
          key: 'id',
        },
      },
      // ID báo cáo
      report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'work_reports',
          key: 'id',
        },
      },
      // ID người phê duyệt hiện tại
      current_approver_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      // Bước phê duyệt
      approval_step: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      // Trạng thái bước hiện tại
      current_step_status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending',
      },
      // Bình luận phê duyệt
      comments: {
        type: DataTypes.TEXT,
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
      tableName: 'approval_workflow',
      timestamps: false,
      indexes: [
        { fields: ['work_id'] },
        { fields: ['report_id'] },
        { fields: ['approval_step'] },
        { fields: ['current_step_status'] },
      ],
    }
  );

  ApprovalWorkflow.associate = (models) => {
    ApprovalWorkflow.belongsTo(models.Work, {
      foreignKey: 'work_id',
      as: 'work',
    });

    ApprovalWorkflow.belongsTo(models.WorkReport, {
      foreignKey: 'report_id',
      as: 'report',
    });

    ApprovalWorkflow.belongsTo(models.User, {
      foreignKey: 'current_approver_id',
      as: 'currentApprover',
    });
  };

  return ApprovalWorkflow;
};
