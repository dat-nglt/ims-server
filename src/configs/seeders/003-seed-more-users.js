"use strict";

/**
 * Seeder 003: Seed additional users (technicians)
 */
export async function up(queryInterface, Sequelize) {
    const users = [
        {
            id: 2,
            employee_id: "EMP002",
            name: "Kỹ thuật viên 2",
            position: "Kỹ thuật viên",
            avatar_url: null,
            phone: "0987654321",
            email: "tech2@example.com",
            password: "0987654321",
            zalo_id: null,
            status: "active",
            manager_id: 1,
            is_active: true,
            approved: "approved",
            last_login: null,
            created_at: new Date("2025-12-10T08:00:00.000Z"),
            updated_at: new Date("2025-12-10T08:00:00.000Z"),
        },
        {
            id: 3,
            employee_id: "EMP003",
            name: "Kỹ thuật viên 3",
            position: "Kỹ thuật viên",
            avatar_url: null,
            phone: "0987000111",
            email: "tech3@example.com",
            password: "0987000111",
            zalo_id: null,
            status: "active",
            manager_id: 1,
            is_active: true,
            approved: "approved",
            last_login: null,
            created_at: new Date("2025-12-10T09:00:00.000Z"),
            updated_at: new Date("2025-12-10T09:00:00.000Z"),
        },
    ];

    const profiles = [
        {
            user_id: 2,
            department: 'Kỹ thuật',
            specialization: JSON.stringify([]),
            certification: JSON.stringify([]),
            phone_secondary: null,
            address: null,
            date_of_birth: null,
            gender: null,
            id_number: null,
            hire_date: null,
            contract_date: null,
            bank_account_number: null,
            bank_name: 'ACB',
            total_experience_years: null,
            performance_rating: null,
            daily_salary: 500000.00,
            is_active: true,
            created_at: new Date("2025-12-10T08:00:00.000Z"),
            updated_at: new Date("2025-12-10T08:00:00.000Z"),
        },
        {
            user_id: 3,
            department: 'Kỹ thuật',
            specialization: JSON.stringify([]),
            certification: JSON.stringify([]),
            phone_secondary: null,
            address: null,
            date_of_birth: null,
            gender: null,
            id_number: null,
            hire_date: null,
            contract_date: null,
            bank_account_number: null,
            bank_name: 'ACB',
            total_experience_years: null,
            performance_rating: null,
            daily_salary: 500000.00,
            is_active: true,
            created_at: new Date("2025-12-10T09:00:00.000Z"),
            updated_at: new Date("2025-12-10T09:00:00.000Z"),
        },
    ];

    await queryInterface.bulkInsert("users", users, {});
    await queryInterface.bulkInsert("employee_profiles", profiles, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("employee_profiles", { user_id: { [Sequelize.Op.in]: [2, 3] } }, {});
    await queryInterface.bulkDelete(
        "users",
        { id: { [Sequelize.Op.in]: [2, 3] } },
        {}
    );
}
