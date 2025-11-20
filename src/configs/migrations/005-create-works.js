'use strict';

/**
 * Migration 005: Tạo bảng Works (Công việc)
 * 
 * Bảng chính lưu trữ tất cả công việc
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('works', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    work_code: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    category_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'work_categories',
        key: 'id',
      },
    },
    assigned_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    assigned_to_technician_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    created_by_sales_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    created_by: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    priority: {
      type: Sequelize.STRING(50),
      defaultValue: 'medium',
    },
    status: {
      type: Sequelize.STRING(50),
      defaultValue: 'pending',
    },
    service_type: {
      type: Sequelize.STRING(100),
    },
    due_date: {
      type: Sequelize.DATE,
    },
    created_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    completed_date: {
      type: Sequelize.DATE,
    },
    location: {
      type: Sequelize.STRING(255),
    },
    customer_name: {
      type: Sequelize.STRING(255),
    },
    customer_phone: {
      type: Sequelize.STRING(20),
    },
    customer_address: {
      type: Sequelize.TEXT,
    },
    location_lat: {
      type: Sequelize.DECIMAL(10, 8),
    },
    location_lng: {
      type: Sequelize.DECIMAL(11, 8),
    },
    estimated_hours: {
      type: Sequelize.DECIMAL(5, 2),
    },
    actual_hours: {
      type: Sequelize.DECIMAL(5, 2),
    },
    estimated_cost: {
      type: Sequelize.DECIMAL(10, 2),
    },
    actual_cost: {
      type: Sequelize.DECIMAL(10, 2),
    },
    payment_status: {
      type: Sequelize.STRING(50),
      defaultValue: 'unpaid',
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

  await queryInterface.addIndex('works', ['work_code']);
  await queryInterface.addIndex('works', ['assigned_user_id']);
  await queryInterface.addIndex('works', ['assigned_to_technician_id']);
  await queryInterface.addIndex('works', ['created_by_sales_id']);
  await queryInterface.addIndex('works', ['status']);
  await queryInterface.addIndex('works', ['priority']);
  await queryInterface.addIndex('works', ['due_date']);
  await queryInterface.addIndex('works', ['category_id']);
  await queryInterface.addIndex('works', ['payment_status']);
  await queryInterface.addIndex('works', ['created_date']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('works');
}
