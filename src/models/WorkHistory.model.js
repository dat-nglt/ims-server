'use strict';

/**
 * Model WorkHistory (Lịch sử công việc)
 * 
 * Lưu trữ lịch sử thay đổi trạng thái công việc
 */
export default (sequelize, DataTypes) => {
  const WorkHistory = sequelize.define(
    'WorkHistory',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // ID công việc (FK)
      work_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'works',
          key: 'id',
        },
        comment: 'Công việc',
      },
      // Trạng thái cũ
      old_status: {
        type: DataTypes.STRING(50),
        comment: 'Trạng thái trước đó',
      },
      // Trạng thái mới
      new_status: {
        type: DataTypes.STRING(50),
        comment: 'Trạng thái mới',
      },
      // Người thay đổi (FK)
      changed_by: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'Người thay đổi trạng thái',
      },
      // Thời gian thay đổi
      changed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      // Ghi chú
      notes: {
        type: DataTypes.TEXT,
        comment: 'Ghi chú về thay đổi',
      },
    },
    {
      tableName: 'work_history',
      timestamps: false,
      indexes: [
        { fields: ['work_id'] },
        { fields: ['changed_at'] },
      ],
    }
  );

  WorkHistory.associate = (models) => {
    WorkHistory.belongsTo(models.Work, {
      foreignKey: 'work_id',
      as: 'work',
    });

    WorkHistory.belongsTo(models.User, {
      foreignKey: 'changed_by',
      as: 'changedByUser',
    });
  };

  return WorkHistory;
};
