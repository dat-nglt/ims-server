# Mô tả chi tiết Model Notification

## Tổng quan
Model Notification lưu trữ các thông báo cho người dùng, bao gồm tiêu đề, nội dung, loại, và trạng thái đọc.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| user_id | INTEGER | ID người dùng nhận thông báo | Có | - | Tham chiếu đến `users.id` | Có |
| title | STRING(255) | Tiêu đề thông báo | Có | - | - | - |
| message | TEXT | Nội dung chi tiết | Không | - | - | - |
| type | STRING(50) | Loại thông báo (work_assigned, report_approved, check_in_alert...) | Không | - | - | Có |
| related_work_id | INTEGER | ID công việc liên quan | Không | - | Tham chiếu đến `works.id` | - |
| is_read | BOOLEAN | Đã đọc thông báo | Không | false | - | Có |
| read_at | DATE | Thời điểm đọc thông báo | Không | - | - | - |
| action_url | STRING(255) | URL để xử lý hành động | Không | - | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Tạo thông báo**: Khi có sự kiện (e.g., công việc được giao, báo cáo được phê duyệt), hệ thống tạo bản ghi mới với `user_id`, `title`, `message`, `type`, và `related_work_id` nếu liên quan.
2. **Gửi thông báo**: Thông báo được gửi qua email/push notification, nhưng bản ghi DB lưu trữ để theo dõi.
3. **Đọc thông báo**: Khi người dùng đọc, cập nhật `is_read = true` và `read_at = NOW`.
4. **Quản lý**: Admin hoặc user có thể xóa thông báo cũ; truy vấn theo `user_id` và `is_read` để hiển thị danh sách.
5. **Luồng dữ liệu**: Sự kiện → Tạo bản ghi → Gửi thông báo → Người dùng tương tác (đọc/xóa) → Lưu trữ lịch sử.

## Quan hệ (Associations)
- BelongsTo User (qua user_id)
- BelongsTo Work (qua related_work_id)
