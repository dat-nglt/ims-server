'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Chèn các vai trò cơ bản
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        description: 'Quản trị viên hệ thống',
        level: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'manager',
        description: 'Quản lý',
        level: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'sales',
        description: 'Nhân viên kinh doanh',
        level: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'technician',
        description: 'Kỹ thuật viên',
        level: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};