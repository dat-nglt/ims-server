"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("overtime_request_technicians", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // ID yêu cầu tăng ca
    overtime_request_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "overtime_requests",
        key: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    // ID kỹ thuật viên được phê duyệt
    technician_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      comment: "Kỹ thuật viên được phê duyệt tăng ca",
    },
    // Trạng thái phê duyệt cho technician này: pending, approved, rejected
    status: {
      type: Sequelize.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    // Người duyệt cho technician này
    approver_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      comment: "Người duyệt phê duyệt/từ chối cho technician này",
    },
    // Thời gian duyệt
    approved_at: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Thời gian phê duyệt",
    },
    // Có được trả lương tăng ca hay không
    is_paid: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Có được trả lương cho tăng ca này hay không",
    },
    // Ghi chú (lý do phê duyệt/từ chối)
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Ghi chú, lý do phê duyệt/từ chối",
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

  // Add indexes for query performance
  await queryInterface.addIndex("overtime_request_technicians", ["overtime_request_id"]);
  await queryInterface.addIndex("overtime_request_technicians", ["technician_id"]);
  await queryInterface.addIndex("overtime_request_technicians", ["status"]);

  // Add unique constraint
  await queryInterface.addConstraint("overtime_request_technicians", {
    fields: ["overtime_request_id", "technician_id"],
    type: "unique",
    name: "unique_overtime_request_technician",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("overtime_request_technicians");
}
