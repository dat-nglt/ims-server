'use strict';

/**
 * Migration 011: Tạo bảng Employee Profiles (Hồ sơ nhân viên)
 * 
 * Lưu trữ thông tin chi tiết về nhân viên
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('employee_profiles', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    department: {
      type: Sequelize.STRING(100),
    },
    specialization: {
      type: Sequelize.JSONB,
    },
    certification: {
      type: Sequelize.JSONB,
    },
    phone_secondary: {
      type: Sequelize.STRING(20),
    },
    address: {
      type: Sequelize.TEXT,
    },
    date_of_birth: {
      type: Sequelize.DATE,
    },
    gender: {
      type: Sequelize.STRING(10),
    },
    id_number: {
      type: Sequelize.STRING(50),
    },
    hire_date: {
      type: Sequelize.DATE,
    },
    total_experience_years: {
      type: Sequelize.INTEGER,
    },
    performance_rating: {
      type: Sequelize.DECIMAL(3, 2),
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
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('employee_profiles');
}
