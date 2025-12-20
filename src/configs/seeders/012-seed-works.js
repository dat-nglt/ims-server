"use strict";

/**
 * Seeder 012: Seed Works (công việc)
 */
export async function up(queryInterface, Sequelize) {
    const works = [
        {
            id: 1,
            work_code: "LQD-WORK-001",
            title: "Lắp đặt thiết bị A",
            description: "Lắp đặt thiết bị A tại khách hàng ABC",
            category_id: null,
            project_id: 1,
            assigned_user_id: 1,
            assigned_to_technician_id: 2,
            created_by: 1,
            priority: "high",
            status: "assigned",
            required_date: new Date("2025-12-19T00:00:00.000Z"),
            location: "Khách hàng ABC",
            customer_name: "ABC Co.",
            customer_phone: "0900111222",
            customer_address: "123 Đường A, Quận B",
            location_lat: 21.028511,
            location_lng: 105.804817,
            estimated_hours: 3.5,
            estimated_cost: 150.0,
            created_date: new Date("2025-12-10T09:00:00.000Z"),
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: 2,
            work_code: "LQD-WORK-002",
            title: "Bảo trì thiết bị B",
            description: "Bảo trì định kỳ thiết bị B",
            category_id: null,
            project_id: 1,
            assigned_user_id: 1,
            assigned_to_technician_id: 3,
            created_by: 1,
            priority: "medium",
            status: "completed",
            required_date: new Date("2025-12-18T00:00:00.000Z"),
            location: "Khách hàng XYZ",
            customer_name: "XYZ Ltd.",
            customer_phone: "0900222333",
            customer_address: "456 Đường C, Quận D",
            location_lat: 21.030000,
            location_lng: 105.800000,
            estimated_hours: 8,
            estimated_cost: 300.0,
            created_date: new Date("2025-12-01T09:00:00.000Z"),
            created_at: new Date(),
            updated_at: new Date(),
        },
    ];

    await queryInterface.bulkInsert("works", works, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("works", { id: { [Sequelize.Op.in]: [1, 2] } }, {});
}
