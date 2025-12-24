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
            position_id: null,
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

    await queryInterface.bulkInsert("users", usersData, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
}
