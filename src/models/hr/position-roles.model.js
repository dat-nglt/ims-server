"use strict";

/**
 * Model PositionRoles (Roles của Chức vụ)
 *
 * Junction table để quản lý many-to-many relationship giữa Position và Role
 * Cho phép một chức vụ có nhiều role, một role có thể thuộc nhiều chức vụ
 *
 * Fields:
 * - is_primary: Role chính (mặc định gán cho nhân viên trong chức vụ này)
 * - is_default: Có tự động assign khi cập nhật chức vụ không
 * - priority: Thứ tự gán (0 = cao nhất, không bắt buộc)
 */
export default (sequelize, DataTypes) => {
  const PositionRoles = sequelize.define(
    "PositionRoles",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      position_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "positions",
          key: "id",
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      // Role chính mặc định gán cho chức vụ này
      is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      // Có tự động assign khi nhân viên thay đổi chức vụ không
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      // Thứ tự ưu tiên gán
      priority: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      tableName: "position_roles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["position_id", "role_id"],
          name: "unique_position_role",
        },
        { fields: ["position_id"] },
        { fields: ["role_id"] },
        { fields: ["is_default"] },
        { fields: ["priority"] },
      ],
    }
  );

  PositionRoles.associate = (models) => {
    PositionRoles.belongsTo(models.Position, {
      foreignKey: "position_id",
      as: "position",
    });

    PositionRoles.belongsTo(models.Role, {
      foreignKey: "role_id",
      as: "role",
    });
  };

  return PositionRoles;
};
