'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Chèn 4 người dùng demo
    await queryInterface.bulkInsert('users', [
      {
        employee_id: 'ADMIN001',
        name: 'Nguyễn Văn Admin',
        position: 'Quản Trị Viên',
        email: 'admin@videcoder.io.vn',
        phone: '0977708801',
        role_id: 1,
        department: 'IT',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 'MGR001',
        name: 'Trần Văn Manager',
        position: 'Quản Lý',
        email: 'manager@videcoder.io.vn',
        phone: '0977708802',
        role_id: 2,
        department: 'Operations',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 'SALE001',
        name: 'Lê Thị Sales',
        position: 'Nhân Viên Kinh Doanh',
        email: 'sales@videcoder.io.vn',
        phone: '0977708803',
        role_id: 3,
        department: 'Sales',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 'TECH001',
        name: 'Phạm Văn Technician',
        position: 'Kỹ Thuật Viên',
        email: 'tech@videcoder.io.vn',
        phone: '0977708804',
        role_id: 4,
        department: 'Technical',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      employee_id: ['ADMIN001', 'MGR001', 'SALE001', 'TECH001']
    }, {});
  }
};
