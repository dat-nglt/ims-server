# Mô tả chi tiết Model WorkReport

## Tổng quan
Model WorkReport lưu trữ báo cáo tiến độ/hoàn thành công việc, bao gồm phần trăm hoàn thành, ảnh chứng minh, vấn đề/giải pháp, phê duyệt, và đánh giá chất lượng.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| work_id | INTEGER | ID công việc | Có | - | Tham chiếu đến `works.id` | Có |
| reported_by | INTEGER | ID người báo cáo | Có | - | Tham chiếu đến `users.id` | Có |
| progress_percentage | INTEGER | Phần trăm hoàn thành (0-100) | Không | - | - | - |
| status | STRING(50) | Trạng thái báo cáo (in_progress, completed) | Không | 'in_progress' | - | - |
| description | TEXT | Mô tả chi tiết công việc đã làm | Không | - | - | - |
| notes | TEXT | Ghi chú thêm | Không | - | - | - |
| photo_urls | ARRAY(TEXT) | Danh sách URL ảnh chứng minh | Không | - | - | - |
| materials_used | TEXT | Vật liệu, thiết bị sử dụng | Không | - | - | - |
| issues_encountered | TEXT | Các vấn đề/khó khăn gặp phải | Không | - | - | - |
| solution_applied | TEXT | Giải pháp đã áp dụng | Không | - | - | - |
| time_spent_hours | DECIMAL(5,2) | Giờ công đã dùng | Không | - | - | - |
| next_steps | TEXT | Bước tiếp theo cần làm | Không | - | - | - |
| submitted_by_role | STRING(50) | Vai trò người báo cáo | Không | - | - | - |
| approval_status | STRING(50) | Trạng thái phê duyệt (pending, approved, rejected) | Không | 'pending' | - | Có |
| approved_by | INTEGER | ID người phê duyệt | Không | - | Tham chiếu đến `users.id` | - |
| approved_at | DATE | Thời điểm phê duyệt | Không | - | - | - |
| quality_rating | INTEGER | Đánh giá chất lượng (1-5 sao) | Không | - | - | Có |
| rejection_reason | TEXT | Lý do từ chối báo cáo | Không | - | - | - |
| reported_at | DATE | Thời điểm báo cáo | Không | NOW | - | Có |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |
| updated_at | DATE | Thời gian cập nhật | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Tạo báo cáo**: Kỹ thuật viên tạo bản ghi với `work_id`, `reported_by`, `progress_percentage`, `description`, `photo_urls`, `time_spent_hours`, `issues_encountered`, `solution_applied`.
2. **Gửi phê duyệt**: Cập nhật `approval_status` thành 'pending', gửi cho approver.
3. **Phê duyệt**: Approver cập nhật `approval_status` thành 'approved' (với `approved_by`, `approved_at`, `quality_rating`) hoặc 'rejected' (với `rejection_reason`).
4. **Hoàn thành**: Nếu approved, cập nhật Work với `actual_hours`, `actual_cost`; sử dụng cho báo cáo hiệu suất.
5. **Luồng dữ liệu**: Báo cáo → Phê duyệt → Hoàn thành → Cập nhật công việc.

## Quan hệ (Associations)
- BelongsTo Work (qua work_id, as 'work')
- BelongsTo User (qua reported_by, as 'reporter')
- BelongsTo User (qua approved_by, as 'approver')
