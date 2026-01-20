"use strict";

/**
 * Seeder: Seed Attendance Locations (Địa điểm điểm danh)
 *
 * Tạo danh sách các địa điểm chấm công:
 * 1. Văn phòng Proshop - Daikin
 * 2. Kho Vật Tư LQD - Quận 12
 */

export async function up(queryInterface, Sequelize) {
    const locations = [
        {
            id: -1,
            location_code: "office",
            name: "Văn phòng Proshop - Daikin",
            type: "office",
            address: "89 Lê Thị Riêng, Phường Thới An, Quận 12, TP.HCM",
            latitude: 10.8622252275756,
            longitude: 106.65495297953983,
            radius: 150,
            icon: "zi-home",
            is_active: true,
            notes: "Văn phòng chính của Proshop - Daikin",
            created_at: new Date("2025-01-01T00:00:00.000Z"),
            updated_at: new Date("2025-01-01T00:00:00.000Z"),
        },
        {
            id: -2,
            location_code: "warehouse",
            name: "Kho Vật Tư LQD - Quận 12",
            type: "warehouse",
            address: "189a Đ. TX 25, Thạnh Xuân, Quận 12, TP.HCM",
            latitude: 10.87963635,
            longitude: 106.66332006,
            radius: 150,
            icon: "zi-home",
            is_active: true,
            notes: "Kho vật tư chính của công ty LQD",
            created_at: new Date("2025-01-01T00:00:00.000Z"),
            updated_at: new Date("2025-01-01T00:00:00.000Z"),
        },
    ];

    await queryInterface.bulkInsert("attendance_locations", locations, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
        "attendance_locations",
        { location_code: { [Sequelize.Op.in]: ["warehouse", "warehouse2"] } },
        {},
    );
}
