"use strict";

/**
 * Model Work (Công việc)
 *
 * Bảng chính lưu trữ tất cả công việc:
 * - Thông tin cơ bản: mã, tiêu đề, mô tả
 * - Phân công: người giao, kỹ thuật viên, dự án liên quan
 * - Chi phí: ước tính, thực tế
 * - Địa điểm: tọa độ GPS, địa chỉ
 * - Trạng thái & thanh toán
 * - Thời gian: tạo, cập nhật, hoàn thành
 */
export default (sequelize, DataTypes) => {
  const Work = sequelize.define(
    "Work",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Mã công việc: chuỗi hệ thống (vd: lqd_work_1766193537920296)
      work_code: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          notEmpty: { msg: "work_code không được để trống" },
          len: { args: [1, 64], msg: "work_code tối đa 64 ký tự" },
        },
        comment: "Mã công việc duy nhất (chuỗi do hệ thống tạo)",
      },
      // Tiêu đề công việc
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Tiêu đề công việc không được để trống" },
          len: { args: [1, 255], msg: "Tiêu đề tối đa 255 ký tự" },
        },
        comment: "Tiêu đề công việc",
      },
      // Mô tả chi tiết
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Mô tả công việc không được để trống" },
        },
        comment: "Mô tả chi tiết công việc",
      },
      // Ghi chú
      notes: {
        type: DataTypes.TEXT,
        comment: "Ghi chú của công việc",
      },
      // Danh mục công việc (FK)
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Danh mục công việc không được để trống" },
        },
        references: {
          model: "work_categories",
          key: "id",
        },
        comment: "ID danh mục công việc",
      },
      // Dự án liên quan (FK)
      project_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "projects",
          key: "id",
        },
        comment: "ID dự án liên quan (nếu công việc thuộc một dự án cụ thể)",
      },
      // Người được giao phó (FK)
      assigned_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Người được giao phó không được để trống",
          },
        },
        references: {
          model: "users",
          key: "id",
        },
        comment: "ID người được giao phó",
      },
      // Nhân viên kinh doanh tạo (FK)
      created_by_sales_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Nhân viên kinh doanh tạo không được để trống",
          },
        },
        references: {
          model: "users",
          key: "id",
        },
        comment: "ID nhân viên kinh doanh tạo",
      },
      // Người tạo (FK)
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Người tạo không được để trống" },
        },
        references: {
          model: "users",
          key: "id",
        },
        comment: "ID người tạo công việc",
      },
      // Mức độ ưu tiên
      priority: {
        type: DataTypes.ENUM("low", "medium", "high", "urgent"),
        defaultValue: "medium",
        validate: {
          isIn: {
            args: [["low", "medium", "high", "urgent"]],
            msg: "Ưu tiên phải là: low, medium, high hoặc urgent",
          },
        },
      },
      // Trạng thái
      status: {
        type: DataTypes.ENUM("pending", "assigned", "in_progress", "completed", "on_hold", "cancelled"),
        defaultValue: "pending",
        validate: {
          isIn: {
            args: [["pending", "assigned", "in_progress", "completed", "on_hold", "cancelled"]],
            msg: "Trạng thái không hợp lệ",
          },
        },
      },
      // Loại dịch vụ
      service_type: {
        type: DataTypes.STRING(100),
        defaultValue: "Công việc dịch vụ",
        comment: "Loại dịch vụ cung cấp",
      },
      // Ngày hạn chót
      due_date: {
        type: DataTypes.DATE,
        comment: "Ngày hạn chót hoàn thành",
      },
      // Ngày yêu cầu thực hiện (dùng cho lịch/scheduling)
      required_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Ngày yêu cầu thực hiện không được để trống" },
        },
        comment: "Ngày yêu cầu thực hiện công việc (date only)",
      },
      // Giờ yêu cầu (HH) — lưu ở dạng string để giữ leading zero nếu cần
      required_time_hour: {
        type: DataTypes.STRING(2),
        allowNull: true,
        comment: "Giờ yêu cầu (HH)",
        validate: {
          isValidHour(value) {
            if (value !== null && value !== undefined && value !== "") {
              const s = String(value);
              if (!/^\d{1,2}$/.test(s)) throw new Error("Giờ yêu cầu phải có định dạng HH");
              const num = parseInt(s, 10);
              if (num < 0 || num > 23) throw new Error("Giờ yêu cầu phải từ 0 đến 23");
            }
          },
        },
      },
      // Phút yêu cầu (MM)
      required_time_minute: {
        type: DataTypes.STRING(2),
        allowNull: true,
        comment: "Phút yêu cầu (MM)",
        validate: {
          isValidMinute(value) {
            if (value !== null && value !== undefined && value !== "") {
              const s = String(value);
              if (!/^\d{1,2}$/.test(s)) throw new Error("Phút yêu cầu phải có định dạng MM");
              const num = parseInt(s, 10);
              if (num < 0 || num > 59) throw new Error("Phút yêu cầu phải từ 0 đến 59");
            }
          },
        },
      },
      // Time slot (số nguyên, có thể là giờ bucket như 8, 9, 10...)
      timeSlot: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Time slot index / hour bucket để sắp xếp",
      },

      // Ngày tạo
      created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: "Ngày tạo công việc",
      },
      // Ngày hoàn thành
      completed_date: {
        type: DataTypes.DATE,
        comment: "Ngày hoàn thành thực tế",
      },
      // Địa điểm công việc
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Địa điểm công việc không được để trống" },
        },
        comment: "Tên địa điểm công việc",
      },
      // Tên khách hàng
      customer_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Tên khách hàng không được để trống" },
        },
        comment: "Tên khách hàng",
      },
      // Số điện thoại khách hàng
      customer_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          len: { args: [0, 20], msg: "Số điện thoại khách hàng tối đa 20 ký tự" },
          notEmpty: { msg: "Số điện thoại khách hàng không được để trống" },
        },
        comment: "Số điện thoại khách hàng",
      },
      // Địa chỉ khách hàng
      customer_address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Địa chỉ khách hàng không được để trống" },
        },
        comment: "Địa chỉ đầy đủ khách hàng",
      },
      // Nếu công việc gắn với bản ghi khách hàng (nullable)
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "customers",
          key: "id",
        },
        comment: "ID khách hàng (nullable) liên kết với bảng customers",
      },
      // Vĩ độ (latitude)
      location_lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
          notEmpty: { msg: "Vĩ độ không được để trống" },
        },
        comment: "Vĩ độ GPS địa điểm công việc",
      },
      // Kinh độ (longitude)
      location_lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
          notEmpty: { msg: "Kinh độ không được để trống" },
        },
        comment: "Kinh độ GPS địa điểm công việc",
      },
      // Giờ ước tính
      estimated_hours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: "Giờ công ước tính",
        validate: {
          min: { args: [0], msg: "Giờ ước tính phải >= 0" },
          max: { args: [999.99], msg: "Giờ ước tính tối đa 999.99" },
          notEmpty: { msg: "Giờ ước tính không được để trống" },
        },
      },
      // Giờ thực tế
      actual_hours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: "Giờ công thực tế đã dùng",
        validate: {
          min: { args: [0], msg: "Giờ thực tế phải >= 0" },
          max: { args: [999.99], msg: "Giờ thực tế tối đa 999.99" },
        },
      },
      // Chi phí ước tính
      estimated_cost: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        comment: "Chi phí ước tính",
        validate: {
          min: { args: [0], msg: "Chi phí ước tính phải >= 0" },
          max: { args: [9999999.99], msg: "Chi phí ước tính tối đa 9999999.99" },
          notEmpty: { msg: "Chi phí ước tính không được để trống" },
        },
      },
      // Chi phí thực tế
      actual_cost: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        comment: "Chi phí thực tế",
        validate: {
          min: { args: [0], msg: "Chi phí thực tế phải >= 0" },
          max: { args: [9999999.99], msg: "Chi phí thực tế tối đa 9999999.99" },
        },
      },

      // Trạng thái thanh toán
      payment_status: {
        type: DataTypes.ENUM("unpaid", "paid", "partial"),
        defaultValue: "unpaid",
        validate: {
          isIn: {
            args: [["unpaid", "paid", "partial"]],
            msg: "Trạng thái thanh toán không hợp lệ",
          },
        },
      },

      // Trạng thái hoạt động
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: "Công việc có hoạt động hay không",
      },
      // Ngày hết hạn
      expires_at: {
        type: DataTypes.DATE,
        comment: "Ngày hết hạn công việc",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: "Thời gian tạo bản ghi (tự động)",
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: "Thời gian cập nhật bản ghi cuối cùng (tự động)",
      },
    },
    {
      tableName: "works",
      timestamps: false,
      indexes: [
        { fields: ["work_code"], unique: true, name: "uniq_works_work_code" },
        { fields: ["assigned_user_id"] },
        { fields: ["created_by_sales_id"] },
        { fields: ["status"] },
        { fields: ["priority"] },
        { fields: ["due_date"] },
        { fields: ["required_date"] },
        { fields: ["timeSlot"] },
        { fields: ["category_id"] },
        { fields: ["project_id"] },
        { fields: ["payment_status"] },
        { fields: ["created_date"] },
      ],
    }
  );

  // Normalize some fields and ensure consistent formats before validation
  Work.beforeValidate((work) => {
    if (work.required_time_hour !== undefined && work.required_time_hour !== null && work.required_time_hour !== "") {
      const n = parseInt(String(work.required_time_hour), 10);
      if (!isNaN(n)) work.required_time_hour = String(n).padStart(2, "0");
    }

    if (
      work.required_time_minute !== undefined &&
      work.required_time_minute !== null &&
      work.required_time_minute !== ""
    ) {
      const n = parseInt(String(work.required_time_minute), 10);
      if (!isNaN(n)) work.required_time_minute = String(n).padStart(2, "0");
    }

    // Coerce decimals to string-compatible format if provided
    ["estimated_hours", "actual_hours", "estimated_cost", "actual_cost"].forEach((field) => {
      if (work[field] !== undefined && work[field] !== null && work[field] !== "") {
        const num = Number(work[field]);
        if (!isNaN(num)) work[field] = num;
      }
    });
  });

  // Định nghĩa các mối quan hệ
  Work.associate = (models) => {
    // Thuộc danh mục
    Work.belongsTo(models.WorkCategory, {
      foreignKey: "category_id",
      as: "category",
    });

    // Thuộc dự án
    Work.belongsTo(models.Project, {
      foreignKey: "project_id",
      as: "project",
    });

    // Người được giao
    Work.belongsTo(models.User, {
      foreignKey: "assigned_user_id",
      as: "assignedUser",
    });

    // Nhân viên kinh doanh tạo
    Work.belongsTo(models.User, {
      foreignKey: "created_by_sales_id",
      as: "salesPerson",
    });

    // Người tạo
    Work.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });

    // Nếu liên kết với bản ghi khách hàng
    Work.belongsTo(models.Customer, {
      foreignKey: "customer_id",
      as: "customer",
    });

    // Một công việc có nhiều báo cáo
    Work.hasMany(models.WorkReport, {
      foreignKey: "work_id",
      as: "reports",
    });

    // Một công việc có nhiều phân công
    Work.hasMany(models.WorkAssignment, {
      foreignKey: "work_id",
      as: "assignments",
    });

    // Một công việc có nhiều attendance
    Work.hasMany(models.Attendance, {
      foreignKey: "work_id",
      as: "attendances",
    });

    // Một công việc có nhiều tập tin đính kèm
    Work.hasMany(models.Attachment, {
      foreignKey: "work_id",
      as: "attachments",
    });

    // Một công việc có nhiều lịch sử thay đổi
    Work.hasMany(models.WorkHistory, {
      foreignKey: "work_id",
      as: "histories",
    });

    // Một công việc có nhiều thông báo
    Work.hasMany(models.Notification, {
      foreignKey: "related_work_id",
      as: "notifications",
    });
  };

  return Work;
};
