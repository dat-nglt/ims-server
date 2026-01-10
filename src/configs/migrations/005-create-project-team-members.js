"use strict";

/**
 * Migration 005: Tạo bảng Project Team Members (Thành viên dự án)
 *
 * Lưu trữ thông tin thành viên tham gia dự án:
 * - Liên kết với dự án và người dùng
 * - Vai trò trong dự án
 * - Số ngày công đã làm
 * - Phần trăm phân công
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("project_team_members", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
      onDelete: "CASCADE",
      comment: "ID dự án",
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "ID user (nếu thành viên là user hệ thống)",
    },
    name: {
      type: Sequelize.STRING(255),
      comment: "Tên thành viên",
    },
    role: {
      type: Sequelize.STRING(100),
      comment: "Vai trò trong dự án",
    },
    days_worked: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: "Số ngày công đã làm",
    },
    allocation_percent: {
      type: Sequelize.DECIMAL(5, 2),
      defaultValue: 0,
      comment: "Phần trăm phân công (%)",
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: "Thời gian tạo bản ghi (tự động)",
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: "Thời gian cập nhật bản ghi cuối cùng (tự động)",
    },
  });

  await queryInterface.addIndex("project_members", ["project_id"]);
  await queryInterface.addIndex("project_members", ["user_id"]);
  await queryInterface.addIndex("project_members", ["role"]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("project_team_members");
}
