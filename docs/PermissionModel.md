# Mô tả chi tiết Model Permission

## Tổng quan
Model Permission lưu trữ các quyền hạn có sẵn trong hệ thống, cho phép quản lý và gán quyền cho người dùng.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| name | STRING(100) | Tên quyền hạn duy nhất | Có | - | - | Có (unique) |
| description | TEXT | Mô tả quyền hạn | Không | - | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |
| updated_at | DATE | Thời gian cập nhật | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Tạo quyền**: Admin tạo bản ghi với `name` (e.g., 'edit_work'), `description`.
2. **Gán quyền**: Người dùng được gán `permission_id` trong bảng user_roles_permissions.
3. **Cập nhật**: Thay đổi `description` hoặc thêm quyền mới.
4. **Sử dụng**: Truy vấn quyền để kiểm tra danh sách quyền có sẵn, hiển thị trong UI quản lý.
5. **Luồng dữ liệu**: Định nghĩa quyền → Gán cho người dùng → Sử dụng cho kiểm tra quyền.

## Quan hệ (Associations)
- HasMany UserRolePermission (qua permission_id, as 'userRolePermissions')
