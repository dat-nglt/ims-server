"use strict";

/**
 * Model WorkCategory (Danh mục công việc)
 *
 * Định nghĩa các danh mục công việc/dịch vụ chi tiết
 * Mỗi danh mục thuộc một loại: Công trình hoặc Dịch vụ
 */
export default (sequelize, DataTypes) => {
  const WorkCategory = sequelize.define(
    "WorkCategory",
    {
      // ID: khóa chính
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Tên danh mục cụ thể (vd: "Khảo sát – Tư vấn", "Lắp đặt máy lạnh")
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      // Mô tả chi tiết
      description: {
        type: DataTypes.TEXT,
      },
      // Trạng thái hoạt động
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      // Timestamp
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
      tableName: "work_categories",
      timestamps: false,
      indexes: [{ fields: ["name"], unique: true }, { fields: ["is_active"] }],
    }
  );

  // Định nghĩa các mối quan hệ
  WorkCategory.associate = (models) => {
    // Một danh mục có nhiều công việc
    WorkCategory.hasMany(models.Work, {
      foreignKey: "category_id",
      as: "works",
    });
  };

  return WorkCategory;
};
