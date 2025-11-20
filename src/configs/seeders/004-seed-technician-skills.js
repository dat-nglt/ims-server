'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Lấy tất cả technician
    const technicians = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role = 'technician'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const skills = [
      'Điện - Nước',
      'Điều hòa',
      'An ninh',
      'Camera giám sát'
    ];

    const skillsData = [];
    technicians.forEach(technician => {
      skills.forEach(skill => {
        skillsData.push({
          technician_id: technician.id,
          skill_name: skill,
          proficiency_level: 'intermediate',
          years_experience: 3,
          is_verified: false,
          created_at: new Date()
        });
      });
    });

    if (skillsData.length > 0) {
      await queryInterface.bulkInsert('technician_skills', skillsData, { ignoreDuplicates: true });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('technician_skills', {
      skill_name: [
        'Điện - Nước',
        'Điều hòa',
        'An ninh',
        'Camera giám sát'
      ]
    }, {});
  }
};
