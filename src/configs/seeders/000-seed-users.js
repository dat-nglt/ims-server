"use strict";

/**
 * Seeder 000: Seed Users (merged)
 *
 * Seeds 6 users into the `users` table.
 * All users have valid Zalo IDs for integration.
 */

export async function up(queryInterface, Sequelize) {
  const usersData = [
    {
      employee_id: "3708075640650630601",
      name: "Nguyễn Lê Tấn Đạt",
      position_id: null,
      avatar_url: "https://res.cloudinary.com/djiwsnmtq/image/upload/v1768035267/defaultUser_fldfhz.jpg",
      phone: "0397364664",
      email: "dat.nglt@gmail.com",
      password: "0397364664",
      zalo_id: "3708075640650630601",
      status: "active",
      manager_id: 1,
      is_active: true,
      approved: "approved",
      last_login: null,
      created_at: new Date("2025-12-06T07:56:29.400Z"),
      updated_at: new Date("2025-12-06T07:56:29.400Z"),
    },
    {
      employee_id: "261222303913664540",
      name: "Nguyễn Thị Kim Yến",
      position_id: null,
      avatar_url: "https://res.cloudinary.com/djiwsnmtq/image/upload/v1768035267/defaultUser_fldfhz.jpg",
      phone: "0356921766",
      email: "tech2@example.com",
      password: "0356921766",
      zalo_id: "261222303913664540",
      status: "active",
      manager_id: 1,
      is_active: true,
      approved: "approved",
      last_login: null,
      created_at: new Date("2025-12-10T08:00:00.000Z"),
      updated_at: new Date("2025-12-10T08:00:00.000Z"),
    },
    {
      employee_id: "1946843861876661432",
      name: "Nguyễn Trần Giáng Ngọc",
      position_id: null,
      avatar_url: "https://res.cloudinary.com/djiwsnmtq/image/upload/v1768035267/defaultUser_fldfhz.jpg",
      phone: "0942694659",
      email: "tech3@example.com",
      password: "0942694659",
      zalo_id: "1946843861876661432",
      status: "active",
      manager_id: 1,
      is_active: true,
      approved: "approved",
      last_login: null,
      created_at: new Date("2025-12-10T09:00:00.000Z"),
      updated_at: new Date("2025-12-10T09:00:00.000Z"),
    },
    {
      employee_id: "2974693491332260596",
      name: "Võ Xuân Vũ",
      position_id: null,
      avatar_url: "https://res.cloudinary.com/djiwsnmtq/image/upload/v1768035267/defaultUser_fldfhz.jpg",
      phone: "0349315350",
      email: "tech4@example.com",
      password: "0349315350",
      zalo_id: "2974693491332260596",
      status: "active",
      manager_id: 1,
      is_active: true,
      approved: "approved",
      last_login: null,
      created_at: new Date("2025-12-10T09:00:00.000Z"),
      updated_at: new Date("2025-12-10T09:00:00.000Z"),
    },
    {
      employee_id: "1708134241754341384",
      name: "Mai Trí Thông",
      position_id: null,
      avatar_url: "https://res.cloudinary.com/djiwsnmtq/image/upload/v1768035267/defaultUser_fldfhz.jpg",
      phone: "0587325311",
      email: "tech5@example.com",
      password: "0587325311",
      zalo_id: "1708134241754341384",
      status: "active",
      manager_id: 1,
      is_active: true,
      approved: "approved",
      last_login: null,
      created_at: new Date("2025-12-11T08:00:00.000Z"),
      updated_at: new Date("2025-12-11T08:00:00.000Z"),
    },
    {
      employee_id: "6327234395950930546",
      name: "Nguyễn Duy Xen",
      position_id: null,
      avatar_url: "https://res.cloudinary.com/djiwsnmtq/image/upload/v1768035267/defaultUser_fldfhz.jpg",
      phone: "0797000333",
      email: "staff6@example.com",
      password: "0797000333",
      zalo_id: "6327234395950930546",
      status: "active",
      manager_id: 1,
      is_active: true,
      approved: "approved",
      last_login: null,
      created_at: new Date("2025-12-12T08:00:00.000Z"),
      updated_at: new Date("2025-12-12T08:00:00.000Z"),
    },
  ];

  await queryInterface.bulkInsert("users", usersData, {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("users", { id: { [Sequelize.Op.in]: [1, 2, 3, 4, 5, 6] } }, {});
}
