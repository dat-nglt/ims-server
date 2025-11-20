# Mô tả chi tiết Model UserRolePermission

## Tổng quan
Model UserRolePermission lưu trữ quyền hạn chi tiết của người dùng, cho phép kiểm soát truy cập cụ thể ngoài vai trò cơ bản.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| user_id | INTEGER | ID người dùng | Có | - | Tham chiếu đến `users.id` | Có |
| permission_id | INTEGER | ID quyền hạn | Có | - | Tham chiếu đến `permissions.id` | Có |
| is_granted | BOOLEAN | Được cấp quyền | Không | true | - | - |
| granted_by | INTEGER | ID người cấp quyền | Không | - | Tham chiếu đến `users.id` | - |
| granted_at | DATE | Thời gian cấp quyền | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Cấp quyền**: Admin tạo bản ghi với `user_id`, `permission_id`, `is_granted = true`, và `granted_by`.
2. **Kiểm tra quyền**: Hệ thống truy vấn theo `user_id` và `permission_id` để xác định quyền truy cập.
3. **Thu hồi quyền**: Cập nhật `is_granted = false` hoặc xóa bản ghi.
4. **Luồng dữ liệu**: Phân quyền → Lưu trữ DB → Kiểm tra khi truy cập → Cập nhật nếu cần.

## Quan hệ (Associations)
- BelongsTo User (qua user_id, as 'user')
- BelongsTo Permission (qua permission_id, as 'permission')
- BelongsTo User (qua granted_by, as 'grantedByUser')
