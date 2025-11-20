'use strict';

/**
 * Migration 003: Tạo bảng Users (Người dùng)
 * 
 * Bảng này lưu trữ thông tin tất cả người dùng trong hệ thống
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: Sequelize.STRING(50),
      unique: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    position: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    avatar_url: {
      type: Sequelize.TEXT,
    },
    phone: {
      type: Sequelize.STRING(20),
    },
    email: {
      type: Sequelize.STRING(255),
      unique: true,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING(50),
      defaultValue: 'active',
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    department: {
      type: Sequelize.STRING(100),
    },
    manager_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    last_login: {
      type: Sequelize.DATE,
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

  await queryInterface.addIndex('users', ['employee_id']);
  await queryInterface.addIndex('users', ['email']);
  await queryInterface.addIndex('users', ['role_id']);
  await queryInterface.addIndex('users', ['department']);
  await queryInterface.addIndex('users', ['is_active']);
  await queryInterface.addIndex('users', ['manager_id']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('users');
}
