'use strict';

/**
 * Migration 009: Tạo bảng Work History Detailed (Lịch sử chi tiết)
 * 
 * Lưu trữ lịch sử thay đổi chi tiết của các entity
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
    },
    entity_type: {
      type: Sequelize.STRING(50),
    },
    entity_id: {
      type: Sequelize.INTEGER,
    },
    action: {
      type: Sequelize.STRING(50),
    },
    changed_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    old_values: {
      type: Sequelize.JSONB,
    },
    new_values: {
      type: Sequelize.JSONB,
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
  await queryInterface.addIndex('work_history_detailed', ['entity_type']);
  await queryInterface.addIndex('work_history_detailed', ['changed_at']);
  await queryInterface.addIndex('work_history_detailed', ['changed_by']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('work_history_detailed');
}
