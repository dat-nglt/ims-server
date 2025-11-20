# Mô tả chi tiết Model DashboardMetric

## Tổng quan
Model DashboardMetric lưu trữ các thống kê hàng ngày cho dashboard, bao gồm số liệu về công việc hoàn thành, giờ làm việc, điểm chất lượng, v.v.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| user_id | INTEGER | ID người dùng | Không | - | Tham chiếu đến `users.id` | Có (composite với metric_date) |
| metric_date | DATE | Ngày thống kê | Không | NOW | - | Có (composite với user_id) |
| metric_type | STRING(50) | Loại thống kê (completed_works, total_hours, quality_score...) | Không | - | - | Có |
| metric_value | DECIMAL(10,2) | Giá trị thống kê | Không | - | - | - |
| metric_json | JSONB | Dữ liệu chi tiết dạng JSON | Không | - | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Thu thập dữ liệu**: Hàng ngày, hệ thống tính toán số liệu từ các bảng như CheckIn, Work, WorkReport (e.g., tổng giờ làm việc từ `duration_minutes`, số công việc hoàn thành).
2. **Tạo bản ghi**: Chèn bản ghi mới vào `dashboard_metrics` với `metric_date`, `metric_type`, `metric_value`, và `metric_json` chứa chi tiết (e.g., danh sách công việc).
3. **Cập nhật**: Nếu số liệu thay đổi, cập nhật `metric_value` và `metric_json` cho ngày đó.
4. **Truy vấn**: Dashboard truy xuất dữ liệu theo `user_id` và `metric_date` để hiển thị biểu đồ, báo cáo.
5. **Luồng dữ liệu**: Tính toán định kỳ → Lưu trữ DB → Hiển thị trên UI → Sử dụng cho báo cáo quản lý.

## Quan hệ (Associations)
- BelongsTo User (qua user_id)
