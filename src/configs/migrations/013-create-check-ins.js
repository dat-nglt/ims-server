'use strict';

/**
 * Migration 013: Tạo bảng Check Ins (Chấm công)
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
    // Thêm project_id: để hỗ trợ lọc theo dự án, optional
    project_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'projects',
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
    // Cập nhật status thành ENUM để hỗ trợ 'on_leave'
    status: {
      type: Sequelize.ENUM('checked_in', 'checked_out', 'on_leave'),
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
    // Thêm check_in_type: loại chấm công
    check_in_type: {
      type: Sequelize.STRING(50),
    },
    // Thêm violation_distance: khoảng cách vi phạm
    violation_distance: {
      type: Sequelize.DECIMAL(10, 2),
      comment: 'Khoảng cách vi phạm vị trí',
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
  await queryInterface.addIndex('check_ins', ['user_id', 'check_in_time']); // Composite index cho truy vấn theo user và thời gian
  // Thêm indexes mới
  await queryInterface.addIndex('check_ins', ['project_id']);
  await queryInterface.addIndex('check_ins', ['check_in_type']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('check_ins');
}
