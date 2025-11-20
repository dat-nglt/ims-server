# Mô tả chi tiết Model EmployeeProfile

## Tổng quan
Model EmployeeProfile lưu trữ thông tin chi tiết về nhân viên, bao gồm phòng ban, chuyên môn, chứng chỉ, và đánh giá hiệu suất.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| user_id | INTEGER | ID người dùng | Có | - | Tham chiếu đến `users.id` | Có |
| department | STRING(100) | Phòng ban | Không | - | - | - |
| specialization | ARRAY(TEXT) | Danh sách chuyên môn | Không | - | - | - |
| certification | ARRAY(TEXT) | Danh sách chứng chỉ | Không | - | - | - |
| phone_secondary | STRING(20) | Số điện thoại phụ | Không | - | - | - |
| address | TEXT | Địa chỉ cư trú | Không | - | - | - |
| date_of_birth | DATE | Ngày sinh | Không | - | - | - |
| gender | STRING(10) | Giới tính (M/F) | Không | - | - | - |
| id_number | STRING(50) | Số CMND/CCCD | Không | - | - | - |
| hire_date | DATE | Ngày vào làm | Không | - | - | - |
| total_experience_years | INTEGER | Tổng năm kinh nghiệm | Không | - | - | - |
| performance_rating | DECIMAL(3,2) | Đánh giá hiệu suất (1-5) | Không | - | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |
| updated_at | DATE | Thời gian cập nhật | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Tạo hồ sơ**: Khi nhân viên được tuyển dụng, tạo bản ghi mới với `user_id` liên kết, nhập thông tin cơ bản như `department`, `hire_date`, `id_number`.
2. **Cập nhật**: Nhân viên hoặc HR cập nhật `specialization`, `certification`, `performance_rating` qua các kỳ đánh giá.
3. **Sử dụng**: Truy xuất hồ sơ để phân công công việc, tính lương, hoặc báo cáo nhân sự.
4. **Luồng dữ liệu**: Tuyển dụng → Nhập dữ liệu → Cập nhật định kỳ → Sử dụng cho quản lý nhân sự.

## Quan hệ (Associations)
- BelongsTo User (qua user_id)
