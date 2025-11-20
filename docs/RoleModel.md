# Mô tả chi tiết Model Role

## Tổng quan
Model Role lưu trữ các vai trò trong hệ thống IMS, cho phép quản lý và phân quyền người dùng.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| name | STRING(50) | Tên vai trò duy nhất | Có | - | - | Có (unique) |
| description | TEXT | Mô tả vai trò | Không | - | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |
| updated_at | DATE | Thời gian cập nhật | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Tạo vai trò**: Admin tạo bản ghi với `name` (e.g., 'admin'), `description`.
2. **Gán vai trò**: Người dùng được gán `role_id` trong bảng users.
3. **Cập nhật**: Thay đổi `description` hoặc thêm vai trò mới.
4. **Sử dụng**: Truy vấn vai trò để kiểm tra quyền truy cập, hiển thị danh sách vai trò.
5. **Luồng dữ liệu**: Định nghĩa vai trò → Gán cho người dùng → Sử dụng cho phân quyền.

## Quan hệ (Associations)
- HasMany User (qua role_id, as 'users')
