# Mô tả chi tiết Model Work

## Tổng quan
Model Work lưu trữ thông tin công việc trong hệ thống IMS, bao gồm phân công, chi phí, địa điểm, và trạng thái.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| work_code | STRING(100) | Mã công việc duy nhất | Có | - | - | Có (unique) |
| title | STRING(255) | Tiêu đề công việc | Có | - | - | - |
| description | TEXT | Mô tả chi tiết | Không | - | - | - |
| category_id | INTEGER | ID danh mục công việc | Không | - | Tham chiếu đến `work_categories.id` | Có |
| assigned_user_id | INTEGER | ID người được giao phó | Có | - | Tham chiếu đến `users.id` | Có |
| assigned_to_technician_id | INTEGER | ID kỹ thuật viên thực hiện | Không | - | Tham chiếu đến `users.id` | Có |
| created_by_sales_id | INTEGER | ID nhân viên kinh doanh tạo | Không | - | Tham chiếu đến `users.id` | Có |
| created_by | INTEGER | ID người tạo công việc | Không | - | Tham chiếu đến `users.id` | - |
| priority | STRING(50) | Mức ưu tiên (low, medium, high, urgent) | Không | 'medium' | - | Có |
| status | STRING(50) | Trạng thái (pending, assigned, in_progress, completed, cancelled) | Không | 'pending' | - | Có |
| service_type | STRING(100) | Loại dịch vụ | Không | - | - | - |
| due_date | DATE | Ngày hạn chót | Không | - | - | Có |
| created_date | DATE | Ngày tạo công việc | Không | NOW | - | Có |
| completed_date | DATE | Ngày hoàn thành thực tế | Không | - | - | - |
| location | STRING(255) | Tên địa điểm công việc | Không | - | - | - |
| customer_name | STRING(255) | Tên khách hàng | Không | - | - | - |
| customer_phone | STRING(20) | Số điện thoại khách hàng | Không | - | - | - |
| customer_address | TEXT | Địa chỉ khách hàng | Không | - | - | - |
| location_lat | DECIMAL(10,8) | Vĩ độ GPS | Không | - | - | - |
| location_lng | DECIMAL(11,8) | Kinh độ GPS | Không | - | - | - |
| estimated_hours | DECIMAL(5,2) | Giờ công ước tính | Không | - | - | - |
| actual_hours | DECIMAL(5,2) | Giờ công thực tế | Không | - | - | - |
| estimated_cost | DECIMAL(10,2) | Chi phí ước tính | Không | - | - | - |
| actual_cost | DECIMAL(10,2) | Chi phí thực tế | Không | - | - | - |
| payment_status | STRING(50) | Trạng thái thanh toán (unpaid, paid, partial) | Không | 'unpaid' | - | Có |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |
| updated_at | DATE | Thời gian cập nhật | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Tạo công việc**: Nhân viên sales tạo bản ghi với `work_code`, `title`, `customer_name`, `location`, `estimated_cost`, và gán `assigned_user_id`.
2. **Phân công**: Admin hoặc manager gán `assigned_to_technician_id`, cập nhật `status` thành 'assigned'.
3. **Thực hiện**: Kỹ thuật viên cập nhật `status` thành 'in_progress', ghi check-in, và hoàn thành với `completed_date`, `actual_hours`, `actual_cost`.
4. **Thanh toán**: Cập nhật `payment_status` sau khi thanh toán.
5. **Luồng dữ liệu**: Tạo → Phân công → Thực hiện → Hoàn thành → Thanh toán.

## Quan hệ (Associations)
- BelongsTo WorkCategory (qua category_id, as 'category')
- BelongsTo User (qua assigned_user_id, as 'assignedUser')
- BelongsTo User (qua assigned_to_technician_id, as 'technician')
- BelongsTo User (qua created_by_sales_id, as 'salesPerson')
- BelongsTo User (qua created_by, as 'creator')
- HasMany WorkReport (qua work_id, as 'reports')
