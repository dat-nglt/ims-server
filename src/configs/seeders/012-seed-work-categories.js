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
      name: "Khảo sát – Tư vấn",
      description: "Dịch vụ khảo sát địa điểm, tư vấn giải pháp",
      is_active: true,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      name: "Giao hàng – Vận chuyển",
      description: "Dịch vụ giao hàng và vận chuyển thiết bị",
      is_active: true,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      name: "Lắp đặt máy lạnh dân dụng",
      description: "Lắp đặt máy lạnh cho khu dân cư",
      is_active: true,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      name: "Lắp đặt hệ thống",
      description: "Lắp đặt hệ thống máy lạnh thi công trọn gói",
      is_active: true,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      name: "Bảo trì – Bảo dưỡng",
      description: "Dịch vụ bảo trì định kỳ và bảo dưỡng máy",
      is_active: true,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      name: "Sửa chữa – Khắc phục sự cố",
      description: "Dịch vụ sửa chữa và khắc phục sự cố",
      is_active: true,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      name: "Tháo dỡ – Di dời",
      description: "Dịch vụ tháo dỡ, di dời máy lạnh",
      is_active: true,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      name: "Thi công phụ trợ (ống đồng, điện, nước, ống gió)",
      description: "Dịch vụ thi công công trình phụ trợ",
      is_active: true,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      name: "Nghiệm thu – Bàn giao",
      description: "Dịch vụ nghiệm thu và bàn giao công trình",
      is_active: true,
      created_at: new Date("2025-01-01T00:00:00.000Z"),
      updated_at: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      name: "Bảo hành – Hậu mãi",
      description: "Dịch vụ bảo hành và hỗ trợ hậu mãi",
      is_active: true,
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
