"use strict";

/**
 * Model User (Người dùng)
 *
 * Đại diện cho bảng users với tất cả thông tin người dùng:
 * - Thông tin cá nhân: tên, email, điện thoại
 * - Thông tin công ty: vị trí, phòng ban, quản lý
 *
 * - Vai trò: tham chiếu đến bảng roles
 * - Trạng thái: active, inactive, suspended
 *
 * Note: Không sử dụng unique constraints vì hệ thống thực hiện soft delete
 */
export default (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            // ID: khóa chính, tự động tăng
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            // Mã nhân viên: không được null (validation trong service)
            employee_id: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: "Mã nhân viên (vd: EMP001)",
            },
            // Tên đầy đủ
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: "Tên đầy đủ của nhân viên",
            },
            // Vị trí công việc
            position: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: "Vị trí công việc (vd: Kỹ Sư, Quản Lý)",
            },
            // URL ảnh đại diện
            avatar_url: {
                type: DataTypes.TEXT,
                comment: "URL ảnh đại diện người dùng",
            },
            // Số điện thoại
            phone: {
                type: DataTypes.STRING(20),
                allowNull: true, // Cho phép null cho Zalo users
                validate: {
                    is: /^\+?[0-9\-\s]+$/i, // Regex cho số điện thoại
                },
                comment: "Số điện thoại liên lạc",
            },
            // Email: với validation
            email: {
                type: DataTypes.STRING(255),
                allowNull: true, // Cho phép null cho Zalo users
                validate: {
                    isEmail: true,
                },
                comment: "Email của người dùng",
            },
            // Mật khẩu: hash bcrypt
            password: {
                type: DataTypes.STRING(255),
                allowNull: true, // Cho phép null nếu đăng nhập qua Zalo
                comment: "Mật khẩu đã hash",
            },
            // Zalo ID: cho đăng nhập qua Zalo Mini App
            zalo_id: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "Zalo ID của người dùng",
            },
            // Trạng thái: active, inactive, suspended
            status: {
                type: DataTypes.STRING(50),
                defaultValue: "active",
                comment: "Trạng thái: active, inactive, suspended",
            },
            // Phòng ban
            department: {
                type: DataTypes.STRING(100),
                comment: "Phòng ban (vd: IT, Sales, Operations)",
            },
            // ID của người quản lý (tự tham chiếu)
            manager_id: {
                type: DataTypes.INTEGER,
                comment: "ID của người quản lý trực tiếp",
            },
            // Trạng thái hoạt động
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                comment: "Tài khoản có hoạt động hay không",
            },
            // Trạng thái phê duyệt
            approved: {
                type: DataTypes.ENUM('pending', 'approved', 'rejected'),
                defaultValue: 'pending',
            },
            // Thời gian đăng nhập lần cuối
            last_login: {
                type: DataTypes.DATE,
                comment: "Thời điểm đăng nhập lần cuối",
            },
            // Timestamp tạo bản ghi
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                comment: "Thời điểm tạo bản ghi",
            },
            // Timestamp cập nhật bản ghi
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                comment: "Thời điểm cập nhật bản ghi lần cuối",
            },
        },
        {
            tableName: "users",
            timestamps: false, // Quản lý thủ công created_at, updated_at
            indexes: [
                { fields: ["employee_id"] },
                { fields: ["email"] },
                { fields: ["department"] },
                { fields: ["is_active"] },
                { fields: ["manager_id"] }, // Thêm index cho manager_id
            ],
        }
    );

    // Định nghĩa các mối quan hệ
    User.associate = (models) => {
        // === QUẢN LÝ QUYỀN HẠN (Mới thêm) ===
        // 1 User có nhiều Role thông qua bảng UserRoles
        User.hasMany(models.UserRoles, {
            foreignKey: "user_id",
            as: "userRoles",
        });

        // === CÁC QUAN HỆ KHÁC ===
        User.belongsTo(User, {
            as: "manager",
            foreignKey: "manager_id",
        });

        // Một User có nhiều công việc được giao
        User.hasMany(models.Work, {
            foreignKey: "assigned_user_id",
            as: "assignedWorks",
        });

        // Một User (Kỹ thuật viên) có nhiều công việc được phân công
        User.hasMany(models.Work, {
            foreignKey: "assigned_to_technician_id",
            as: "technicianWorks",
        });

        // Một User (Sales) tạo nhiều công việc
        User.hasMany(models.Work, {
            foreignKey: "created_by_sales_id",
            as: "salesWorks",
        });

        // Một User tạo nhiều công việc
        User.hasMany(models.Work, {
            foreignKey: "created_by",
            as: "createdWorks",
        });

        // Các associations bổ sung
        User.hasMany(models.WorkReport, {
            foreignKey: "reported_by",
            as: "reports",
        });

        User.hasMany(models.WorkAssignment, {
            foreignKey: "technician_id",
            as: "assignments",
        });

        User.hasMany(models.WorkAssignment, {
            foreignKey: "assigned_by",
            as: "assignedByMe",
        });

        User.hasMany(models.Attendance, {
            foreignKey: "user_id",
            as: "attendances",
        });

        User.hasMany(models.TechnicianSkill, {
            foreignKey: "technician_id",
            as: "skills",
        });

        User.hasOne(models.EmployeeProfile, {
            foreignKey: "user_id",
            as: "profile",
        });

        User.hasMany(models.SalesReportDaily, {
            foreignKey: "sales_person_id",
            as: "salesReports",
        });

        // Removed PerformanceMetric and DashboardMetric associations - data calculated from other models

        User.hasMany(models.Notification, {
            foreignKey: "user_id",
            as: "notifications",
        });

        User.hasMany(models.Attachment, {
            foreignKey: "uploaded_by",
            as: "uploadedAttachments",
        });

        User.hasMany(models.WorkHistory, {
            foreignKey: "changed_by",
            as: "workHistoryChanges",
        });

        User.hasMany(models.SystemConfig, {
            foreignKey: "updated_by",
            as: "configUpdates",
        });
    };

    return User;
};
