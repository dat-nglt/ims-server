"use strict";

/**
 * Model Customer (Khách hàng / Customer)
 *
 * Bảng lưu trữ thông tin khách hàng và CRM-related fields
 */
export default (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Mã khách hàng (mã bên ngoài, ví dụ c_001)
      customer_code: {
        type: DataTypes.STRING(50),
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(50),
      },
      email: {
        type: DataTypes.STRING(128),
      },
      address: {
        type: DataTypes.TEXT,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      customer_status: {
        type: DataTypes.ENUM("normal", "prospect", "suspended"),
        defaultValue: "normal",
      },
      customer_type: {
        type: DataTypes.ENUM("khách lẻ", "doanh nghiệp", "đại lý", "vip"),
        defaultValue: "khách lẻ",
      },
      total_works: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      last_work_date: {
        type: DataTypes.DATE,
      },
      // CRM fields
      contact_person: {
        type: DataTypes.STRING(255),
      },
      contact_position: {
        type: DataTypes.STRING(255),
      },
      account_manager_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      account_manager_name: {
        type: DataTypes.STRING(255),
      },
      industry: {
        type: DataTypes.STRING(128),
      },
      tax_id: {
        type: DataTypes.STRING(64),
      },
      website: {
        type: DataTypes.STRING(255),
      },
      payment_terms: {
        type: DataTypes.STRING(64),
      },
      contract_start: {
        type: DataTypes.DATE,
      },
      contract_end: {
        type: DataTypes.DATE,
      },
      last_contact_date: {
        type: DataTypes.DATE,
      },
      // Tọa độ địa điểm khách hàng (vĩ độ)
      location_lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
        validate: {
          min: -90,
          max: 90,
        },
      },
      // Tọa độ địa điểm khách hàng (kinh độ)
      location_lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        validate: {
          min: -180,
          max: 180,
        },
      },
      notes: {
        type: DataTypes.TEXT,
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
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
      tableName: "customers",
      timestamps: false,
      indexes: [
        { fields: ["name"] },
        { fields: ["customer_status"] },
        { fields: ["customer_type"] },
        { fields: ["customer_code"] },
        { fields: ["account_manager_id"] },
        { fields: ["email"] },
        { fields: ["phone"] },
      ],
    }
  );

  Customer.associate = (models) => {
    // Người quản lý (account manager)
    Customer.belongsTo(models.User, {
      foreignKey: "account_manager_id",
      as: "account_manager",
    });

    // Khách hàng có nhiều công việc (works)
    Customer.hasMany(models.Work, {
      foreignKey: "customer_id",
      as: "works",
    });
  };

  return Customer;
};
