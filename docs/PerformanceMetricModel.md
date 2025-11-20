# Mô tả chi tiết Model PerformanceMetric

## Tổng quan
Model PerformanceMetric lưu trữ thống kê hiệu suất hàng tháng của nhân viên, bao gồm số công việc hoàn thành, tỷ lệ đúng hạn, điểm chất lượng, v.v.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| user_id | INTEGER | ID người dùng | Có | - | Tham chiếu đến `users.id` | Có (composite với month) |
| month | DATE | Tháng thống kê | Có | - | - | Có (composite với user_id) |
| works_completed | INTEGER | Số công việc hoàn thành | Không | 0 | - | - |
| works_total | INTEGER | Tổng số công việc | Không | 0 | - | - |
| on_time_percentage | DECIMAL(5,2) | Phần trăm hoàn thành đúng hạn | Không | - | - | - |
| quality_score | DECIMAL(3,2) | Điểm chất lượng | Không | - | - | - |
| average_completion_time | DECIMAL(8,2) | Thời gian hoàn thành trung bình | Không | - | - | - |
| reports_submitted | INTEGER | Số báo cáo đã gửi | Không | 0 | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Tính toán hàng tháng**: Cuối mỗi tháng, hệ thống tính toán số liệu từ CheckIn, Work, WorkReport (e.g., `works_completed` từ số Work hoàn thành, `on_time_percentage` từ tỷ lệ đúng hạn).
2. **Tạo bản ghi**: Chèn bản ghi mới với `user_id`, `month`, và các giá trị tính toán.
3. **Cập nhật**: Nếu cần điều chỉnh, cập nhật các trường như `quality_score` từ đánh giá thủ công.
4. **Truy vấn**: Sử dụng cho báo cáo hiệu suất, dashboard, hoặc quyết định lương thưởng.
5. **Luồng dữ liệu**: Thu thập dữ liệu → Tính toán định kỳ → Lưu trữ DB → Hiển thị báo cáo → Sử dụng cho quản lý.

## Quan hệ (Associations)
- BelongsTo User (qua user_id)
