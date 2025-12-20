"use strict";

/**
 * Seeder 010: Seed CheckInType (attendance types)
 */
export async function up(queryInterface, Sequelize) {
    const types = [
        {
            id: 1,
            code: "regular",
            name: "Chấm công bình thường",
            default_duration_minutes: 480,
            start_time: "08:00:00",
            end_time: "17:00:00",
            description: "Ca làm việc hành chính",
            active: true,
            created_at: new Date("2025-01-01T00:00:00.000Z"),
            updated_at: new Date(),
        },
        {
            id: 2,
            code: "overtime",
            name: "Làm thêm",
            default_duration_minutes: 120,
            description: "Làm thêm giờ",
            active: true,
            created_at: new Date("2025-01-01T00:00:00.000Z"),
            updated_at: new Date(),
        },
        {
            id: 3,
            code: "sick_leave",
            name: "Nghỉ ốm",
            default_duration_minutes: null,
            description: "Nghỉ phép/ốm",
            active: true,
            created_at: new Date("2025-01-01T00:00:00.000Z"),
            updated_at: new Date(),
        },
    ];

    await queryInterface.bulkInsert("attendance_type", types, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("attendance_type", { id: { [Sequelize.Op.in]: [1, 2, 3] } }, {});
}
