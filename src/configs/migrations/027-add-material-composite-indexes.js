'use strict';

/**
 * Migration 027: Add composite indexes to material_usages and work_materials
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addIndex('material_usages', ['material_id', 'work_code'], {
    name: 'idx_material_usages_material_work'
  });

  await queryInterface.addIndex('work_materials', ['work_code', 'material_id'], {
    name: 'idx_work_materials_work_material'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex('material_usages', 'idx_material_usages_material_work');
  await queryInterface.removeIndex('work_materials', 'idx_work_materials_work_material');
}