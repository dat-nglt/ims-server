'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('system_config', [
      {
        config_key: 'check_in_radius_meters',
        config_value: '100',
        config_type: 'number',
        description: 'Bán kính cho phép chấm công (meters)',
        updated_at: new Date()
      },
      {
        config_key: 'work_approval_required',
        config_value: 'true',
        config_type: 'boolean',
        description: 'Công việc cần phê duyệt',
        updated_at: new Date()
      },
      {
        config_key: 'payment_tracking_enabled',
        config_value: 'true',
        config_type: 'boolean',
        description: 'Bật theo dõi thanh toán',
        updated_at: new Date()
      },
      {
        config_key: 'default_quality_rating',
        config_value: '5',
        config_type: 'number',
        description: 'Đánh giá chất lượng mặc định',
        updated_at: new Date()
      },
      {
        config_key: 'report_auto_approve',
        config_value: 'false',
        config_type: 'boolean',
        description: 'Tự động phê duyệt báo cáo',
        updated_at: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('system_config', {
      config_key: [
        'check_in_radius_meters',
        'work_approval_required',
        'payment_tracking_enabled',
        'default_quality_rating',
        'report_auto_approve'
      ]
    }, {});
  }
};
