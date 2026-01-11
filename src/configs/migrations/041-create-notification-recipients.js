'use strict';

/**
 * Migration: Tạo bảng notification_recipients
 * Bảng này lưu trạng thái nhận/đọc cho từng user của mỗi notification
 */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('notification_recipients', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    notification_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'notifications', key: 'id' },
      onDelete: 'CASCADE',
      comment: 'FK tới notifications.id',
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      comment: 'Người nhận thông báo',
    },
    is_read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: 'Đã đọc hay chưa cho từng user',
    },
    read_at: {
      type: Sequelize.DATE,
      comment: 'Thời điểm user đọc thông báo (nếu có) ',
    },
    delivered_at: {
      type: Sequelize.DATE,
      comment: 'Thời điểm thông báo được đánh dấu đã gửi/giao tới user',
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  // Indexes
  await queryInterface.addIndex('notification_recipients', ['notification_id']);
  await queryInterface.addIndex('notification_recipients', ['user_id']);
  await queryInterface.addIndex('notification_recipients', ['user_id', 'is_read']);
  // Unique constraint to avoid duplicate recipient rows for same notification+user
  await queryInterface.addIndex('notification_recipients', ['notification_id', 'user_id'], { unique: true, name: 'uniq_notification_recipient' });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex('notification_recipients', ['notification_id', 'user_id']);
  await queryInterface.removeIndex('notification_recipients', ['user_id', 'is_read']);
  await queryInterface.removeIndex('notification_recipients', ['user_id']);
  await queryInterface.removeIndex('notification_recipients', ['notification_id']);
  await queryInterface.dropTable('notification_recipients');
}