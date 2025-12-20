'use strict';

/**
 * Migration 025: Tạo bảng work_materials
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('work_materials', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    work_code: {
      type: Sequelize.STRING(64),
      allowNull: false,
      references: {
        model: 'works',
        key: 'work_code'
      },
      comment: 'Mã công việc liên quan (work_code - chuỗi hệ thống)'
    },
    material_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'materials',
        key: 'id'
      },
      comment: 'ID vật tư'
    },
    allocated_quantity: {
      type: Sequelize.DECIMAL(14, 2),
      defaultValue: 0,
      comment: 'Số lượng đã xuất/allocated cho công việc'
    },
    used_quantity: {
      type: Sequelize.DECIMAL(14, 2),
      defaultValue: 0,
      comment: 'Tổng số đã dùng cho allocation này'
    },
    damaged_quantity: {
      type: Sequelize.DECIMAL(14, 2),
      defaultValue: 0,
      comment: 'Tổng số bị hỏng cho allocation này'
    },
    unit_price_snapshot: {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0,
      comment: 'Giá đơn vị khi xuất vật tư cho công việc'
    },
    total_value_issued: {
      type: Sequelize.DECIMAL(14, 2),
      defaultValue: 0,
      comment: 'Tổng giá trị đã phát cho allocation này'
    },
    technician_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'ID kỹ thuật viên chịu trách nhiệm'
    },
    status: {
      type: Sequelize.ENUM('allocated','in_progress','completed','cancelled'),
      defaultValue: 'allocated',
      comment: 'Trạng thái allocation'
    },
    notes: {
      type: Sequelize.TEXT,
      comment: 'Ghi chú dành cho allocation'
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: 'Thời gian tạo'
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: 'Thời gian cập nhật'
    }
  });

  await queryInterface.addIndex('work_materials', ['work_code']);
  await queryInterface.addIndex('work_materials', ['material_id']);
  await queryInterface.addIndex('work_materials', ['technician_id']);
  await queryInterface.addIndex('work_materials', ['status']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('work_materials');
}
