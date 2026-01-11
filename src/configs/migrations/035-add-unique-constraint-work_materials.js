'use strict';

/**
 * Migration 028: Add UNIQUE constraint on (work_code, material_id) in work_materials
 * Only adds the constraint if there are no duplicates; otherwise it fails with an actionable message.
 */

export async function up(queryInterface, Sequelize) {
  // Check duplicates
  const [results] = await queryInterface.sequelize.query(
    `SELECT work_code, material_id, count(*) cnt FROM work_materials GROUP BY work_code, material_id HAVING count(*) > 1`
  );

  if (results.length > 0) {
    throw new Error('Cannot add UNIQUE constraint on (work_code, material_id) in work_materials: duplicates exist. Please merge duplicates first. Example rows: ' + JSON.stringify(results.slice(0,5)) );
  }

  await queryInterface.addConstraint('work_materials', {
    type: 'unique',
    fields: ['work_code', 'material_id'],
    name: 'uq_work_materials_work_material'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeConstraint('work_materials', 'uq_work_materials_work_material');
}