"use strict";

/**
 * Seeder 000: Seed Users
 *
 * Chèn dữ liệu người dùng mặc định vào bảng users
 */

export async function up(queryInterface, Sequelize) {
    const usersData = [
        {
            id: 1,
            employee_id: "EMP001",
            name: "Nhân viên 1",
            position: "Quản lý",
            avatar_url: null,
            phone: "0397364664",
            email: "dat.nglt@gmail.com",
            password: "0397364664",
            zalo_id: null,
            status: "active",
            manager_id: 1,
            is_active: true,
            approved: "approved",
            last_login: null,
            created_at: new Date("2025-12-06T07:56:29.400Z"),
            updated_at: new Date("2025-12-06T07:56:29.400Z"),
        },
    ];

    const profiles = [
        {
            user_id: 1,
            department: 'Nhân Sự',
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
            created_at: new Date("2025-12-06T07:56:29.400Z"),
            updated_at: new Date("2025-12-06T07:56:29.400Z"),
        },
    ];

    await queryInterface.bulkInsert("users", usersData, {});
    await queryInterface.bulkInsert("employee_profiles", profiles, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("employee_profiles", { user_id: 1 }, {});
    await queryInterface.bulkDelete("users", null, {});
}
