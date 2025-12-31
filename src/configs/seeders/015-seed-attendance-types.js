"use strict";

/**
 * Seeder 015: Seed AttendanceType (Loại Chấm Công)
 *
 * Khởi tạo dữ liệu các loại chấm công
 */

export async function up(queryInterface, Sequelize) {
  const attendanceTypes = [
    {
      id: 1,
      code: "REGULAR",
      name: "Chấm Công Ca Ngày",
      time: "08:00 - 17:00",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      code: "NIGHT_SHIFT",
      name: "Chấm Công Ca Đêm",
      time: "22:00 - 06:00",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      code: "OVERTIME_AFTER",
      name: "Tăng Ca Ngoài Giờ",
      time: "17:00 - 22:00",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 4,
      code: "OVERTIME_LUNCH",
      name: "Tăng Ca Trưa",
      time: "11:30 - 13:00",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await queryInterface.bulkInsert("attendance_types", attendanceTypes, {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("attendance_types", {
    id: { [Sequelize.Op.in]: [1, 2, 3, 4] },
  });
}
