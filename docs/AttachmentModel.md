# Mô tả chi tiết Model Attachment

## Tổng quan
Model Attachment lưu trữ thông tin về các tập tin đính kèm cho công việc (Work) hoặc báo cáo (WorkReport) trong hệ thống IMS.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| work_id | INTEGER | ID công việc liên quan | Không | - | Tham chiếu đến `works.id` | Có |
| report_id | INTEGER | ID báo cáo liên quan | Không | - | Tham chiếu đến `work_reports.id` | Có |
| file_name | STRING(255) | Tên tập tin | Có | - | - | - |
| file_url | TEXT | URL truy cập tập tin | Có | - | - | - |
| file_type | STRING(50) | Loại tập tin (image, document, video...) | Không | - | - | - |
| file_size | INTEGER | Dung lượng tập tin (bytes) | Không | - | - | - |
| uploaded_by | INTEGER | ID người upload | Không | - | Tham chiếu đến `users.id` | Có |
| uploaded_at | DATE | Thời gian upload | Không | NOW | - | Có |

## Luồng hoạt động của dữ liệu

1. **Tạo Attachment**: Khi người dùng upload tập tin, hệ thống tạo bản ghi mới trong bảng `attachments` với các trường như `file_name`, `file_url`, `file_type`, `file_size`, `uploaded_by`, và liên kết với `work_id` hoặc `report_id`.
2. **Liên kết**: Attachment thuộc về một Work hoặc WorkReport thông qua khóa ngoại. Nó cũng liên kết với User qua `uploaded_by`.
3. **Truy cập**: Trong ứng dụng, Attachment được truy xuất qua associations (e.g., `work.attachments` hoặc `report.attachments`), hiển thị danh sách tập tin đính kèm.
4. **Cập nhật/Xóa**: Chỉ người upload hoặc admin có thể chỉnh sửa/xóa, với kiểm tra quyền dựa trên `uploaded_by`.
5. **Luồng dữ liệu**: Upload → Lưu trữ file trên server → Tạo bản ghi DB → Liên kết với Work/Report → Hiển thị trong UI → Download khi cần.

## Quan hệ (Associations)
- BelongsTo Work (qua work_id)
- BelongsTo WorkReport (qua report_id)
- BelongsTo User (qua uploaded_by)
