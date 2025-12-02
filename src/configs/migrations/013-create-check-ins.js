'use strict';

/**
 * Migration 012: Tạo bảng Check Ins (Chấm công)
 * 
 * Lưu trữ thông tin check-in/check-out
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('check_ins', {
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
    work_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'works',
        key: 'id',
      },
    },
    check_in_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    check_out_time: {
      type: Sequelize.DATE,
    },
    latitude: {
      type: Sequelize.DECIMAL(10, 8),
      comment: 'Vĩ độ',
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 8),
      comment: 'Kinh độ',
    },
    location_name: {
      type: Sequelize.STRING(255),
    },
    address: {
      type: Sequelize.TEXT,
    },
    photo_url: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.STRING(50),
      defaultValue: 'checked_in',
    },
    distance_from_work: {
      type: Sequelize.DECIMAL(10, 2),
      comment: 'Khoảng cách từ công việc',
    },
    is_within_radius: {
      type: Sequelize.BOOLEAN,
      comment: 'Có trong phạm vi hay không',
    },
    duration_minutes: {
      type: Sequelize.INTEGER,
      comment: 'Thời gian làm việc',
    },
    device_info: {
      type: Sequelize.TEXT,
      comment: 'Thông tin thiết bị',
    },
    ip_address: {
      type: Sequelize.STRING(45),
    },
    notes: {
      type: Sequelize.TEXT,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('check_ins', ['user_id']);
  await queryInterface.addIndex('check_ins', ['work_id']);
  await queryInterface.addIndex('check_ins', ['check_in_time']);
  await queryInterface.addIndex('check_ins', ['is_within_radius']);
  await queryInterface.addIndex('check_ins', ['status']);
  await queryInterface.addIndex('check_ins', ['user_id', 'check_in_time']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('check_ins');
}
