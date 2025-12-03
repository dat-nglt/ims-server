"use strict";

/**
 * Model Notification (Thông báo)
 *
 * Lưu trữ các thông báo cho người dùng
 */
export default (sequelize, DataTypes) => {
    const Notification = sequelize.define(
        "Notification",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true, // Sửa lỗi: thêm autoIncrement
            },
            // ID người dùng nhận thông báo (FK)
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                comment: "Người dùng nhận thông báo",
            },
            // Tiêu đề thông báo
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [1, 255],
                },
                comment: "Tiêu đề thông báo",
            },
            // Nội dung thông báo
            message: {
                type: DataTypes.TEXT,
                comment: "Nội dung chi tiết",
            },
            // Loại thông báo: work_assigned, report_approved, check_in_alert...
            type: {
                type: DataTypes.STRING(50),
                comment: "Loại thông báo",
            },
            // ID công việc liên quan
            related_work_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "works",
                    key: "id",
                },
                comment: "ID công việc liên quan (nếu có)",
            },
            // ID dự án liên quan
            related_project_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "projects",
                    key: "id",
                },
                comment: "ID dự án liên quan (nếu có)",
            },
            // Đã đọc hay chưa
            is_read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                comment: "Đã đọc thông báo",
            },
            // Thời gian đọc
            read_at: {
                type: DataTypes.DATE,
                comment: "Thời điểm đọc thông báo",
            },
            // URL hành động
            action_url: {
                type: DataTypes.STRING(255),
                comment: "URL để xử lý hành động",
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "notifications",
            timestamps: false,
            indexes: [
                { fields: ["user_id"] },
                { fields: ["is_read"] },
                { fields: ["type"] },
                { fields: ["created_at"] },
                { fields: ["user_id", "is_read"] }, // Composite index cho thông báo chưa đọc của user
            ],
        }
    );

    Notification.associate = (models) => {
        Notification.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });

        Notification.belongsTo(models.Work, {
            foreignKey: "related_work_id",
            as: "work",
        });

        Notification.belongsTo(models.Project, {
            foreignKey: "related_project_id",
            as: "project",
        });
    };

    return Notification;
};
