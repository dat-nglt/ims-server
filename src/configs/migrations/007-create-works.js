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
      allowNull: false,
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
      allowNull: false,
      comment: "Mô tả chi tiết công việc",
    },
    // Ghi chú công việc
    notes: {
      type: Sequelize.TEXT,
      comment: "Ghi chú của công việc",
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
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

    created_by_sales_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: "ID nhân viên kinh doanh tạo",
    },
    created_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
      allowNull: false,
      defaultValue: 'Công việc dịch vụ',
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
      allowNull: false,
      comment: "Tên địa điểm công việc",
    },
    customer_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "Tên khách hàng",
    },
    customer_phone: {
      type: Sequelize.STRING(20),
      allowNull: false,
      comment: "Số điện thoại khách hàng",
    },
    customer_address: {
      type: Sequelize.TEXT,
      allowNull: false,
      comment: "Địa chỉ đầy đủ khách hàng",
    },
    location_lat: {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: false,
      comment: "Vĩ độ GPS địa điểm công việc",
    },
    location_lng: {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: false,
      comment: "Kinh độ GPS địa điểm công việc",
    },
    estimated_hours: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      comment: "Giờ công ước tính",
    },
    actual_hours: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      comment: "Giờ công thực tế đã dùng",
    },
    estimated_cost: {
      type: Sequelize.DECIMAL(13, 2),
      allowNull: false,
      comment: "Chi phí ước tính",
    },
    actual_cost: {
      type: Sequelize.DECIMAL(13, 2),
      allowNull: true,
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

  // DB-level CHECK constraints to mirror model validations (lat/lng and numeric ranges)
  // Note: may vary by dialect; these are standard CHECK constraints (Postgres/MySQL support)
  await queryInterface.sequelize.query(
    `ALTER TABLE works ADD CONSTRAINT chk_works_location_lat CHECK (location_lat >= -90 AND location_lat <= 90);`
  );
  await queryInterface.sequelize.query(
    `ALTER TABLE works ADD CONSTRAINT chk_works_location_lng CHECK (location_lng >= -180 AND location_lng <= 180);`
  );
  await queryInterface.sequelize.query(
    `ALTER TABLE works ADD CONSTRAINT chk_works_estimated_hours CHECK (estimated_hours >= 0 AND estimated_hours <= 999.99);`
  );
  await queryInterface.sequelize.query(
    `ALTER TABLE works ADD CONSTRAINT chk_works_estimated_cost CHECK (estimated_cost >= 0 AND estimated_cost <= 9999999.99);`
  );
}


export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('works');
}
