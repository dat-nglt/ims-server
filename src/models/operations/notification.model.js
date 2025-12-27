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
            // Đánh dấu thông báo dành cho hệ thống (admin/dashboard)
            // Tách biệt khỏi thông báo cho user có liên quan
            is_system: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                comment: "Là thông báo hệ thống (dành cho admin/dashboard) hay thông báo user?",
            },
            // URL hành động
            action_url: {
                type: DataTypes.STRING(255),
                comment: "URL để xử lý hành động",
            },
            // Mức độ ưu tiên: high | medium | low
            priority: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: "low",
                comment: "Mức độ ưu tiên của thông báo (high, medium, low)",
            },
            // Dữ liệu bổ sung (JSON) có thể chứa snapshot của work/project
            meta: {
                type: DataTypes.JSON,
                allowNull: true,
                comment: "Dữ liệu bổ sung cho thông báo (JSON)",
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            // Virtual field để client có thể dùng `timestamp`
            timestamp: {
                type: DataTypes.VIRTUAL,
                get() {
                    return this.getDataValue("created_at");
                },
            },
        },
        {
            tableName: "notifications",
            timestamps: false,
            indexes: [
                { fields: ["is_system"] },
                { fields: ["type"] },
                { fields: ["priority"] },
                { fields: ["created_at"] }
            ],
        }
    );

    Notification.associate = (models) => {
        Notification.belongsTo(models.Work, {
            foreignKey: "related_work_id",
            as: "work",
        });

        Notification.belongsTo(models.Project, {
            foreignKey: "related_project_id",
            as: "project",
        });

        // Notification has many recipients (per-user read state)
        if (models.NotificationRecipient) {
            Notification.hasMany(models.NotificationRecipient, {
                foreignKey: "notification_id",
                as: "recipients",
            });
        }
    };

    return Notification;
};
