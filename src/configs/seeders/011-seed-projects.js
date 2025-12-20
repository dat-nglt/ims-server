"use strict";

/**
 * Seeder 011: Seed Projects
 */
export async function up(queryInterface, Sequelize) {
    const projects = [
        {
            id: 1,
            name: "Dự án Thử nghiệm",
            description: "Dự án demo để kiểm thử chức năng chấm công và theo dõi",
            status: "active",
            priority: "medium",
            progress: 10,
            start_date: new Date("2025-11-01T00:00:00.000Z"),
            end_date: new Date("2026-01-01T00:00:00.000Z"),
            manager_id: 1,
            budget: 10000000.0,
            created_by: 1,
            created_at: new Date("2025-11-01T00:00:00.000Z"),
            updated_at: new Date(),
        },
    ];

    await queryInterface.bulkInsert("projects", projects, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("projects", { id: { [Sequelize.Op.in]: [1] } }, {});
}
