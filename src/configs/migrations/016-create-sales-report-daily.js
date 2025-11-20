'use strict';

/**
 * Migration 016: Tạo bảng Sales Report Daily (Báo cáo bán hàng hàng ngày)
 * 
 * Lưu trữ các báo cáo bán hàng hàng ngày của nhân viên sales
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('sales_report_daily', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    report_code: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: false,
    },
    sales_person_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    report_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    revenue: {
      type: Sequelize.DECIMAL(10, 2),
    },
    cost: {
      type: Sequelize.DECIMAL(10, 2),
    },
    profit: {
      type: Sequelize.DECIMAL(10, 2),
    },
    notes: {
      type: Sequelize.TEXT,
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

  await queryInterface.addIndex('sales_report_daily', ['sales_person_id']);
  await queryInterface.addIndex('sales_report_daily', ['report_date']);
  await queryInterface.addIndex('sales_report_daily', ['created_at']);
  await queryInterface.addIndex('sales_report_daily', ['sales_person_id', 'report_date']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('sales_report_daily');
}
