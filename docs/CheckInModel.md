# Mô tả chi tiết Model CheckIn

## Tổng quan
Model CheckIn lưu trữ thông tin check-in/check-out cho nhân viên, bao gồm vị trí GPS, ảnh, thời gian làm việc, và kiểm tra phạm vi.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| user_id | INTEGER | ID người dùng | Có | - | Tham chiếu đến `users.id` | Có |
| work_id | INTEGER | ID công việc | Không | - | Tham chiếu đến `works.id` | Có |
| check_in_time | DATE | Thời gian check-in | Có | - | - | Có |
| check_out_time | DATE | Thời gian check-out | Không | - | - | - |
| latitude | DECIMAL(10,8) | Vĩ độ | Không | - | - | - |
| longitude | DECIMAL(11,8) | Kinh độ | Không | - | - | - |
| location_name | STRING(255) | Tên địa điểm | Không | - | - | - |
| address | TEXT | Địa chỉ đầy đủ | Không | - | - | - |
| photo_url | TEXT | URL ảnh | Không | - | - | - |
| status | STRING(50) | Trạng thái (checked_in, checked_out) | Không | 'checked_in' | - | Có |
| distance_from_work | DECIMAL(10,2) | Khoảng cách từ công việc (km) | Không | - | - | - |
| is_within_radius | BOOLEAN | Có trong phạm vi hay không | Không | - | - | Có |
| duration_minutes | INTEGER | Thời gian làm việc (phút) | Không | - | - | - |
| device_info | TEXT | Thông tin thiết bị | Không | - | - | - |
| ip_address | STRING(45) | IP address | Không | - | - | - |
| notes | TEXT | Ghi chú | Không | - | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu và thao tác

### Luồng dữ liệu chính:
1. **Check-in**: Nhân viên gửi vị trí GPS, ảnh, và thông tin thiết bị. Hệ thống tạo bản ghi mới với `check_in_time`, tính `distance_from_work` và `is_within_radius` dựa trên vị trí công việc.
2. **Validation**: Kiểm tra `is_within_radius` (true nếu trong phạm vi cho phép). Nếu false, ghi chú cảnh báo.
3. **Check-out**: Cập nhật `check_out_time`, tính `duration_minutes = (check_out_time - check_in_time) / 60`, và thay đổi `status` thành 'checked_out'.
4. **Tính toán**: Sử dụng GPS để xác định `location_name` và `address` qua API địa lý. Lưu `photo_url` từ upload.
5. **Lưu trữ**: Dữ liệu được lưu vào DB với indexes để truy vấn nhanh theo `user_id`, `work_id`, v.v.

### Các thao tác trên dữ liệu:
- **Tạo (Create)**: Insert bản ghi khi check-in, với validation vị trí.
- **Cập nhật (Update)**: Chỉ cập nhật `check_out_time`, `status`, `duration_minutes` khi check-out; không cho phép chỉnh sửa `check_in_time`.
- **Đọc (Read)**: Truy vấn theo `user_id` để xem lịch sử chấm công, hoặc theo `work_id` để báo cáo.
- **Xóa (Delete)**: Chỉ admin có thể xóa, với kiểm tra quyền.
- **Báo cáo**: Tính tổng `duration_minutes` cho báo cáo lương, kiểm tra `is_within_radius` để đánh giá tuân thủ.

## Quan hệ (Associations)
- BelongsTo User (qua user_id)
- BelongsTo Work (qua work_id)
