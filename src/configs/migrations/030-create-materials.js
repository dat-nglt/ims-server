'use strict';

/**
 * Migration 023: Tạo bảng materials
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('materials', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    material_code: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      allowNull: false,
      comment: 'Mã vật tư duy nhất (UUID)'
    },
    code: {
      type: Sequelize.STRING(100),
      unique: true,
      comment: 'Mã ngắn của vật tư (ví dụ MAT001)'
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: 'Tên vật tư'
    },
    description: {
      type: Sequelize.TEXT,
      comment: 'Mô tả vật tư'
    },
    unit: {
      type: Sequelize.STRING(50),
      comment: 'Đơn vị tính'
    },
    quantity: {
      type: Sequelize.DECIMAL(14, 2),
      defaultValue: 0,
      comment: 'Tổng số lượng vật tư'
    },
    used_quantity: {
      type: Sequelize.DECIMAL(14, 2),
      defaultValue: 0,
      comment: 'Số lượng đã dùng'
    },
    damaged_quantity: {
      type: Sequelize.DECIMAL(14, 2),
      defaultValue: 0,
      comment: 'Số lượng bị hỏng'
    },
    unit_price: {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0,
      comment: 'Giá trên một đơn vị vật tư (dùng để tính giá trị xuất kho)'
    },
    reorder_level: {
      type: Sequelize.DECIMAL(14, 2),
      defaultValue: 0,
      comment: 'Ngưỡng cảnh báo tồn kho (số lượng)'
    },
    // NOTE: Materials are independent entities. Relations to projects/works are
    // created when a material is assigned to a project or work (via WorkMaterial or MaterialUsage).
    status: {
      type: Sequelize.ENUM('active','low_stock','out_of_stock','inactive'),
      defaultValue: 'active',
      comment: 'Trạng thái vật tư'
    },
    created_by: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'ID người tạo'
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: 'Thời gian tạo bản ghi'
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: 'Thời gian cập nhật bản ghi cuối cùng'
    }
  });

  await queryInterface.addIndex('materials', ['material_code']);
  await queryInterface.addIndex('materials', ['code']);
  await queryInterface.addIndex('materials', ['status']);
  await queryInterface.addIndex('materials', ['name']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('materials');
}
