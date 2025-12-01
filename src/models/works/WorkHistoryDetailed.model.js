'use strict';

/**
 * Model WorkHistoryDetailed (Lịch sử chi tiết)
 * 
 * Lưu trữ lịch sử thay đổi chi tiết của các entity liên quan đến công việc:
 * - Theo dõi thay đổi của Work, WorkAssignment, và các entity khác
 * - Sử dụng entity_type để phân biệt loại entity
 * - Lưu trữ old_values và new_values dưới dạng JSON
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
      // ID công việc (FK) - có thể null nếu entity không phải work
      work_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'works',
          key: 'id',
        },
        comment: 'ID công việc liên quan (nếu có)',
      },
      // Loại entity thay đổi: work, work_assignment, work_report, etc.
      entity_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Loại entity: work, work_assignment, work_report, check_in, attachment, etc.',
      },
      // ID entity thay đổi
      entity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID của entity thay đổi',
      },
      // Hành động: create, update, delete
      action: {
        type: DataTypes.ENUM('create', 'update', 'delete'),
        allowNull: false,
        comment: 'Hành động: create, update, delete',
      },
      // Trường thay đổi (nếu chỉ một trường)
      field_changed: {
        type: DataTypes.STRING(100),
        comment: 'Tên trường thay đổi (nếu áp dụng)',
      },
      // Người thay đổi (FK)
      changed_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'Người thực hiện thay đổi',
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
        { fields: ['entity_type', 'entity_id'] },
        { fields: ['action'] },
        { fields: ['field_changed'] },
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

    // Có thể thêm associations cho các entity khác nếu cần, nhưng để tránh phức tạp, sử dụng entity_type để query
  };

  return WorkHistoryDetailed;
};
