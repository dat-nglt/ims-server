# Mô tả chi tiết Model SalesReportDaily

## Tổng quan
Model SalesReportDaily lưu trữ báo cáo bán hàng hàng ngày của nhân viên sales, bao gồm doanh thu, chi phí, lợi nhuận.

## Chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả | Bắt buộc | Mặc định | Khóa ngoại | Chỉ mục |
|--------|--------------|-------|----------|----------|------------|---------|
| id | INTEGER | Khóa chính, tự tăng | Có | - | - | - |
| report_code | STRING(100) | Mã báo cáo duy nhất | Có | - | - | Có (unique) |
| sales_person_id | INTEGER | ID nhân viên kinh doanh | Có | - | Tham chiếu đến `users.id` | Có |
| report_date | DATE | Ngày báo cáo | Có | - | - | Có |
| revenue | DECIMAL(10,2) | Tổng doanh thu | Không | - | - | - |
| cost | DECIMAL(10,2) | Tổng chi phí | Không | - | - | - |
| profit | DECIMAL(10,2) | Tổng lợi nhuận | Không | - | - | - |
| notes | TEXT | Ghi chú | Không | - | - | - |
| created_at | DATE | Thời gian tạo | Không | NOW | - | - |
| updated_at | DATE | Thời gian cập nhật | Không | NOW | - | - |

## Luồng hoạt động của dữ liệu

1. **Tạo báo cáo**: Nhân viên sales nhập dữ liệu hàng ngày, tạo bản ghi mới với `report_code` duy nhất, `sales_person_id`, `report_date`, và tính `profit = revenue - cost`.
2. **Cập nhật**: Cho phép chỉnh sửa `revenue`, `cost`, `notes` trong ngày, tự động tính lại `profit`.
3. **Truy vấn**: Báo cáo được sử dụng cho thống kê hàng tháng, dashboard tài chính, hoặc đánh giá hiệu suất sales.
4. **Luồng dữ liệu**: Thu thập dữ liệu bán hàng → Nhập báo cáo → Tính toán lợi nhuận → Lưu trữ DB → Xuất báo cáo.

## Quan hệ (Associations)
- BelongsTo User (qua sales_person_id, as 'salesPerson')
