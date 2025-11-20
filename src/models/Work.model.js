'use strict';

/**
 * Model Work (Công việc)
 * 
 * Bảng chính lưu trữ tất cả công việc:
 * - Thông tin cơ bản: mã, tiêu đề, mô tả
 * - Phân công: người giao, kỹ thuật viên
 * - Chi phí: ước tính, thực tế
 * - Địa điểm: tọa độ GPS, địa chỉ
 * - Trạng thái & thanh toán
 */
export default (sequelize, DataTypes) => {
  const Work = sequelize.define(
    'Work',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Mã công việc: duy nhất
      work_code: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        comment: 'Mã công việc duy nhất (vd: WK-001)',
      },
      // Tiêu đề công việc
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Tiêu đề công việc',
      },
      // Mô tả chi tiết
      description: {
        type: DataTypes.TEXT,
        comment: 'Mô tả chi tiết công việc',
      },
      // Danh mục công việc (FK)
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'work_categories',
          key: 'id',
        },
        comment: 'ID danh mục công việc',
      },
      // Người được giao phó (FK)
      assigned_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'ID người được giao phó',
      },
      // Kỹ thuật viên thực hiện (FK)
      assigned_to_technician_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'ID kỹ thuật viên thực hiện',
      },
      // Nhân viên kinh doanh tạo (FK)
      created_by_sales_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'ID nhân viên kinh doanh tạo',
      },
      // Người tạo (FK)
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'ID người tạo công việc',
      },
      // Mức độ ưu tiên
      priority: {
        type: DataTypes.STRING(50),
        defaultValue: 'medium',
        comment: 'Mức ưu tiên: low, medium, high, urgent',
      },
      // Trạng thái
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending',
        comment: 'Trạng thái: pending, assigned, in_progress, completed, cancelled',
      },
      // Loại dịch vụ
      service_type: {
        type: DataTypes.STRING(100),
        comment: 'Loại dịch vụ cung cấp',
      },
      // Ngày hạn chót
      due_date: {
        type: DataTypes.DATE,
        comment: 'Ngày hạn chót hoàn thành',
      },
      // Ngày tạo
      created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Ngày tạo công việc',
      },
      // Ngày hoàn thành
      completed_date: {
        type: DataTypes.DATE,
        comment: 'Ngày hoàn thành thực tế',
      },
      // Địa điểm công việc
      location: {
        type: DataTypes.STRING(255),
        comment: 'Tên địa điểm công việc',
      },
      // Tên khách hàng
      customer_name: {
        type: DataTypes.STRING(255),
        comment: 'Tên khách hàng',
      },
      // Số điện thoại khách hàng
      customer_phone: {
        type: DataTypes.STRING(20),
        comment: 'Số điện thoại khách hàng',
      },
      // Địa chỉ khách hàng
      customer_address: {
        type: DataTypes.TEXT,
        comment: 'Địa chỉ đầy đủ khách hàng',
      },
      // Vĩ độ (latitude)
      location_lat: {
        type: DataTypes.DECIMAL(10, 8),
        validate: {
          min: -90,
          max: 90,
        },
        comment: 'Vĩ độ GPS địa điểm công việc',
      },
      // Kinh độ (longitude)
      location_lng: {
        type: DataTypes.DECIMAL(11, 8),
        validate: {
          min: -180,
          max: 180,
        },
        comment: 'Kinh độ GPS địa điểm công việc',
      },
      // Giờ ước tính
      estimated_hours: {
        type: DataTypes.DECIMAL(5, 2),
        comment: 'Giờ công ước tính',
      },
      // Giờ thực tế
      actual_hours: {
        type: DataTypes.DECIMAL(5, 2),
        comment: 'Giờ công thực tế đã dùng',
      },
      // Chi phí ước tính
      estimated_cost: {
        type: DataTypes.DECIMAL(10, 2),
        comment: 'Chi phí ước tính',
      },
      // Chi phí thực tế
      actual_cost: {
        type: DataTypes.DECIMAL(10, 2),
        comment: 'Chi phí thực tế',
      },
      // Trạng thái thanh toán
      payment_status: {
        type: DataTypes.STRING(50),
        defaultValue: 'unpaid',
        comment: 'Trạng thái thanh toán: unpaid, paid, partial',
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
      tableName: 'works',
      timestamps: false,
      indexes: [
        { fields: ['work_code'] },
        { fields: ['assigned_user_id'] },
        { fields: ['assigned_to_technician_id'] },
        { fields: ['created_by_sales_id'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['due_date'] },
        { fields: ['category_id'] },
        { fields: ['payment_status'] },
        { fields: ['created_date'] },
      ],
    }
  );

  // Định nghĩa các mối quan hệ
  Work.associate = (models) => {
    // Thuộc danh mục
    Work.belongsTo(models.WorkCategory, {
      foreignKey: 'category_id',
      as: 'category',
    });

    // Người được giao
    Work.belongsTo(models.User, {
      foreignKey: 'assigned_user_id',
      as: 'assignedUser',
    });

    // Kỹ thuật viên thực hiện
    Work.belongsTo(models.User, {
      foreignKey: 'assigned_to_technician_id',
      as: 'technician',
    });

    // Nhân viên kinh doanh tạo
    Work.belongsTo(models.User, {
      foreignKey: 'created_by_sales_id',
      as: 'salesPerson',
    });

    // Người tạo
    Work.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator',
    });

    // Một công việc có nhiều báo cáo
    Work.hasMany(models.WorkReport, {
      foreignKey: 'work_id',
      as: 'reports',
    });

    // Một công việc có nhiều phân công
    Work.hasMany(models.WorkAssignment, {
      foreignKey: 'work_id',
      as: 'assignments',
    });

    // Một công việc có nhiều check-in
    Work.hasMany(models.CheckIn, {
      foreignKey: 'work_id',
      as: 'checkIns',
    });

    // Một công việc có nhiều tập tin đính kèm
    Work.hasMany(models.Attachment, {
      foreignKey: 'work_id',
      as: 'attachments',
    });

    // Một công việc có nhiều lịch sử thay đổi
    Work.hasMany(models.WorkHistory, {
      foreignKey: 'work_id',
      as: 'histories',
    });

    // Một công việc có nhiều lịch sử chi tiết
    Work.hasMany(models.WorkHistoryDetailed, {
      foreignKey: 'work_id',
      as: 'detailedHistories',
    });

    // Một công việc có nhiều quy trình phê duyệt
    Work.hasMany(models.ApprovalWorkflow, {
      foreignKey: 'work_id',
      as: 'approvalWorkflows',
    });

    // Một công việc có nhiều thông báo
    Work.hasMany(models.Notification, {
      foreignKey: 'related_work_id',
      as: 'notifications',
    });
  };

  return Work;
};