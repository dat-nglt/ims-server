'use strict';

/**
 * Migration 008: Tạo bảng Work History (Lịch sử công việc)
 * 
 * Lưu trữ lịch sử thay đổi trạng thái công việc
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('work_history', {
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
    old_status: {
      type: Sequelize.STRING(50),
    },
    new_status: {
      type: Sequelize.STRING(50),
    },
    changed_by: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    changed_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    notes: {
      type: Sequelize.TEXT,
    },
  });

  await queryInterface.addIndex('work_history', ['work_id']);
  await queryInterface.addIndex('work_history', ['changed_at']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('work_history');
}
