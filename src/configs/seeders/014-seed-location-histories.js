"use strict";

/**
 * Seeder 014: Seed LocationHistory entries for technicians
 */
export async function up(queryInterface, Sequelize) {
    const now = new Date();
    const histories = [
        {
            id: 1,
            user_id: 2,
            latitude: 21.028700,
            longitude: 105.804900,
            accuracy: 5.0,
            status: "working",
            timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
            device_info: "Android 11 - App v1.2.3",
            created_at: new Date("2025-12-19T08:05:00.000Z"),
        },
        {
            id: 2,
            user_id: 3,
            latitude: 21.030100,
            longitude: 105.800100,
            accuracy: 6.5,
            status: "offline",
            timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
            device_info: "iOS 15 - App v1.2.3",
            created_at: new Date("2025-12-19T07:10:00.000Z"),
        },
    ];

    await queryInterface.bulkInsert("location_histories", histories, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("location_histories", { id: { [Sequelize.Op.in]: [1, 2] } }, {});
}
