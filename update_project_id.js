import db from './models/index.js';

async function updateProjectId() {
  try {
    await db.sequelize.query(`
      UPDATE work_reports
      SET project_id = works.project_id
      FROM works
      WHERE work_reports.work_id = works.id
      AND work_reports.project_id IS NULL
    `);
    console.log('Updated project_id for existing work_reports');
  } catch (error) {
    console.error('Error updating project_id:', error);
  } finally {
    await db.sequelize.close();
  }
}

updateProjectId();