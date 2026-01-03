"use strict";

/**
 * Seeder 010: Seed CheckInType (attendance types)
 */
export async function up(queryInterface, Sequelize) {
  const types = [
    {
      id: 1,
      code: "day_shift",
      name: "Chấm Công Ca Ngày",
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
      code: "night_shift",
      name: "Chấm Công Ca Đêm",
      default_duration_minutes: 480,
      start_time: "22:00:00",
      end_time: "06:00:00",
      description: "Ca làm việc ban đêm",
      active: true,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date(),
    },
    {
      id: 3,
      code: "overtime_lunch",
      name: "Tăng Ca Trưa",
      start_time: "11:30:00",
      end_time: "13:00:00",
      default_duration_minutes: 90,
      description: "Tăng ca vào giờ nghỉ trưa",
      active: true,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date(),
    },
    {
      id: 4,
      code: "overtime_night",
      name: "Tăng Ca Ngoài Giờ",
      start_time: "17:00:00",
      end_time: "22:00:00",
      default_duration_minutes: 300,
      description: "Tăng ca ngoài giờ hành chính",
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
