'use strict';

/**
 * Model Attachment (Tập tin đính kèm)
 * 
 * Lưu trữ các tập tin đính kèm cho công việc/báo cáo
 */
export default (sequelize, DataTypes) => {
  const Attachment = sequelize.define(
    'Attachment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // ID công việc (FK)
      work_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'works',
          key: 'id',
        },
        comment: 'Công việc liên quan',
      },
      // ID báo cáo (FK)
      report_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'work_reports',
          key: 'id',
        },
        comment: 'Báo cáo liên quan',
      },
      // Tên tập tin
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Tên tập tin',
      },
      // URL tập tin
      file_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'URL truy cập tập tin',
      },
      // Loại tập tin
      file_type: {
        type: DataTypes.STRING(50),
        comment: 'Loại tập tin: image, document, video...',
      },
      // Dung lượng tập tin
      file_size: {
        type: DataTypes.INTEGER,
        comment: 'Dung lượng tập tin (bytes)',
      },
      // Người upload (FK)
      uploaded_by: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'Người upload tập tin',
      },
      // Thời gian upload
      uploaded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'attachments',
      timestamps: false,
      indexes: [
        { fields: ['work_id'] },
        { fields: ['report_id'] },
        { fields: ['uploaded_by'] },
        { fields: ['uploaded_at'] },
      ],
    }
  );

  Attachment.associate = (models) => {
    Attachment.belongsTo(models.Work, {
      foreignKey: 'work_id',
      as: 'work',
    });

    Attachment.belongsTo(models.WorkReport, {
      foreignKey: 'report_id',
      as: 'report',
    });

    Attachment.belongsTo(models.User, {
      foreignKey: 'uploaded_by',
      as: 'uploader',
    });
  };

  return Attachment;
};
