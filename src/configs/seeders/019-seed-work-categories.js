"use strict";

/**
 * Seeder 019: Seed Work Categories (danh mục công việc)
 *
 * Tạo danh sách 10 danh mục công việc mặc định:
 * 1. Khảo sát – Tư vấn
 * 2. Giao hàng – Vận chuyển
 * 3. Lắp đặt máy lạnh dân dụng
 * 4. Lắp đặt hệ thống
 * 5. Bảo trì – Bảo dưỡng
 * 6. Sửa chữa – Khắc phục sự cố
 * 7. Tháo dỡ – Di dời
 * 8. Thi công phụ trợ (ống đồng, điện, nước, ống gió)
 * 9. Nghiệm thu – Bàn giao
 * 10. Bảo hành – Hậu mãi
 */

export async function up(queryInterface, Sequelize) {
  const categories = [
    {
      id: 1,
      name: "Khảo sát – Tư vấn",
      description: "Dịch vụ khảo sát địa điểm, tư vấn giải pháp",
      icon: "assessment",
      color: "#1976d2",
      is_active: true,
      display_order: 1,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      id: 2,
      name: "Giao hàng – Vận chuyển",
      description: "Dịch vụ giao hàng và vận chuyển thiết bị",
      icon: "local_shipping",
      color: "#388e3c",
      is_active: true,
      display_order: 2,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      id: 3,
      name: "Lắp đặt máy lạnh dân dụng",
      description: "Lắp đặt máy lạnh cho khu dân cư",
      icon: "ac_unit",
      color: "#0288d1",
      is_active: true,
      display_order: 3,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      id: 4,
      name: "Lắp đặt hệ thống",
      description: "Lắp đặt hệ thống máy lạnh thi công trọn gói",
      icon: "build",
      color: "#f57c00",
      is_active: true,
      display_order: 4,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      id: 5,
      name: "Bảo trì – Bảo dưỡng",
      description: "Dịch vụ bảo trì định kỳ và bảo dưỡng máy",
      icon: "settings",
      color: "#7b1fa2",
      is_active: true,
      display_order: 5,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      id: 6,
      name: "Sửa chữa – Khắc phục sự cố",
      description: "Dịch vụ sửa chữa và khắc phục sự cố",
      icon: "build_circle",
      color: "#d32f2f",
      is_active: true,
      display_order: 6,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      id: 7,
      name: "Tháo dỡ – Di dời",
      description: "Dịch vụ tháo dỡ, di dời máy lạnh",
      icon: "unarchive",
      color: "#c41c3b",
      is_active: true,
      display_order: 7,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      id: 8,
      name: "Thi công phụ trợ (ống đồng, điện, nước, ống gió)",
      description: "Dịch vụ thi công công trình phụ trợ",
      icon: "construction",
      color: "#ff6f00",
      is_active: true,
      display_order: 8,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      id: 9,
      name: "Nghiệm thu – Bàn giao",
      description: "Dịch vụ nghiệm thu và bàn giao công trình",
      icon: "task_alt",
      color: "#1565c0",
      is_active: true,
      display_order: 9,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      id: 10,
      name: "Bảo hành – Hậu mãi",
      description: "Dịch vụ bảo hành và hỗ trợ hậu mãi",
      icon: "verified_user",
      color: "#2e7d32",
      is_active: true,
      display_order: 10,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
  ];

  await queryInterface.bulkInsert("work_categories", categories, {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete(
    "work_categories",
    { id: { [Sequelize.Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } },
    {}
  );
}
