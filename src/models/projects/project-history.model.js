"use strict";

/**
 * Model ProjectHistory (Lịch sử dự án)
 *
 * Lưu trữ lịch sử thay đổi của dự án:
 * - Theo dõi tất cả thay đổi với old_values và new_values dưới dạng JSON
 * - Liên kết với dự án và người thay đổi
 * - Hỗ trợ theo dõi thay đổi trạng thái, phân công, và các trường khác
 */
export default (sequelize, DataTypes) => {
    const ProjectHistory = sequelize.define(
        "ProjectHistory",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            // ID dự án (FK)
            project_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "projects",
                    key: "id",
                },
                comment: "Dự án",
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
            tableName: "project_history",
            timestamps: false,
            indexes: [
                { fields: ["project_id"] },
                { fields: ["action"] },
                { fields: ["field_changed"] },
                { fields: ["changed_at"] },
                { fields: ["changed_by"] },
            ],
        }
    );

    ProjectHistory.associate = (models) => {
        ProjectHistory.belongsTo(models.Project, {
            foreignKey: "project_id",
            as: "project",
        });

        ProjectHistory.belongsTo(models.User, {
            foreignKey: "changed_by",
            as: "changedByUser",
        });
    };

    return ProjectHistory;
};