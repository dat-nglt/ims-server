'use strict';

/**
 * Migration 024: Tạo bảng material_usages
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('material_usages', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    work_code: {
      type: Sequelize.STRING(64),
      references: {
        model: 'works',
        key: 'work_code'
      },
      comment: 'Mã công việc liên quan (work_code - chuỗi hệ thống)'
    },
    sub_work_name: {
      type: Sequelize.STRING(255),
      comment: 'Tên công việc con hoặc hạng mục sử dụng vật tư'
    },
    technician_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'ID kỹ thuật viên thực hiện'
    },
    technician_name: {
      type: Sequelize.STRING(255),
      comment: 'Tên kỹ thuật viên (nếu không có user)'
    },
    used_quantity: {
      type: Sequelize.DECIMAL(14, 2),
      defaultValue: 0,
      comment: 'Số lượng đã dùng cho sub-work này'
    },
    usage_type: {
      type: Sequelize.ENUM('used','damaged','issued','returned'),
      defaultValue: 'used',
      comment: 'Loại ghi nhận'
    },
    unit_price: {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0,
      comment: 'Giá 1 đơn vị tại thời điểm ghi nhận'
    },
    total_value: {
      type: Sequelize.DECIMAL(14, 2),
      defaultValue: 0,
      comment: 'Giá trị cho bản ghi này (used_quantity * unit_price)'
    },
    notes: {
      type: Sequelize.TEXT,
      comment: 'Ghi chú sử dụng'
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

  await queryInterface.addIndex('material_usages', ['material_id']);
  await queryInterface.addIndex('material_usages', ['technician_id']);
  await queryInterface.addIndex('material_usages', ['work_code']);
  await queryInterface.addIndex('material_usages', ['usage_type']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('material_usages');
}
