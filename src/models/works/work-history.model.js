"use strict";

/**
 * Model WorkHistory (Lịch sử công việc)
 *
 * Lưu trữ lịch sử thay đổi của công việc:
 * - Theo dõi tất cả thay đổi với old_values và new_values dưới dạng JSON
 * - Liên kết với công việc và người thay đổi
 * - Hỗ trợ theo dõi thay đổi trạng thái, phân công, và các trường khác
 */
export default (sequelize, DataTypes) => {
    const WorkHistory = sequelize.define(
        "WorkHistory",
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
                comment: "Công việc",
            },
            // Hành động: created, updated, approved, deleted, assigned, accepted, rejected, started, completed, reported, report_updated, report_approved, report_rejected
            action: {
                type: DataTypes.ENUM(
                    "created",
                    "updated",
                    "approved",
                    "deleted",
                    "assigned",
                    "accepted",
                    "rejected",
                    "started",
                    "completed",
                    "reported",
                    "report_updated",
                    "report_approved",
                    "report_rejected"
                ),
                defaultValue: "updated",
                comment:
                    "Hành động thay đổi: created (tạo), updated (cập nhật), approved (phê duyệt), deleted (xóa), assigned (phân công), accepted (chấp nhận), rejected (từ chối), started (bắt đầu), completed (hoàn thành), reported (báo cáo), report_updated (cập nhật báo cáo), report_approved (phê duyệt báo cáo), report_rejected (từ chối báo cáo)",
            },
            // Trường thay đổi (nếu chỉ một trường)
            field_changed: {
                type: DataTypes.STRING(100),
                comment: "Tên trường thay đổi (nếu áp dụng)",
            },
            // Giá trị cũ (JSON)
            old_values: {
                type: DataTypes.JSONB,
                comment: "Giá trị trước thay đổi",
            },
            // Giá trị mới (JSON)
            new_values: {
                type: DataTypes.JSONB,
                comment: "Giá trị sau thay đổi",
            },
            // Người thay đổi (FK)
            changed_by: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
                comment: "Người thay đổi",
            },
            // Thời gian thay đổi
            changed_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                comment: "Thời gian thay đổi",
            },
            // Ghi chú
            notes: {
                type: DataTypes.TEXT,
                comment: "Ghi chú về thay đổi",
            },
            // IP address
            ip_address: {
                type: DataTypes.STRING(45),
            },
            // User agent
            user_agent: {
                type: DataTypes.TEXT,
            },
        },
        {
            tableName: "work_history",
            timestamps: false,
            indexes: [
                { fields: ["work_id"] },
                { fields: ["action"] },
                { fields: ["field_changed"] },
                { fields: ["changed_at"] },
                { fields: ["changed_by"] },
            ],
        }
    );

    WorkHistory.associate = (models) => {
        WorkHistory.belongsTo(models.Work, {
            foreignKey: "work_id",
            as: "work",
        });

        WorkHistory.belongsTo(models.User, {
            foreignKey: "changed_by",
            as: "changedByUser",
        });
    };

    return WorkHistory;
};
