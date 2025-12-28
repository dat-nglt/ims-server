'use strict';

/**
 * Migration: Tạo bảng customers và thêm customer_id vào works
 */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('customers', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_code: {
      type: Sequelize.STRING(50),
      unique: true,
      comment: 'Mã khách hàng bên ngoài',
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: 'Tên khách hàng',
    },
    phone: {
      type: Sequelize.STRING(50),
      comment: 'Số điện thoại',
    },
    email: {
      type: Sequelize.STRING(128),
      comment: 'Email',
    },
    address: {
      type: Sequelize.TEXT,
      comment: 'Địa chỉ',
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive', 'prospect', 'suspended'),
      defaultValue: 'active',
      comment: 'Trạng thái khách hàng',
    },
    customer_type: {
      type: Sequelize.ENUM('khách lẻ', 'doanh nghiệp', 'đại lý', 'vip'),
      defaultValue: 'khách lẻ',
      comment: 'Loại khách hàng (mặc định: khách lẻ)',
    },
    total_works: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    last_work_date: {
      type: Sequelize.DATE,
    },
    contact_person: {
      type: Sequelize.STRING(255),
    },
    contact_position: {
      type: Sequelize.STRING(255),
    },
    account_manager_id: {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    account_manager_name: {
      type: Sequelize.STRING(255),
    },
    industry: {
      type: Sequelize.STRING(128),
    },
    tax_id: {
      type: Sequelize.STRING(64),
    },
    website: {
      type: Sequelize.STRING(255),
    },
    payment_terms: {
      type: Sequelize.STRING(64),
    },
    contract_start: {
      type: Sequelize.DATE,
    },
    contract_end: {
      type: Sequelize.DATE,
    },
    last_contact_date: {
      type: Sequelize.DATE,
      comment: 'Ngày liên hệ gần nhất',
    },
    location_lat: {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
      comment: 'Vĩ độ GPS địa điểm khách hàng',
    },
    location_lng: {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
      comment: 'Kinh độ GPS địa điểm khách hàng',
    },
    notes: {
      type: Sequelize.TEXT,
      comment: 'Ghi chú CRM',
    },
    created_by: {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('customers', ['name']);
  await queryInterface.addIndex('customers', ['status']);
  await queryInterface.addIndex('customers', ['customer_type']);
  await queryInterface.addIndex('customers', ['customer_code']);
  await queryInterface.addIndex('customers', ['account_manager_id']);
  await queryInterface.addIndex('customers', ['email']);
  await queryInterface.addIndex('customers', ['phone']);

  // Thêm FK customer_id vào bảng works để liên kết (nullable, giữ nguyên các trường customer_name hiện tại)
  await queryInterface.addColumn('works', 'customer_id', {
    type: Sequelize.INTEGER,
    references: { model: 'customers', key: 'id' },
    allowNull: true,
    comment: 'ID khách hàng (nếu đã có bản ghi trong bảng customers)',
  });

  await queryInterface.addIndex('works', ['customer_id']);
}

export async function down(queryInterface, Sequelize) {
  // Remove column first to avoid FK constraints
  await queryInterface.removeIndex('works', ['customer_id']);
  await queryInterface.removeColumn('works', 'customer_id');

  await queryInterface.dropTable('customers');

  // For Postgres: drop enum type created for customer_type (cleanup)
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_customers_customer_type";');
}
