# Mô tả chi tiết Model WorkHistory

## Tổng quan
Model WorkHistory lưu trữ lịch sử thay đổi trạng thái của công việc, cho phép theo dõi và audit các cập nhật.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| work_id | INTEGER | ID công việc | Có | - | Tham chiếu đến `works.id` | Có |
| old_status | STRING(50) | Trạng thái cũ | Không | - | - | - |
| new_status | STRING(50) | Trạng thái mới | Không | - | - | - |
| changed_by | INTEGER | ID người thay đổi | Không | - | Tham chiếu đến `users.id` | - |
| changed_at | DATE | Thời gian thay đổi | Không | NOW | - | Có |
| notes | TEXT | Ghi chú | Không | - | - | - |

## Luồng hoạt động của dữ liệu

1. **Ghi lịch sử**: Khi trạng thái Work thay đổi, tạo bản ghi mới với `old_status`, `new_status`, `changed_by`, `changed_at`.
2. **Theo dõi**: Lưu trữ để audit, hiển thị timeline thay đổi trong UI.
3. **Truy vấn**: Sử dụng để báo cáo lịch sử công việc, kiểm tra trách nhiệm.
4. **Luồng dữ liệu**: Thay đổi trạng thái → Ghi lịch sử → Lưu trữ DB → Hiển thị audit trail.

## Quan hệ (Associations)
- BelongsTo Work (qua work_id, as 'work')
- BelongsTo User (qua changed_by, as 'changedByUser')
