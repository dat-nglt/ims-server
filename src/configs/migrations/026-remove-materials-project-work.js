'use strict';

/**
 * Migration 026: Remove project_id and work_id from materials (if present)
 */

export async function up(queryInterface, Sequelize) {
  // remove indexes if they exist
  try {
    await queryInterface.removeIndex('materials', ['project_id']);
  } catch (e) {
    // ignore
  }
  try {
    await queryInterface.removeIndex('materials', ['work_id']);
  } catch (e) {
    // ignore
  }

  // remove columns if they exist
  try {
    await queryInterface.removeColumn('materials', 'project_id');
  } catch (e) {
    // ignore
  }
  try {
    await queryInterface.removeColumn('materials', 'work_id');
  } catch (e) {
    // ignore
  }
}

export async function down(queryInterface, Sequelize) {
  // re-add columns and indexes
  await queryInterface.addColumn('materials', 'project_id', {
    type: Sequelize.INTEGER,
    references: { model: 'projects', key: 'id' },
    comment: 'ID dự án liên quan (nếu có)'
  });

  await queryInterface.addColumn('materials', 'work_id', {
    type: Sequelize.INTEGER,
    references: { model: 'works', key: 'id' },
    comment: 'ID công việc liên quan (nếu có)'
  });

  await queryInterface.addIndex('materials', ['project_id']);
  await queryInterface.addIndex('materials', ['work_id']);
}