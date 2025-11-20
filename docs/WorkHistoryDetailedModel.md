# Mô tả chi tiết Model WorkHistoryDetailed

## Tổng quan
Model WorkHistoryDetailed lưu trữ lịch sử thay đổi chi tiết của các entity liên quan đến công việc, cho phép audit đầy đủ với giá trị cũ/mới.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| work_id | INTEGER | ID công việc | Không | - | Tham chiếu đến `works.id` | Có |
| entity_type | STRING(50) | Loại entity (work, report, assignment...) | Không | - | - | Có |
| entity_id | INTEGER | ID entity | Không | - | - | - |
| action | STRING(50) | Hành động (create, update, delete) | Không | - | - | - |
| changed_by | INTEGER | ID người thay đổi | Có | - | Tham chiếu đến `users.id` | Có |
| old_values | JSONB | Giá trị cũ | Không | - | - | - |
| new_values | JSONB | Giá trị mới | Không | - | - | - |
| ip_address | STRING(45) | IP address | Không | - | - | - |
| user_agent | TEXT | User agent | Không | - | - | - |
| changed_at | DATE | Thời gian thay đổi | Không | NOW | - | Có |

## Luồng hoạt động của dữ liệu

1. **Ghi lịch sử**: Khi entity thay đổi, tạo bản ghi với `entity_type`, `entity_id`, `action`, `old_values`, `new_values`, `changed_by`, `ip_address`, `user_agent`.
2. **Audit trail**: Lưu trữ để theo dõi chi tiết thay đổi, phục hồi dữ liệu, hoặc báo cáo.
3. **Truy vấn**: Sử dụng để xem lịch sử của một entity cụ thể, theo người dùng hoặc thời gian.
4. **Luồng dữ liệu**: Thay đổi entity → Ghi chi tiết lịch sử → Lưu trữ DB → Hiển thị audit log.

## Quan hệ (Associations)
- BelongsTo Work (qua work_id, as 'work')
- BelongsTo User (qua changed_by, as 'changedByUser')
