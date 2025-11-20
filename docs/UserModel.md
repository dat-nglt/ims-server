# Mô tả chi tiết Model User

## Tổng quan
Model User lưu trữ thông tin người dùng trong hệ thống IMS, bao gồm thông tin cá nhân, công ty, vai trò, và trạng thái.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| employee_id | STRING(50) | Mã nhân viên duy nhất | Có | - | - | Có (unique) |
| name | STRING(255) | Tên đầy đủ | Có | - | - | - |
| position | STRING(100) | Vị trí công việc | Có | - | - | - |
| avatar_url | TEXT | URL ảnh đại diện | Không | - | - | - |
| phone | STRING(20) | Số điện thoại | Không | - | - | - |
| email | STRING(255) | Email duy nhất | Không | - | - | Có (unique) |
| status | STRING(50) | Trạng thái (active, inactive, suspended) | Không | 'active' | - | - |
| role_id | INTEGER | ID vai trò | Không | - | Tham chiếu đến `roles.id` | - |
| department | STRING(100) | Phòng ban | Không | - | - | Có |
| manager_id | INTEGER | ID người quản lý | Không | - | Tham chiếu đến `users.id` | - |
| is_active | BOOLEAN | Tài khoản hoạt động | Không | true | - | Có |
| last_login | DATE | Thời gian đăng nhập cuối | Không | - | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |
| updated_at | DATE | Thời gian cập nhật | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Tạo người dùng**: Admin tạo tài khoản với `employee_id`, `name`, `email`, `role_id`, `department`, và `manager_id`.
2. **Cập nhật thông tin**: Người dùng cập nhật `avatar_url`, `phone`, `position`; Admin thay đổi `status`, `role_id`, `department`.
3. **Quản lý trạng thái**: Đăng nhập cập nhật `last_login`; Tạm ngừng tài khoản đặt `is_active = false`.
4. **Sử dụng**: Truy vấn theo `role_id` để phân quyền, theo `department` để báo cáo, theo `manager_id` để cấu trúc tổ chức.
5. **Luồng dữ liệu**: Đăng ký → Phân vai trò → Cập nhật hồ sơ → Sử dụng cho phân công công việc và quản lý.

## Quan hệ (Associations)
- BelongsTo Role (qua role_id, as 'role')
- BelongsTo User (qua manager_id, as 'manager')
- HasMany Work (qua assigned_user_id, as 'assignedWorks')
- HasMany Work (qua assigned_to_technician_id, as 'technicianWorks')
- HasMany Work (qua created_by_sales_id, as 'salesWorks')
