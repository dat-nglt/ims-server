'use strict';

/**
 * Migration 009: Tạo bảng Work History Detailed (Lịch sử chi tiết)
 *
 * Lưu trữ lịch sử thay đổi chi tiết của các entity liên quan đến công việc:
 * - Theo dõi thay đổi của Work, WorkAssignment, và các entity khác
 * - Sử dụng entity_type để phân biệt loại entity
 * - Lưu trữ old_values và new_values dưới dạng JSON
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('work_history_detailed', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    work_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'works',
        key: 'id',
      },
      comment: 'ID công việc liên quan (nếu có)',
    },
    entity_type: {
      type: Sequelize.STRING(50),
      allowNull: false,
      comment: 'Loại entity: work, work_assignment, work_report, check_in, attachment, etc.',
    },
    entity_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: 'ID của entity thay đổi',
    },
    action: {
      type: Sequelize.ENUM('create', 'update', 'delete'),
      allowNull: false,
      comment: 'Hành động: create, update, delete',
    },
    field_changed: {
      type: Sequelize.STRING(100),
      comment: 'Tên trường thay đổi (nếu áp dụng)',
    },
    changed_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Người thực hiện thay đổi',
    },
    old_values: {
      type: Sequelize.JSONB,
      comment: 'Giá trị trước thay đổi',
    },
    new_values: {
      type: Sequelize.JSONB,
      comment: 'Giá trị sau thay đổi',
    },
    ip_address: {
      type: Sequelize.STRING(45),
    },
    user_agent: {
      type: Sequelize.TEXT,
    },
    changed_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('work_history_detailed', ['work_id']);
  await queryInterface.addIndex('work_history_detailed', ['entity_type', 'entity_id']);
  await queryInterface.addIndex('work_history_detailed', ['action']);
  await queryInterface.addIndex('work_history_detailed', ['field_changed']);
  await queryInterface.addIndex('work_history_detailed', ['changed_at']);
  await queryInterface.addIndex('work_history_detailed', ['changed_by']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('work_history_detailed');
}
