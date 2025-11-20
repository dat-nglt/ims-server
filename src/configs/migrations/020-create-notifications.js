'use strict';

/**
 * Migration 020: Tạo bảng Notifications (Thông báo)
 * 
 * Lưu trữ các thông báo cho người dùng
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('notifications', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    message: {
      type: Sequelize.TEXT,
    },
    type: {
      type: Sequelize.STRING(50),
    },
    related_work_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'works',
        key: 'id',
      },
    },
    is_read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    read_at: {
      type: Sequelize.DATE,
    },
    action_url: {
      type: Sequelize.STRING(255),
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('notifications', ['user_id']);
  await queryInterface.addIndex('notifications', ['is_read']);
  await queryInterface.addIndex('notifications', ['type']);
  await queryInterface.addIndex('notifications', ['created_at']);
  await queryInterface.addIndex('notifications', ['user_id', 'is_read']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('notifications');
}
