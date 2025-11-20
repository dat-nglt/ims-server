# Mô tả chi tiết Model WorkCategory

## Tổng quan
Model WorkCategory lưu trữ các danh mục công việc, phân loại thành "Công trình" và "Dịch vụ" để tổ chức và hiển thị công việc.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| name | ENUM('Công trình', 'Dịch vụ') | Tên danh mục duy nhất | Có | - | - | Có (unique) |
| description | TEXT | Mô tả chi tiết | Không | - | - | - |
| icon | STRING(50) | Tên icon từ thư viện | Không | - | - | - |
| color | STRING(7) | Mã màu hex | Không | - | - | - |
| is_active | BOOLEAN | Danh mục hoạt động | Không | true | - | Có |
| display_order | INTEGER | Thứ tự hiển thị | Không | 0 | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |
| updated_at | DATE | Thời gian cập nhật | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Tạo danh mục**: Admin tạo bản ghi với `name` (Công trình hoặc Dịch vụ), `description`, `icon`, `color`, `display_order`.
2. **Gán cho công việc**: Khi tạo Work, chọn `category_id` từ danh mục này.
3. **Hiển thị**: Sử dụng `is_active`, `display_order` để sắp xếp và lọc danh mục trong UI.
4. **Cập nhật**: Thay đổi `description`, `icon`, `color` để tùy chỉnh giao diện.
5. **Luồng dữ liệu**: Định nghĩa danh mục → Gán cho công việc → Hiển thị nhóm công việc.

## Quan hệ (Associations)
- HasMany Work (qua category_id, as 'works')
