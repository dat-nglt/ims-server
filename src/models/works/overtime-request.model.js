"use strict";

/**
 * Model OvertimeRequest
 * - user_id: who requests overtime (FK users)
 * - work_id: optional work related to the overtime (FK works)
 * - requested_date: date of overtime
 * - start_time, end_time: times (HH:MM:SS) or DateTime depending on usage
 * - duration_minutes: integer
 * - reason: text
 * - status: enum (pending, approved, rejected, cancelled)
 * - approver_id: FK users
 * - approved_at: datetime
 * - is_paid: boolean
 */
export default (sequelize, DataTypes) => {
  const OvertimeRequest = sequelize.define(
    "OvertimeRequest",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      work_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "works", key: "id" },
      },
      requested_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Loại tăng ca mặc định: overtime_lunch=trưa, overtime_night=tối, other=khác
      overtime_type: {
        type: DataTypes.ENUM("overtime_lunch", "overtime_night", "other"),
        allowNull: false,
        defaultValue: "overtime_lunch",
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      approver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      technician_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        comment: "Danh sách ID của các kỹ thuật viên liên quan đến yêu cầu tăng ca",
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
      tableName: "overtime_requests",
      timestamps: false,
      underscored: true,
      indexes: [
        { fields: ["user_id"] },
        { fields: ["work_id"] },
        { fields: ["status"] },
        { fields: ["requested_date"] },
      ],
    }
  );

  OvertimeRequest.associate = (models) => {
    OvertimeRequest.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    OvertimeRequest.belongsTo(models.User, { foreignKey: "approver_id", as: "approver" });
    OvertimeRequest.belongsTo(models.Work, { foreignKey: "work_id", as: "work" });
  };

  return OvertimeRequest;
};
