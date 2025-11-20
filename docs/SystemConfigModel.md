# Mô tả chi tiết Model SystemConfig

## Tổng quan
Model SystemConfig lưu trữ các cấu hình toàn hệ thống, cho phép quản lý động các thiết lập như giới hạn check-in, email templates, v.v.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| config_key | STRING(100) | Khóa cấu hình duy nhất | Có | - | - | Có (unique) |
| config_value | TEXT | Giá trị cấu hình | Không | - | - | - |
| config_type | STRING(50) | Loại dữ liệu (string, number, boolean...) | Không | - | - | - |
| description | TEXT | Mô tả cấu hình | Không | - | - | - |
| updated_by | INTEGER | ID người cập nhật | Không | - | Tham chiếu đến `users.id` | - |
| updated_at | DATE | Thời gian cập nhật | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Thiết lập cấu hình**: Admin tạo hoặc cập nhật bản ghi với `config_key` (e.g., 'check_in_radius'), `config_value` (e.g., '500'), `config_type` ('number'), và `description`.
2. **Sử dụng**: Ứng dụng truy xuất `config_value` theo `config_key` để áp dụng thiết lập (e.g., kiểm tra phạm vi check-in).
3. **Cập nhật**: Khi thay đổi, cập nhật `config_value`, `updated_by`, và `updated_at`.
4. **Luồng dữ liệu**: Admin nhập → Lưu trữ DB → Ứng dụng đọc động → Áp dụng cấu hình.

## Quan hệ (Associations)
- BelongsTo User (qua updated_by, as 'updatedByUser')
