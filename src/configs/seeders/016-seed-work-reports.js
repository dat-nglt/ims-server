"use strict";

/**
 * Seeder 016: Seed Work Reports (báo cáo công việc)
 *
 * Tạo dữ liệu báo cáo tiến độ/hoàn thành công việc
 * Tham chiếu:
 * - works table (work_id)
 * - projects table (project_id)
 * - users table (reported_by, approved_by, assigned_approver)
 * 
 * LƯU Ý: Các trường hình ảnh (before_images, during_images, after_images) 
 * được lưu dưới dạng JSONB trong PostgreSQL, nên phải convert thành JSON string
 */

export async function up(queryInterface, Sequelize) {
    const workReports = [
        // Báo cáo 1: Báo cáo tiến độ công việc 1 (Lắp đặt máy lạnh) - 50% hoàn thành
        {
            work_id: 1,
            project_id: 1,
            reported_by: 2,
            progress_percentage: 50,
            status: "in_progress",
            description:
                "Ngày 1 của công việc lắp đặt máy lạnh multi-split: Đã hoàn thành khâu khảo sát địa điểm, thiết kế đường ống, lắp dàn nóng và bắt đầu lắp dàn lạnh phòng 1. Tất cả vật liệu có sẵn, công ty xây dựng đã chuẩn bị điểm neo.",
            notes:
                "Tiến độ bình thường. Dự kiến hoàn thành ngày mai. Khách hàng rất hài lòng với chất lượng công việc.",
            photo_urls: null,
            location: "ABC Company - Văn phòng TP.HCM",
            before_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=Before+Image+1",
                "https://via.placeholder.com/400x300?text=Before+Image+2",
            ]),
            during_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=During+Image+1",
                "https://via.placeholder.com/400x300?text=During+Image+2",
                "https://via.placeholder.com/400x300?text=During+Image+3",
            ]),
            after_images: null,
            assigned_approver: 1,
            materials_used:
                "Dàn lạnh LG 9000BTU x2, Dàn nóng LG 18000BTU, Ống đồng 1/4-3/8, Dây điện 2.5mm2, Gas R410A (8kg), Keo chống cháy",
            issues_encountered: null,
            solution_applied: null,
            time_spent_hours: 4,
            next_steps: "Tiếp tục lắp dàn lạnh phòng 2 và 3, nạp gas, kiểm tra toàn hệ thống",
            submitted_by_role: "technician",
            approval_status: "pending",
            approved_by: null,
            approved_at: null,
            quality_rating: null,
            rejection_reason: null,
            reported_at: new Date("2025-12-19T16:30:00.000Z"),
            created_at: new Date("2025-12-19T16:30:00.000Z"),
            updated_at: new Date("2025-12-19T16:30:00.000Z"),
        },

        // Báo cáo 2: Báo cáo hoàn thành công việc 2 (Bảo trì máy lạnh) - 100% hoàn thành
        {
            work_id: 2,
            project_id: 1,
            reported_by: 3,
            progress_percentage: 100,
            status: "completed",
            description:
                "Công việc bảo trì định kỳ hoàn tất thành công. Thực hiện các công việc: Vệ sinh bộ lọc không khí (4 bộ), kiểm tra gas (kiểm tra áp suất thấp 4.2 bar - bình thường), kiểm tra dòng điện (bình thường), làm sạch dàn nóng (không có vặn bị tích tụ), bơm nước thoát nước (thông thoáng), kiểm tra van kỳ và các linh kiện khác (tất cả bình thường).",
            notes:
                "Hệ thống máy lạnh XYZ Ltd. ở trạng thái rất tốt, không phát hiện vấn đề gì. Khuyến cáo tiếp tục bảo trì 6 tháng một lần. Khách hàng rất thỏa mãn.",
            photo_urls: null,
            location: "XYZ Ltd. - Kho hàng Hà Nội",
            before_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=AC+Before+1",
                "https://via.placeholder.com/400x300?text=AC+Before+2",
            ]),
            during_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=Maintenance+During+1",
                "https://via.placeholder.com/400x300?text=Maintenance+During+2",
            ]),
            after_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=AC+After+1",
                "https://via.placeholder.com/400x300?text=AC+After+2",
            ]),
            assigned_approver: 1,
            materials_used: "Tinh dầu bảo trì, Dung dịch vệ sinh ống dẫn, Gas R410A (0.5kg)",
            issues_encountered: null,
            solution_applied: null,
            time_spent_hours: 3.5,
            next_steps: "Không cần. Hoàn thành công việc.",
            submitted_by_role: "technician",
            approval_status: "approved",
            approved_by: 1,
            approved_at: new Date("2025-12-18T14:00:00.000Z"),
            quality_rating: 5,
            rejection_reason: null,
            reported_at: new Date("2025-12-18T13:00:00.000Z"),
            created_at: new Date("2025-12-18T13:00:00.000Z"),
            updated_at: new Date("2025-12-18T14:00:00.000Z"),
        },

        // Báo cáo 3: Báo cáo tiến độ công việc 4 (Lắp máy sấy) - Chờ xử lý
        {
            work_id: 4,
            project_id: 1,
            reported_by: 3,
            progress_percentage: 75,
            status: "in_progress",
            description:
                "Công việc lắp đặt máy sấy quần áo công nghiệp: Đã hoàn thành 75%. Thực hiện: Khảo sát địa điểm, lắp khung sắt cơ sở, kết nối ống nước vào và thoát, chuẩn bị hệ thống điện 3 pha. Còn lại: kiểm tra lại kết nối, nạp nước, chạy thử nghiệm.",
            notes:
                "Công việc tiến hành bình thường. Dự kiến hoàn thành sáng hôm sau. Vừa phát hiện cần thêm ống nước thoát dài 2m (sẽ chuẩn bị trong buổi sáng).",
            photo_urls: null,
            location: "DEF Factory - Nhà máy Hải Phòng",
            before_images: JSON.stringify(["https://via.placeholder.com/400x300?text=Factory+Before"]),
            during_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=Installation+Progress+1",
                "https://via.placeholder.com/400x300?text=Installation+Progress+2",
            ]),
            after_images: null,
            assigned_approver: 1,
            materials_used:
                "Máy sấy công nghiệp 50kg, Khung sắt lắp ráp, Ống nước PVC 3/4, Cầu chì điện 3 pha 63A, Dây điện 6mm2",
            issues_encountered: "Cần thêm ống nước thoát thêm 2m",
            solution_applied: "Đã liên hệ với nhân viên kho để chuẩn bị ống nước thêm",
            time_spent_hours: 6,
            next_steps: "Hoàn thành lắp đặt, nạp nước, chạy thử nghiệm 2 giờ, kiểm tra các chỉ số",
            submitted_by_role: "technician",
            approval_status: "pending",
            approved_by: null,
            approved_at: null,
            quality_rating: null,
            rejection_reason: null,
            reported_at: new Date("2025-12-20T17:00:00.000Z"),
            created_at: new Date("2025-12-20T17:00:00.000Z"),
            updated_at: new Date("2025-12-20T17:00:00.000Z"),
        },

        // Báo cáo 4: Báo cáo từ chối - công việc 7 (Kiểm tra hệ thống điện) - Hoàn thành
        {
            work_id: 7,
            project_id: 1,
            reported_by: 3,
            progress_percentage: 100,
            status: "completed",
            description:
                "Hoàn thành kiểm tra hệ thống điện toàn bộ công ty GHI. Công việc bao gồm: Kiểm tra chỉ số điện áp 3 pha (tất cả bình thường 220V), kiểm tra độ cân bằng tải (cân bằng tốt), kiểm tra mối nối (chặt lại 3 mối nối lỏng), kiểm tra bảng điều khiển chính (hoạt động tốt), kiểm tra hệ thống nối đất (điện trở 0.8 Ω - bình thường).",
            notes:
                "Toàn bộ hệ thống điện ở tình trạng tốt. Không phát hiện vấn đề nghiêm trọng nào. Khuyến cáo kiểm tra lại 12 tháng một lần.",
            photo_urls: null,
            location: "GHI Company - Xưởng sản xuất Bình Dương",
            before_images: JSON.stringify(["https://via.placeholder.com/400x300?text=Electrical+Panel+Before"]),
            during_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=Testing+1",
                "https://via.placeholder.com/400x300?text=Testing+2",
            ]),
            after_images: JSON.stringify(["https://via.placeholder.com/400x300?text=Panel+After"]),
            assigned_approver: 1,
            materials_used: "Thiết bị đo đa năng, Tuốc nơ vít, Hơi nén",
            issues_encountered: null,
            solution_applied: null,
            time_spent_hours: 3.5,
            next_steps: "Không có",
            submitted_by_role: "technician",
            approval_status: "rejected",
            approved_by: 1,
            approved_at: new Date("2025-12-15T10:30:00.000Z"),
            quality_rating: null,
            rejection_reason: "Báo cáo thiếu dữ liệu chi tiết về điện áp từng pha. Yêu cầu bổ sung báo cáo chi tiết.",
            reported_at: new Date("2025-12-15T12:00:00.000Z"),
            created_at: new Date("2025-12-15T12:00:00.000Z"),
            updated_at: new Date("2025-12-15T10:30:00.000Z"),
        },

        // Báo cáo 5: Báo cáo bổ sung công việc 7 (sau khi bị từ chối)
        {
            work_id: 7,
            project_id: 1,
            reported_by: 3,
            progress_percentage: 100,
            status: "completed",
            description:
                "Báo cáo bổ sung chi tiết. Hoàn thành kiểm tra hệ thống điện toàn bộ công ty GHI. Chi tiết điện áp:\n- Pha A: 219V\n- Pha B: 220V\n- Pha C: 221V\nĐộ không cân bằng tối đa: 0.9% (bình thường < 5%)\nKiểm tra mối nối: chặt lại 3 mối nối ở bảng chính\nHệ thống nối đất: 0.8 Ω (bình thường)\nBảng điều khiển: hoạt động bình thường, không quá tải\nTất cả thiết bị điện: hoạt động bình thường",
            notes:
                "Hệ thống điện ở tình trạng tốt. Khuyến cáo kiểm tra 12 tháng một lần. Khách hàng thỏa mãn.",
            photo_urls: null,
            location: "GHI Company - Xưởng sản xuất Bình Dương",
            before_images: JSON.stringify(["https://via.placeholder.com/400x300?text=Electrical+Panel+Before"]),
            during_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=Testing+Detail+1",
                "https://via.placeholder.com/400x300?text=Testing+Detail+2",
                "https://via.placeholder.com/400x300?text=Data+Sheet",
            ]),
            after_images: JSON.stringify(["https://via.placeholder.com/400x300?text=Panel+After"]),
            assigned_approver: 1,
            materials_used: "Thiết bị đo đa năng",
            issues_encountered: null,
            solution_applied: null,
            time_spent_hours: 0.5,
            next_steps: "Không có",
            submitted_by_role: "technician",
            approval_status: "approved",
            approved_by: 1,
            approved_at: new Date("2025-12-15T11:00:00.000Z"),
            quality_rating: 5,
            rejection_reason: null,
            reported_at: new Date("2025-12-15T11:00:00.000Z"),
            created_at: new Date("2025-12-15T11:00:00.000Z"),
            updated_at: new Date("2025-12-15T11:00:00.000Z"),
        },

        // Báo cáo 6: Báo cáo tiến độ công việc 10 (Kiểm tra bộ lọc không khí) - 100%
        {
            work_id: 10,
            project_id: 1,
            reported_by: 3,
            progress_percentage: 100,
            status: "completed",
            description:
                "Hoàn tất công việc kiểm tra và vệ sinh bộ lọc không khí công ty JKL. Thực hiện: Mở hộp lọc, kiểm tra độ bẩn (tích bụi 15%), vệ sinh bằng nước sạch và hơi nén, kiểm tra độ thông (tốt), lắp lại bộ lọc, kiểm tra lưu lượng không khí (bình thường), ghi chú các vị trí tích bụi.",
            notes:
                "Bộ lọc không khí ở tình trạng tốt. Khuyến cáo thay bộ lọc mới trong 6 tháng nữa (khi tích bụi 30-40%). Khách hàng hài lòng với chất lượng dịch vụ.",
            photo_urls: null,
            location: "JKL Company - Văn phòng Đà Nẵng",
            before_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=Filter+Dirty+1",
                "https://via.placeholder.com/400x300?text=Filter+Dirty+2",
            ]),
            during_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=Cleaning+Process+1",
                "https://via.placeholder.com/400x300?text=Cleaning+Process+2",
            ]),
            after_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=Filter+Clean+1",
                "https://via.placeholder.com/400x300?text=Filter+Clean+2",
            ]),
            assigned_approver: 1,
            materials_used: "Nước sạch, Hơi nén, Bàn chải mềm",
            issues_encountered: null,
            solution_applied: null,
            time_spent_hours: 2,
            next_steps: "Không có. Khách hàng sẽ liên hệ khi cần thay bộ lọc mới.",
            submitted_by_role: "technician",
            approval_status: "approved",
            approved_by: 1,
            approved_at: new Date("2025-12-18T12:30:00.000Z"),
            quality_rating: 5,
            rejection_reason: null,
            reported_at: new Date("2025-12-18T11:45:00.000Z"),
            created_at: new Date("2025-12-18T11:45:00.000Z"),
            updated_at: new Date("2025-12-18T12:30:00.000Z"),
        },

        // Báo cáo 7: Báo cáo tiến độ công việc 3 (Sửa chữa máy lạnh) - Chưa bắt đầu nhưng công việc chưa bắt đầu
        {
            work_id: 3,
            project_id: 1,
            reported_by: 2,
            progress_percentage: 0,
            status: "in_progress",
            description:
                "Công việc sửa chữa máy lạnh chưa bắt đầu. Đã chuẩn bị đầy đủ: Gas R410A (8kg), Dàn nóng thay thế, Các linh kiện cần thiết. Chờ khách hàng xác nhận lịch làm việc chính thức.",
            notes:
                "Chuẩn bị sẵn sàng. Chờ xác nhận từ khách hàng. Dự kiến bắt đầu ngày 22/12/2025.",
            photo_urls: null,
            location: "MNO Corporation - Văn phòng Cần Thơ",
            before_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=AC+System+Before+1",
                "https://via.placeholder.com/400x300?text=AC+System+Before+2",
            ]),
            during_images: null,
            after_images: null,
            assigned_approver: 1,
            materials_used: "Dàn nóng thay thế, Gas R410A (8kg), Ống đồng, Dây điện, Keo chống cháy",
            issues_encountered: null,
            solution_applied: null,
            time_spent_hours: 0,
            next_steps: "Chờ xác nhận từ khách hàng, sau đó bắt đầu tháo dàn nóng cũ",
            submitted_by_role: "technician",
            approval_status: "pending",
            approved_by: null,
            approved_at: null,
            quality_rating: null,
            rejection_reason: null,
            reported_at: new Date("2025-12-21T16:00:00.000Z"),
            created_at: new Date("2025-12-21T16:00:00.000Z"),
            updated_at: new Date("2025-12-21T16:00:00.000Z"),
        },

        // Báo cáo 8: Báo cáo tiến độ công việc 9 (Sửa chữa tuần hoàn nước) - Chờ duyệt
        {
            work_id: 9,
            project_id: 1,
            reported_by: 2,
            progress_percentage: 35,
            status: "in_progress",
            description:
                "Công việc sửa chữa hệ thống tuần hoàn nước: Đã hoàn thành 35%. Thực hiện: Tắt hệ thống, kiểm tra van điều chỉnh (bị kẹt, cần thay thế), tháo van, kiểm tra bộ lọc (bẩn, cần vệ sinh), vệ sinh bộ lọc. Còn lại: Thay van mới, lắp lại, nạp nước, chạy thử.",
            notes:
                "Phát hiện van kỳ bị kẹt, cần thay thế với van mới chất lượng cao. Đã mua van thay thế. Dự kiến hoàn thành trong 2 ngày.",
            photo_urls: null,
            location: "PQR Hotel - Bể bơi Nha Trang",
            before_images: JSON.stringify(["https://via.placeholder.com/400x300?text=Circulation+System+Before"]),
            during_images: JSON.stringify([
                "https://via.placeholder.com/400x300?text=Valve+Problem+1",
                "https://via.placeholder.com/400x300?text=Filter+Cleaning",
            ]),
            after_images: null,
            assigned_approver: 1,
            materials_used: "Van điều chỉnh mới, Bộ vệ sinh hệ thống, Dây buộc, Keo chống rò rỉ",
            issues_encountered: "Van kỳ bị kẹt, không thể mở được",
            solution_applied: "Thay van kỳ mới",
            time_spent_hours: 2.5,
            next_steps: "Thay van kỳ mới, lắp lại hệ thống, nạp nước sạch, chạy thử hệ thống 2 giờ",
            submitted_by_role: "technician",
            approval_status: "pending",
            approved_by: null,
            approved_at: null,
            quality_rating: null,
            rejection_reason: null,
            reported_at: new Date("2025-12-25T14:30:00.000Z"),
            created_at: new Date("2025-12-25T14:30:00.000Z"),
            updated_at: new Date("2025-12-25T14:30:00.000Z"),
        },
    ];

    await queryInterface.bulkInsert("work_reports", workReports, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("work_reports", null, {});
}
