'use strict';

/**
 * Model Customer (Khách hàng / Customer)
 *
 * Bảng lưu trữ thông tin khách hàng và CRM-related fields
 */
export default (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Mã khách hàng (mã bên ngoài, ví dụ c_001)
      customer_code: {
        type: DataTypes.STRING(50),
        unique: true,
        comment: 'Mã khách hàng bên ngoài (ví dụ: c_001)',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Tên khách hàng / Tên công ty',
      },
      phone: {
        type: DataTypes.STRING(50),
        comment: 'Số điện thoại liên hệ',
      },
      email: {
        type: DataTypes.STRING(128),
        comment: 'Email liên hệ chính',
      },
      address: {
        type: DataTypes.TEXT,
        comment: 'Địa chỉ',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'prospect', 'suspended'),
        defaultValue: 'active',
        comment: 'Trạng thái khách hàng',
      },
      customer_type: {
        type: DataTypes.ENUM('khách lẻ', 'doanh nghiệp', 'đại lý', 'vip'),
        defaultValue: 'khách lẻ',
        comment: 'Loại khách hàng (mặc định: khách lẻ)',
      },
      total_works: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Tổng số công việc liên quan đến khách hàng (cập nhật theo công việc)',
      },
      last_work_date: {
        type: DataTypes.DATE,
        comment: 'Ngày công việc gần nhất',
      },
      // CRM fields
      contact_person: {
        type: DataTypes.STRING(255),
        comment: 'Người liên hệ chính',
      },
      contact_position: {
        type: DataTypes.STRING(255),
        comment: 'Chức vụ người liên hệ',
      },
      account_manager_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'ID nhân viên kinh doanh (account manager) phụ trách',
      },
      account_manager_name: {
        type: DataTypes.STRING(255),
        comment: 'Tên nhân viên kinh doanh (dự phòng, dễ tra cứu)',
      },
      industry: {
        type: DataTypes.STRING(128),
        comment: 'Ngành nghề',
      },
      tax_id: {
        type: DataTypes.STRING(64),
        comment: 'Mã số thuế',
      },
      website: {
        type: DataTypes.STRING(255),
        comment: 'Website công ty',
      },
      payment_terms: {
        type: DataTypes.STRING(64),
        comment: 'Điều khoản thanh toán',
      },
      contract_start: {
        type: DataTypes.DATE,
        comment: 'Ngày bắt đầu hợp đồng',
      },
      contract_end: {
        type: DataTypes.DATE,
        comment: 'Ngày kết thúc hợp đồng',
      },
      last_contact_date: {
        type: DataTypes.DATE,
        comment: 'Ngày liên hệ gần nhất',
      },
      notes: {
        type: DataTypes.TEXT,
        comment: 'Ghi chú CRM',
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'ID người tạo bản ghi',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Thời gian tạo bản ghi (tự động)',
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Thời gian cập nhật bản ghi cuối cùng (tự động)',
      },
    },
    {
      tableName: 'customers',
      timestamps: false,
      indexes: [
          { fields: ['name'] },
        { fields: ['status'] },
        { fields: ['customer_type'] },
        { fields: ['customer_code'] },
        { fields: ['account_manager_id'] },
      ],
    }
  );

  Customer.associate = (models) => {
    // Người quản lý (account manager)
    Customer.belongsTo(models.User, {
      foreignKey: 'account_manager_id',
      as: 'account_manager',
    });

    // Khách hàng có nhiều công việc (works)
    Customer.hasMany(models.Work, {
      foreignKey: 'customer_id',
      as: 'works',
    });
  };

  return Customer;
};
