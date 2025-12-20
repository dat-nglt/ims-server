"use strict";

/**
 * Seeder 013: Seed Office Locations
 */
export async function up(queryInterface, Sequelize) {
    const offices = [
        {
            id: 1,
            name: "Văn phòng chính",
            type: "office",
            address: "Tầng 5, Tòa nhà Z, Hà Nội",
            phone: "+84 24 1234 5678",
            working_hours: "08:00-17:00",
            latitude: 21.028511,
            longitude: 105.804817,
            radius: 150,
            is_active: true,
            created_at: new Date("2025-01-01T00:00:00.000Z"),
        },
    ];

    await queryInterface.bulkInsert("office_locations", offices, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("office_locations", { id: { [Sequelize.Op.in]: [1] } }, {});
}
