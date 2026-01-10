"use strict";

/**
 * Model WorkAssignment (Phân công công việc)
 *
 * Lưu trữ thông tin phân công công việc cho kỹ thuật viên:
 * - Liên kết với công việc và kỹ thuật viên
 * - Theo dõi trạng thái chấp nhận và tiến độ
 * - Thời gian ước tính và thực tế
 */
export default (sequelize, DataTypes) => {
  const WorkAssignment = sequelize.define(
    "WorkAssignment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // ID công việc (FK)
      work_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "works",
          key: "id",
        },
      },
      // ID kỹ thuật viên (FK)
      technician_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        comment: "Kỹ thuật viên được phân công",
      },
      // Người phân công (FK)
      assigned_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        comment: "Người phân công",
      },
      // Ngày phân công
      assignment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      // Trạng thái: pending, accepted, rejected, completed
      assigned_status: {
        type: DataTypes.ENUM("pending", "accepted", "in_progress", "rejected", "completed", "cancelled"),
        defaultValue: "pending",
      },
      // Thời gian chấp nhận
      accepted_at: {
        type: DataTypes.DATE,
        comment: "Thời điểm kỹ thuật viên chấp nhận",
      },
      // Lý do từ chối
      rejected_reason: {
        type: DataTypes.TEXT,
        comment: "Lý do từ chối (nếu có)",
      },
      // Thời gian bắt đầu ước tính
      estimated_start_time: {
        type: DataTypes.DATE,
      },
      // Thời gian kết thúc ước tính
      estimated_end_time: {
        type: DataTypes.DATE,
      },
      // Thời gian bắt đầu thực tế
      actual_start_time: {
        type: DataTypes.DATE,
      },
      // Thời gian kết thúc thực tế
      actual_end_time: {
        type: DataTypes.DATE,
      },
      // Ghi chú
      notes: {
        type: DataTypes.TEXT,
      },
      // Cho phép chấm công tăng ca (nếu true, kỹ thuật viên được phép chấm công ngoài giờ)
      allow_overtime: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // Thời gian tạo bản ghi
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: "Thời gian tạo bản ghi (tự động)",
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: "Thời gian cập nhật bản ghi cuối cùng (tự động)",
      },
    },
    {
      tableName: "work_assignments",
      timestamps: false,
      indexes: [
        { fields: ["technician_id"] },
        { fields: ["work_id"] },
        { fields: ["work_id", "technician_id"], unique: true, name: "unique_work_technician" },
        { fields: ["assigned_status"] },
        { fields: ["assignment_date"] },
      ],
    }
  );

  WorkAssignment.associate = (models) => {
    WorkAssignment.belongsTo(models.Work, {
      foreignKey: "work_id",
      as: "work",
    });

    WorkAssignment.belongsTo(models.User, {
      foreignKey: "technician_id",
      as: "technician",
    });

    WorkAssignment.belongsTo(models.User, {
      foreignKey: "assigned_by",
      as: "assignedByUser",
    });
  };

  return WorkAssignment;
};
