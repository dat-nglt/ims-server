'use strict';

/**
 * Migration 011: Tạo bảng Employee Profiles (Hồ sơ nhân viên)
 * 
 * Lưu trữ thông tin chi tiết về nhân viên
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('employee_profiles', {
    id: {
      type: Sequelize.STRING(255),
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Người dùng',
    },
    department: {
      type: Sequelize.STRING(100),
      comment: 'Phòng ban',
    },
    specialization: {
      type: Sequelize.JSONB,
      comment: 'Danh sách chuyên môn (JSON)',
    },
    certification: {
      type: Sequelize.JSONB,
      comment: 'Danh sách chứng chỉ (JSON)',
    },
    phone_secondary: {
      type: Sequelize.STRING(20),
      comment: 'Số điện thoại liên lạc thứ 2',
    },
    address: {
      type: Sequelize.TEXT,
      comment: 'Địa chỉ cư trú',
    },
    date_of_birth: {
      type: Sequelize.DATE,
      comment: 'Ngày sinh',
    },
    gender: {
      type: Sequelize.STRING(10),
      comment: 'Giới tính: M/F',
    },
    id_number: {
      type: Sequelize.STRING(50),
      comment: 'Số chứng minh thư/CCCD',
    },
    hire_date: {
      type: Sequelize.DATE,
      comment: 'Ngày bắt đầu làm việc',
    },
    total_experience_years: {
      type: Sequelize.INTEGER,
      comment: 'Tổng năm kinh nghiệm',
    },
    performance_rating: {
      type: Sequelize.DECIMAL(3, 2),
      comment: 'Đánh giá hiệu suất (1-5)',
    },
    dailySalary: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 500000.00,
      comment: 'Lương theo ngày (VND)',
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      comment: 'Hồ sơ có hoạt động hay không',
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('employee_profiles', ['user_id']);
  await queryInterface.addIndex('employee_profiles', ['is_active']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('employee_profiles');
}
