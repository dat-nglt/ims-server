'use strict';

import bcrypt from 'bcryptjs';

export default {
  async up(queryInterface, Sequelize) {
    // Hash password cho các user
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Chèn 4 người dùng demo
    await queryInterface.bulkInsert('users', [
      {
        employee_id: 'ADMIN001',
        name: 'Nguyễn Văn Admin',
        position: 'Quản Trị Viên',
        email: 'admin@videcoder.io.vn',
        phone: '0977708801',
        password: hashedPassword,
        department: 'IT',
        status: 'active',
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
        password: hashedPassword,
        department: 'Operations',
        status: 'active',
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
        password: hashedPassword,
        department: 'Sales',
        status: 'active',
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
        password: hashedPassword,
        department: 'Technical',
        status: 'active',
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
