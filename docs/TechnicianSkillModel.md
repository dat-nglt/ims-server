# Mô tả chi tiết Model TechnicianSkill

## Tổng quan
Model TechnicianSkill lưu trữ cấp bậc của kỹ thuật viên, bao gồm các mức: Kỹ thuật chính, Kỹ thuật phụ, Kỹ thuật viên thực tập để phân công công việc phù hợp.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| technician_id | INTEGER | ID kỹ thuật viên | Có | - | Tham chiếu đến `users.id` | Có |
| technician_level | STRING(100) | Cấp bậc kỹ thuật viên | Có | - | - | Có |
| assigned_at | DATE | Ngày phân công cấp bậc | Không | NOW | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Phân công cấp bậc**: Admin hoặc HR tạo bản ghi với `technician_id` và `technician_level` (Kỹ thuật chính, Kỹ thuật phụ, Kỹ thuật viên thực tập).
2. **Cập nhật**: Có thể thay đổi cấp bậc, cập nhật `technician_level` và `assigned_at`.
3. **Sử dụng**: Hệ thống truy vấn cấp bậc để phân công công việc phù hợp, hiển thị trong hồ sơ kỹ thuật viên.
4. **Luồng dữ liệu**: Phân công cấp bậc → Lưu trữ DB → Sử dụng cho quản lý và phân công công việc.

## Quan hệ (Associations)
- BelongsTo User (qua technician_id, as 'technician')
