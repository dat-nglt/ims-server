'use strict';

/**
 * Migration 015: Tạo bảng User Role Permissions (Quyền hạn người dùng)
 * 
 * Lưu trữ quyền hạn chi tiết của người dùng
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('user_roles_permissions', {
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
    permission_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'id',
      },
    },
    is_granted: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    granted_by: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    granted_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('user_roles_permissions', ['user_id']);
  await queryInterface.addIndex('user_roles_permissions', ['permission_id']);
  await queryInterface.addConstraint('user_roles_permissions', {
    fields: ['user_id', 'permission_id'],
    type: 'unique',
    name: 'unique_user_permission',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('user_roles_permissions');
}
