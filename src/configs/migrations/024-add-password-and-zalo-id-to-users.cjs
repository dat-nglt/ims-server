'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Mật khẩu đã hash',
    });

    await queryInterface.addColumn('users', 'zalo_id', {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true,
      comment: 'Zalo ID của người dùng',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'password');
    await queryInterface.removeColumn('users', 'zalo_id');
  }
};