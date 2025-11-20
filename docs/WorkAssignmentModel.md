# Mô tả chi tiết Model WorkAssignment

## Tổng quan
Model WorkAssignment lưu trữ thông tin phân công công việc cho kỹ thuật viên, bao gồm trạng thái chấp nhận, thời gian ước tính/thực tế.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| work_id | INTEGER | ID công việc | Có | - | Tham chiếu đến `works.id` | Có |
| technician_id | INTEGER | ID kỹ thuật viên | Có | - | Tham chiếu đến `users.id` | Có |
| assigned_by | INTEGER | ID người phân công | Có | - | Tham chiếu đến `users.id` | - |
| assignment_date | DATE | Ngày phân công | Không | NOW | - | Có |
| assigned_status | STRING(50) | Trạng thái phân công | Không | 'pending' | - | Có |
| accepted_at | DATE | Thời gian chấp nhận | Không | - | - | - |
| rejected_reason | TEXT | Lý do từ chối | Không | - | - | - |
| estimated_start_time | DATE | Thời gian bắt đầu ước tính | Không | - | - | - |
| estimated_end_time | DATE | Thời gian kết thúc ước tính | Không | - | - | - |
| actual_start_time | DATE | Thời gian bắt đầu thực tế | Không | - | - | - |
| actual_end_time | DATE | Thời gian kết thúc thực tế | Không | - | - | - |
| notes | TEXT | Ghi chú | Không | - | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |
| updated_at | DATE | Thời gian cập nhật | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Phân công**: Admin hoặc manager tạo bản ghi với `work_id`, `technician_id`, `assigned_by`, `estimated_start_time`, `estimated_end_time`.
2. **Chấp nhận/Từ chối**: Kỹ thuật viên cập nhật `assigned_status` thành 'accepted' (với `accepted_at`) hoặc 'rejected' (với `rejected_reason`).
3. **Thực hiện**: Khi bắt đầu, cập nhật `actual_start_time`; khi hoàn thành, cập nhật `actual_end_time` và `assigned_status` thành 'completed'.
4. **Theo dõi**: Hệ thống sử dụng để báo cáo tiến độ, tính hiệu suất kỹ thuật viên.
5. **Luồng dữ liệu**: Phân công → Chấp nhận → Thực hiện → Hoàn thành.

## Quan hệ (Associations)
- BelongsTo Work (qua work_id, as 'work')
- BelongsTo User (qua technician_id, as 'technician')
- BelongsTo User (qua assigned_by, as 'assignedByUser')
