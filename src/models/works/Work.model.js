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
                comment: "Mã công việc duy nhất (chuỗi do hệ thống tạo)",
            },
            // Tiêu đề công việc
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: "Tiêu đề công việc",
            },
            // Mô tả chi tiết
            description: {
                type: DataTypes.TEXT,
                comment: "Mô tả chi tiết công việc",
            },
            // Danh mục công việc (FK)
            category_id: {
                type: DataTypes.INTEGER,
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
                comment:
                    "ID dự án liên quan (nếu công việc thuộc một dự án cụ thể)",
            },
            // Người được giao phó (FK)
            assigned_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                comment: "ID người được giao phó",
            },
            // Kỹ thuật viên thực hiện (FK)
            assigned_to_technician_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
                comment: "ID kỹ thuật viên thực hiện",
            },
            // Nhân viên kinh doanh tạo (FK)
            created_by_sales_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
                comment: "ID nhân viên kinh doanh tạo",
            },
            // Người tạo (FK)
            created_by: {
                type: DataTypes.INTEGER,
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
            },
            // Trạng thái
            status: {
                type: DataTypes.ENUM(
                    "pending",
                    "assigned",
                    "in_progress",
                    "completed",
                    "on_hold",
                    "cancelled"
                ),
                defaultValue: "pending",
            },
            // Loại dịch vụ
            service_type: {
                type: DataTypes.STRING(100),
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
                allowNull: true,
                comment: "Ngày yêu cầu thực hiện công việc (date only)",
            },
            // Giờ yêu cầu (HH) — lưu ở dạng string để giữ leading zero nếu cần
            required_time_hour: {
                type: DataTypes.STRING(2),
                allowNull: true,
                comment: "Giờ yêu cầu (HH)",
            },
            // Phút yêu cầu (MM)
            required_time_minute: {
                type: DataTypes.STRING(2),
                allowNull: true,
                comment: "Phút yêu cầu (MM)",
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
                comment: "Tên địa điểm công việc",
            },
            // Tên khách hàng
            customer_name: {
                type: DataTypes.STRING(255),
                comment: "Tên khách hàng",
            },
            // Số điện thoại khách hàng
            customer_phone: {
                type: DataTypes.STRING(20),
                comment: "Số điện thoại khách hàng",
            },
            // Địa chỉ khách hàng
            customer_address: {
                type: DataTypes.TEXT,
                comment: "Địa chỉ đầy đủ khách hàng",
            },
            // Nếu công việc gắn với bản ghi khách hàng (nullable)
            customer_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'customers',
                    key: 'id',
                },
                comment: 'ID khách hàng (nullable) liên kết với bảng customers',
            },
            // Vĩ độ (latitude)
            location_lat: {
                type: DataTypes.DECIMAL(10, 8),
                validate: {
                    min: -90,
                    max: 90,
                },
                comment: "Vĩ độ GPS địa điểm công việc",
            },
            // Kinh độ (longitude)
            location_lng: {
                type: DataTypes.DECIMAL(11, 8),
                validate: {
                    min: -180,
                    max: 180,
                },
                comment: "Kinh độ GPS địa điểm công việc",
            },
            // Giờ ước tính
            estimated_hours: {
                type: DataTypes.DECIMAL(5, 2),
                comment: "Giờ công ước tính",
            },
            // Giờ thực tế
            actual_hours: {
                type: DataTypes.DECIMAL(5, 2),
                comment: "Giờ công thực tế đã dùng",
            },
            // Chi phí ước tính
            estimated_cost: {
                type: DataTypes.DECIMAL(10, 2),
                comment: "Chi phí ước tính",
            },
            // Chi phí thực tế
            actual_cost: {
                type: DataTypes.DECIMAL(10, 2),
                comment: "Chi phí thực tế",
            },
            // Trạng thái thanh toán
            payment_status: {
                type: DataTypes.ENUM("unpaid", "paid", "partial"),
                defaultValue: "unpaid",
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
                { fields: ["assigned_to_technician_id"] },
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

        // Kỹ thuật viên thực hiện
        Work.belongsTo(models.User, {
            foreignKey: "assigned_to_technician_id",
            as: "technician",
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
