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
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "departments", key: "id" },
        comment: "Khối/Phòng ban yêu cầu tăng ca",
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
      // Loại tăng ca: overtime_lunch=trưa, overtime_night=tối, other=khác
      overtime_type: {
        type: DataTypes.ENUM("overtime_lunch", "overtime_night", "other"),
        allowNull: false,
        defaultValue: "overtime_lunch",
        comment: "Loại tăng ca: overtime_lunch=trưa, overtime_night=tối, other=khác",
      },
      // Phân loại tăng ca cho khối văn phòng
      overtime_category: {
        type: DataTypes.ENUM(
          "administrative_work",
          "project_support",
          "event_support",
          "report_processing",
          "data_entry",
          "meeting_support",
          "emergency_work",
          "other"
        ),
        allowNull: false,
        defaultValue: "administrative_work",
        comment: "Phân loại: hành chính, hỗ trợ dự án, sự kiện, xử lý báo cáo, nhập liệu, hỗ trợ họp, khẩn cấp, khác",
      },
      // Mức độ ưu tiên
      priority: {
        type: DataTypes.ENUM("low", "medium", "high", "urgent"),
        allowNull: false,
        defaultValue: "medium",
        comment: "Mức độ ưu tiên: thấp, trung bình, cao, khẩn cấp",
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
      // Người kiểm duyệt kết quả hoàn thành
      reviewed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        comment: "Người kiểm duyệt/phê chuẩn kết quả hoàn thành",
      },
      // Lý do từ chối
      rejected_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Lý do từ chối (nếu status = rejected)",
      },
      // Trạng thái hoàn thành công việc tăng ca
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Công việc tăng ca có hoàn thành hay không",
      },
      // Ghi chú về kết quả hoàn thành
      completion_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Ghi chú về kết quả hoàn thành công việc",
      },
      // Chi phí ước tính
      estimated_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "Chi phí ước tính cho tăng ca",
      },
      // Chi phí thực tế
      actual_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "Chi phí thực tế sau hoàn thành",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
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
        { fields: ["department_id"] },
        { fields: ["work_id"] },
        { fields: ["status"] },
        { fields: ["requested_date"] },
        { fields: ["priority"] },
      ],
    }
  );

  OvertimeRequest.associate = (models) => {
    OvertimeRequest.belongsTo(models.User, { foreignKey: "user_id", as: "requester" });
    OvertimeRequest.belongsTo(models.Department, { foreignKey: "department_id", as: "department" });
    OvertimeRequest.belongsTo(models.User, { foreignKey: "approver_id", as: "approver" });
    OvertimeRequest.belongsTo(models.User, { foreignKey: "reviewed_by", as: "reviewer" });
    OvertimeRequest.belongsTo(models.Work, { foreignKey: "work_id", as: "work" });
    OvertimeRequest.hasMany(models.OvertimeRequestTechnician, {
      foreignKey: "overtime_request_id",
      as: "technicians",
    });
  };

  return OvertimeRequest;
};
