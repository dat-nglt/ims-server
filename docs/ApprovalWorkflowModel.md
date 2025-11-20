# Mô tả chi tiết Model ApprovalWorkflow

## Tổng quan
Model ApprovalWorkflow lưu trữ quy trình phê duyệt cho báo cáo công việc trong hệ thống IMS.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| work_id | INTEGER | ID công việc liên quan | Có | - | Tham chiếu đến `works.id` | Có |
| report_id | INTEGER | ID báo cáo liên quan | Có | - | Tham chiếu đến `work_reports.id` | Có |
| current_approver_id | INTEGER | ID người phê duyệt hiện tại | Không | - | Tham chiếu đến `users.id` | - |
| approval_step | INTEGER | Bước phê duyệt | Không | 1 | - | Có |
| current_step_status | STRING(50) | Trạng thái bước hiện tại (pending, approved, rejected) | Không | 'pending' | - | Có |
| comments | TEXT | Bình luận phê duyệt | Không | - | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |
| updated_at | DATE | Thời gian cập nhật | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Khởi tạo Workflow**: Khi báo cáo được tạo, hệ thống tạo bản ghi mới trong `approval_workflow` với `work_id`, `report_id`, `approval_step = 1`, và `current_step_status = 'pending'`.
2. **Phân công Approver**: Gán `current_approver_id` dựa trên quy tắc (e.g., cấp trên hoặc danh sách phê duyệt).
3. **Xử lý Bước**: Người phê duyệt cập nhật `current_step_status` (approved/rejected), thêm `comments`, và tăng `approval_step` nếu approved. Nếu rejected, workflow dừng.
4. **Tiến trình**: Lặp lại cho các bước tiếp theo cho đến khi hoàn thành hoặc bị từ chối.
5. **Luồng dữ liệu**: Tạo báo cáo → Khởi tạo workflow → Phân công approver → Phê duyệt/bác bỏ → Cập nhật trạng thái → Hoàn thành hoặc lặp lại bước.

## Quan hệ (Associations)
- BelongsTo Work (qua work_id)
- BelongsTo WorkReport (qua report_id)
- BelongsTo User (qua current_approver_id, as 'currentApprover')
