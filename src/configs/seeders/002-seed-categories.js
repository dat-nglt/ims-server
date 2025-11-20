'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('work_categories', [
      {
        name: 'Điện - Nước',
        description: 'Sửa chữa hệ thống điện và nước',
        icon: 'zap',
        color: '#FF6B6B',
        is_active: true,
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Điều hòa',
        description: 'Bảo trì và sửa chữa điều hòa không khí',
        icon: 'wind',
        color: '#4ECDC4',
        is_active: true,
        display_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'An ninh',
        description: 'Cài đặt và bảo trì hệ thống an ninh',
        icon: 'shield',
        color: '#45B7D1',
        is_active: true,
        display_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Camera',
        description: 'Lắp đặt và bảo trì camera giám sát',
        icon: 'video',
        color: '#96CEB4',
        is_active: true,
        display_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('work_categories', {
      name: ['Điện - Nước', 'Điều hòa', 'An ninh', 'Camera']
    }, {});
  }
};
