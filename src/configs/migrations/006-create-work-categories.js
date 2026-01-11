"use strict";

/**
 * Migration 004: Tạo bảng Work Categories (Danh mục công việc)
 *
 * Định nghĩa các loại công việc/dịch vụ
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("work_categories", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "Tên danh mục công việc cụ thể",
    },
    description: {
      type: Sequelize.TEXT,
      comment: "Mô tả chi tiết về danh mục",
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      comment: "Danh mục có hoạt động hay không",
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex("work_categories", ["name"], { unique: true });
  await queryInterface.addIndex("work_categories", ["is_active"]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("work_categories");
}
