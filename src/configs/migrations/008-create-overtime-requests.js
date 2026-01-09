"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("overtime_requests", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    work_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "works", key: "id" },
    },
    requested_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: Sequelize.TIME,
      allowNull: true,
    },
    end_time: {
      type: Sequelize.TIME,
      allowNull: true,
    },
    duration_minutes: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    reason: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    overtime_type: {
      type: Sequelize.ENUM("overtime_lunch", "overtime_night", "other"),
      allowNull: false,
      defaultValue: "overtime_lunch", 
      comment: "Loại tăng ca: overtime_lunch=trưa, overtime_night=tối, other=khác",
    },
    status: {
      type: Sequelize.ENUM("pending", "approved", "rejected", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    approver_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
    approved_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    is_paid: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    technician_ids: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      comment: "Danh sách ID của các kỹ thuật viên liên quan đến yêu cầu tăng ca",
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

  await queryInterface.addIndex("overtime_requests", ["user_id"]);
  await queryInterface.addIndex("overtime_requests", ["work_id"]);
  await queryInterface.addIndex("overtime_requests", ["status"]);
  await queryInterface.addIndex("overtime_requests", ["requested_date"]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("overtime_requests");
}
