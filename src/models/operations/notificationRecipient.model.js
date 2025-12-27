"use strict";

export default (sequelize, DataTypes) => {
  const NotificationRecipient = sequelize.define(
    "NotificationRecipient",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      notification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "notifications", key: "id" },
        comment: "FK tới notifications",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        comment: "Người nhận",
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Đã đọc hay chưa",
      },
      read_at: {
        type: DataTypes.DATE,
        comment: "Thời điểm đọc",
      },
      delivered_at: {
        type: DataTypes.DATE,
        comment: "Thời điểm giao thông báo",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "notification_recipients",
      timestamps: false,
      indexes: [
        { fields: ["notification_id"] },
        { fields: ["user_id"] },
        { fields: ["user_id", "is_read"] },
        { unique: true, fields: ["notification_id", "user_id"], name: "uniq_notification_recipient" },
      ],
    }
  );

  NotificationRecipient.associate = (models) => {
    NotificationRecipient.belongsTo(models.Notification, {
      foreignKey: "notification_id",
      as: "notification",
    });

    NotificationRecipient.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return NotificationRecipient;
};