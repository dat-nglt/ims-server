'use strict';

/**
 * Model WorkHistoryDetailed (Lịch sử chi tiết)
 * 
 * Lưu trữ lịch sử thay đổi chi tiết của các entity
 */
export default (sequelize, DataTypes) => {
  const WorkHistoryDetailed = sequelize.define(
    'WorkHistoryDetailed',
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
      },
      // Loại entity thay đổi
      entity_type: {
        type: DataTypes.STRING(50),
        comment: 'work, report, assignment...',
      },
      // ID entity thay đổi
      entity_id: {
        type: DataTypes.INTEGER,
      },
      // Hành động: create, update, delete
      action: {
        type: DataTypes.STRING(50),
      },
      // Người thay đổi (FK)
      changed_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      // Giá trị cũ (JSON)
      old_values: {
        type: DataTypes.JSONB,
        comment: 'Giá trị trước thay đổi',
      },
      // Giá trị mới (JSON)
      new_values: {
        type: DataTypes.JSONB,
        comment: 'Giá trị sau thay đổi',
      },
      // IP address
      ip_address: {
        type: DataTypes.STRING(45),
      },
      // User agent
      user_agent: {
        type: DataTypes.TEXT,
      },
      // Thời gian thay đổi
      changed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'work_history_detailed',
      timestamps: false,
      indexes: [
        { fields: ['work_id'] },
        { fields: ['entity_type'] },
        { fields: ['changed_at'] },
        { fields: ['changed_by'] },
      ],
    }
  );

  WorkHistoryDetailed.associate = (models) => {
    WorkHistoryDetailed.belongsTo(models.Work, {
      foreignKey: 'work_id',
      as: 'work',
    });

    WorkHistoryDetailed.belongsTo(models.User, {
      foreignKey: 'changed_by',
      as: 'changedByUser',
    });
  };

  return WorkHistoryDetailed;
};
