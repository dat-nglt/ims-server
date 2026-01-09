"use strict";

/**
 * Model OvertimeRequestTechnician (Phê duyệt tăng ca theo từng kỹ thuật viên)
 *
 * Lưu trữ thông tin phê duyệt tăng ca cho từng kỹ thuật viên:
 * - overtime_request_id: FK đến overtime_requests (yêu cầu tăng ca)
 * - technician_id: FK đến users (kỹ thuật viên)
 * - status: trạng thái phê duyệt cho technician này (pending, approved, rejected)
 * - approver_id: người duyệt cho technician này
 * - approved_at: thời gian duyệt
 * - is_paid: có được trả lương tăng ca hay không
 */
export default (sequelize, DataTypes) => {
  const OvertimeRequestTechnician = sequelize.define(
    "OvertimeRequestTechnician",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // ID yêu cầu tăng ca
      overtime_request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "overtime_requests",
          key: "id",
        },
      },
      // ID kỹ thuật viên được phê duyệt
      technician_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        comment: "Kỹ thuật viên được phê duyệt tăng ca",
      },
      // Trạng thái phê duyệt cho technician này: pending, approved, rejected
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      // Người duyệt cho technician này
      approver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        comment: "Người duyệt phê duyệt/từ chối cho technician này",
      },
      // Thời gian duyệt
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Thời gian phê duyệt",
      },
      // Có được trả lương tăng ca hay không
      is_paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Có được trả lương cho tăng ca này hay không",
      },
      // Ghi chú (lý do phê duyệt/từ chối)
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Ghi chú, lý do phê duyệt/từ chối",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "overtime_request_technicians",
      timestamps: false,
      underscored: true,
      indexes: [
        { fields: ["overtime_request_id"] },
        { fields: ["technician_id"] },
        { fields: ["status"] },
        {
          fields: ["overtime_request_id", "technician_id"],
          unique: true,
          name: "unique_overtime_request_technician",
        },
      ],
    }
  );

  OvertimeRequestTechnician.associate = (models) => {
    OvertimeRequestTechnician.belongsTo(models.OvertimeRequest, {
      foreignKey: "overtime_request_id",
      as: "overtimeRequest",
    });

    OvertimeRequestTechnician.belongsTo(models.User, {
      foreignKey: "technician_id",
      as: "technician",
    });

    OvertimeRequestTechnician.belongsTo(models.User, {
      foreignKey: "approver_id",
      as: "approver",
    });
  };

  return OvertimeRequestTechnician;
};
