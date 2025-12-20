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
      type: Sequelize.STRING(64),
      unique: true,
      allowNull: false,
      comment: "Mã công việc duy nhất (chuỗi do hệ thống tạo)",
    },
    // Fields for scheduling/time slots
    required_date: {
      type: Sequelize.DATE,
      comment: "Ngày yêu cầu thực hiện công việc (date only)",
    },
    required_time_hour: {
      type: Sequelize.STRING(2),
      comment: "Giờ yêu cầu (HH)",
    },
    required_time_minute: {
      type: Sequelize.STRING(2),
      comment: "Phút yêu cầu (MM)",
    },
    timeSlot: {
      type: Sequelize.INTEGER,
      comment: "Time slot index / hour bucket để sắp xếp",
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "Tiêu đề công việc",
    },
    description: {
      type: Sequelize.TEXT,
      comment: "Mô tả chi tiết công việc",
    },
    category_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'work_categories',
        key: 'id',
      },
      comment: "ID danh mục công việc",
    },
    project_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'projects',
        key: 'id',
      },
      comment: "ID dự án liên quan (nếu công việc thuộc một dự án cụ thể)",
    },
    assigned_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: "ID người được giao phó",
    },
    assigned_to_technician_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: "ID kỹ thuật viên thực hiện",
    },
    created_by_sales_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: "ID nhân viên kinh doanh tạo",
    },
    created_by: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: "ID người tạo công việc",
    },
    priority: {
      type: Sequelize.ENUM("low", "medium", "high", "urgent"),
      defaultValue: 'medium',
      comment: "Mức ưu tiên công việc",
    },
    status: {
      type: Sequelize.ENUM("pending", "assigned", "in_progress", "completed", "on_hold", "cancelled"),
      defaultValue: 'pending',
      comment: "Trạng thái công việc",
    },
    service_type: {
      type: Sequelize.STRING(100),
      comment: "Loại dịch vụ cung cấp",
    },
    due_date: {
      type: Sequelize.DATE,
      comment: "Ngày hạn chót hoàn thành",
    },
    created_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: "Ngày tạo công việc",
    },
    completed_date: {
      type: Sequelize.DATE,
      comment: "Ngày hoàn thành thực tế",
    },
    location: {
      type: Sequelize.STRING(255),
      comment: "Tên địa điểm công việc",
    },
    customer_name: {
      type: Sequelize.STRING(255),
      comment: "Tên khách hàng",
    },
    customer_phone: {
      type: Sequelize.STRING(20),
      comment: "Số điện thoại khách hàng",
    },
    customer_address: {
      type: Sequelize.TEXT,
      comment: "Địa chỉ đầy đủ khách hàng",
    },
    location_lat: {
      type: Sequelize.DECIMAL(10, 8),
      comment: "Vĩ độ GPS địa điểm công việc",
    },
    location_lng: {
      type: Sequelize.DECIMAL(11, 8),
      comment: "Kinh độ GPS địa điểm công việc",
    },
    estimated_hours: {
      type: Sequelize.DECIMAL(5, 2),
      comment: "Giờ công ước tính",
    },
    actual_hours: {
      type: Sequelize.DECIMAL(5, 2),
      comment: "Giờ công thực tế đã dùng",
    },
    estimated_cost: {
      type: Sequelize.DECIMAL(10, 2),
      comment: "Chi phí ước tính",
    },
    actual_cost: {
      type: Sequelize.DECIMAL(10, 2),
      comment: "Chi phí thực tế",
    },
    payment_status: {
      type: Sequelize.ENUM("unpaid", "paid", "partial"),
      defaultValue: 'unpaid',
      comment: "Trạng thái thanh toán",
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      comment: "Công việc có hoạt động hay không",
    },
    expires_at: {
      type: Sequelize.DATE,
      comment: "Ngày hết hạn công việc",
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: "Thời gian tạo bản ghi (tự động)",
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: "Thời gian cập nhật bản ghi cuối cùng (tự động)",
    },
  });

  await queryInterface.addIndex('works', ['work_code'], { unique: true, name: 'uniq_works_work_code' });
  await queryInterface.addIndex('works', ['assigned_user_id']);
  await queryInterface.addIndex('works', ['assigned_to_technician_id']);
  await queryInterface.addIndex('works', ['created_by_sales_id']);
  await queryInterface.addIndex('works', ['status']);
  await queryInterface.addIndex('works', ['priority']);
  await queryInterface.addIndex('works', ['due_date']);
  await queryInterface.addIndex('works', ['required_date']);
  await queryInterface.addIndex('works', ['timeSlot']);
  await queryInterface.addIndex('works', ['category_id']);
  await queryInterface.addIndex('works', ['project_id']);
  await queryInterface.addIndex('works', ['payment_status']);
  await queryInterface.addIndex('works', ['created_date']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('works');
}
