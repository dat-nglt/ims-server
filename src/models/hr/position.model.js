"use strict";

/**
 * Model Position (Chức vụ)
 *
 * Lưu trữ thông tin về các chức vụ trong công ty
 * Mỗi chức vụ thuộc về một phòng ban và được nhiều nhân viên sử dụng
 * Hỗ trợ cấu trúc phân cấp (parent-child positions) cho các chức vụ cấp cao hơn
 */
export default (sequelize, DataTypes) => {
  const Position = sequelize.define(
    "Position",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Tên chức vụ (Required, Unique trên active records)
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      // Mã chức vụ (Optional, Unique)
      code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Mô tả chi tiết về chức vụ
      description: {
        type: DataTypes.TEXT,
      },
      // Phòng ban (Required)
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "departments",
          key: "id",
        },
      },
      // Cấp độ chức vụ (Level)
      level: {
        type: DataTypes.STRING(50),
        defaultValue: "staff",
      },
      // Chức vụ cha (nếu có cấu trúc phân cấp)
      parent_position_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "positions",
          key: "id",
        },
      },
      // Mức lương tham chiếu (tùy chọn)
      salary_range_min: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      // Mức lương tối đa
      salary_range_max: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      // Số lượng nhân viên dự kiến
      expected_headcount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      // Trạng thái
      status: {
        type: DataTypes.ENUM("active", "inactive", "archived"),
        defaultValue: "active",
      },
      // Soft Delete
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // Audit Trail
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      updated_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      // Timestamps
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
      tableName: "positions",
      timestamps: false,
      indexes: [
        {
          fields: ["name", "department_id", "is_deleted"],
          unique: true,
          name: "unique_position_name_department_deleted",
        },
        {
          fields: ["code", "is_deleted"],
          unique: true,
          name: "unique_position_code_deleted",
        },
        { fields: ["department_id"] },
        { fields: ["parent_position_id"] },
        { fields: ["level"] },
        { fields: ["status"] },
        { fields: ["is_deleted"] },
      ],
    }
  );

  Position.associate = (models) => {
    // Department relationship
    Position.belongsTo(models.Department, {
      foreignKey: "department_id",
      as: "department",
    });

    // Parent position (self-referencing for hierarchy)
    Position.belongsTo(models.Position, {
      foreignKey: "parent_position_id",
      as: "parentPosition",
    });

    // Child positions
    Position.hasMany(models.Position, {
      foreignKey: "parent_position_id",
      as: "childPositions",
    });

    // Many Users have this position
    Position.hasMany(models.User, {
      foreignKey: "position_id",
      as: "users",
    });

    // === ROLES CỦA CHỨC VỤ ===
    // Many-to-Many với Role qua PositionRoles
    Position.belongsToMany(models.Role, {
      through: models.PositionRoles,
      foreignKey: "position_id",
      otherKey: "role_id",
      as: "roles",
    });

    // One-to-Many với PositionRoles
    Position.hasMany(models.PositionRoles, {
      foreignKey: "position_id",
      as: "positionRoles",
    });

    // Audit trail
    Position.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });
    Position.belongsTo(models.User, {
      foreignKey: "updated_by",
      as: "updater",
    });
  };

  return Position;
};
