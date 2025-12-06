"use strict";

/**
 * Seeder 002: Seed Roles
 *
 * Chèn dữ liệu vai trò mặc định vào bảng roles
 */

export async function up(queryInterface, Sequelize) {
    const rolesData = [
        {
            id: 1,
            name: "Quản trị viên",
            description: "Vai trò quản trị viên với quyền cao nhất",
            level: 1,
            is_deleted: false,
            created_by: 1,
            updated_by: 1,
            created_at: new Date("2025-12-06T07:58:29.579Z"),
            updated_at: new Date("2025-12-06T07:58:29.579Z"),
        },
        {
            id: 2,
            name: "Quản lý",
            description: "Quản lý nhân sự và báo cáo",
            level: 2,
            is_deleted: false,
            created_by: 1,
            updated_by: 1,
            created_at: new Date("2025-12-06T08:09:24.652Z"),
            updated_at: new Date("2025-12-06T08:09:24.652Z"),
        },
        {
            id: 3,
            name: "Nhân viên kinh doanh",
            description: "Truy cập cơ bản cho nhân viên kinh doanh",
            level: 3,
            is_deleted: false,
            created_by: 1,
            updated_by: 1,
            created_at: new Date("2025-12-06T08:09:41.180Z"),
            updated_at: new Date("2025-12-06T08:09:41.180Z"),
        },
        {
            id: 4,
            name: "Kỹ thuật viên",
            description: "Xem báo cáo kỹ thuật",
            level: 4,
            is_deleted: false,
            created_by: 1,
            updated_by: 1,
            created_at: new Date("2025-12-06T08:10:06.103Z"),
            updated_at: new Date("2025-12-06T08:10:06.103Z"),
        },
    ];

    await queryInterface.bulkInsert("roles", rolesData, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
}