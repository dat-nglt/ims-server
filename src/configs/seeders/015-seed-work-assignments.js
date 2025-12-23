"use strict";

/**
 * Seeder 015: Seed Work Assignments (phân công công việc)
 *
 * Tạo dữ liệu phân công công việc cho kỹ thuật viên
 * Tham chiếu:
 * - works table (work_id)
 * - users table (technician_id, assigned_by)
 */

export async function up(queryInterface, Sequelize) {
    const workAssignments = [
        // Phân công công việc 1 cho kỹ thuật viên 2
        {
            work_id: 1,
            technician_id: 2,
            assigned_by: 1,
            assignment_date: new Date("2025-12-10T09:00:00.000Z"),
            assigned_status: "accepted",
            accepted_at: new Date("2025-12-10T10:30:00.000Z"),
            rejected_reason: null,
            estimated_start_time: new Date("2025-12-19T08:00:00.000Z"),
            estimated_end_time: new Date("2025-12-19T16:00:00.000Z"),
            actual_start_time: null,
            actual_end_time: null,
            notes: "Công việc lắp đặt máy lạnh multi-split, chuẩn bị đầy đủ dụng cụ và vật liệu",
            created_at: new Date("2025-12-10T09:00:00.000Z"),
            updated_at: new Date("2025-12-10T10:30:00.000Z"),
        },

        // Phân công công việc 2 cho kỹ thuật viên 3
        {
            work_id: 2,
            technician_id: 3,
            assigned_by: 1,
            assignment_date: new Date("2025-12-01T09:00:00.000Z"),
            assigned_status: "completed",
            accepted_at: new Date("2025-12-01T10:00:00.000Z"),
            rejected_reason: null,
            estimated_start_time: new Date("2025-12-18T09:00:00.000Z"),
            estimated_end_time: new Date("2025-12-18T13:00:00.000Z"),
            actual_start_time: new Date("2025-12-18T09:15:00.000Z"),
            actual_end_time: new Date("2025-12-18T12:45:00.000Z"),
            notes: "Bảo trì định kỳ máy lạnh XYZ Ltd., công việc hoàn thành trước dự kiến 15 phút",
            created_at: new Date("2025-12-01T09:00:00.000Z"),
            updated_at: new Date("2025-12-18T13:00:00.000Z"),
        },

        // Phân công công việc 3 cho kỹ thuật viên 2
        {
            work_id: 3,
            technician_id: 2,
            assigned_by: 1,
            assignment_date: new Date("2025-12-15T10:00:00.000Z"),
            assigned_status: "accepted",
            accepted_at: new Date("2025-12-15T11:00:00.000Z"),
            rejected_reason: null,
            estimated_start_time: new Date("2025-12-22T08:00:00.000Z"),
            estimated_end_time: new Date("2025-12-22T12:00:00.000Z"),
            actual_start_time: null,
            actual_end_time: null,
            notes: "Sửa chữa máy lạnh - thay dàn nóng, chuẩn bị gas R410A và các linh kiện thay thế",
            created_at: new Date("2025-12-15T10:00:00.000Z"),
            updated_at: new Date("2025-12-15T11:00:00.000Z"),
        },

        // Phân công công việc 4 cho kỹ thuật viên 4
        {
            work_id: 4,
            technician_id: 3,
            assigned_by: 1,
            assignment_date: new Date("2025-12-12T14:00:00.000Z"),
            assigned_status: "accepted",
            accepted_at: new Date("2025-12-12T15:30:00.000Z"),
            rejected_reason: null,
            estimated_start_time: new Date("2025-12-20T08:00:00.000Z"),
            estimated_end_time: new Date("2025-12-20T17:00:00.000Z"),
            actual_start_time: null,
            actual_end_time: null,
            notes: "Lắp đặt máy sấy quần áo công nghiệp, kiểm tra điều kiện điện áp 3 pha trước khi lắp",
            created_at: new Date("2025-12-12T14:00:00.000Z"),
            updated_at: new Date("2025-12-12T15:30:00.000Z"),
        },

        // Phân công công việc 5 cho kỹ thuật viên 5
        {
            work_id: 5,
            technician_id: 3,
            assigned_by: 1,
            assignment_date: new Date("2025-12-13T11:00:00.000Z"),
            assigned_status: "pending",
            accepted_at: null,
            rejected_reason: null,
            estimated_start_time: new Date("2025-12-21T09:00:00.000Z"),
            estimated_end_time: new Date("2025-12-21T15:00:00.000Z"),
            actual_start_time: null,
            actual_end_time: null,
            notes: "Bảo trì máy bơm nước, chờ xác nhận từ kỹ thuật viên",
            created_at: new Date("2025-12-13T11:00:00.000Z"),
            updated_at: new Date("2025-12-13T11:00:00.000Z"),
        },

        // Phân công công việc 6 cho kỹ thuật viên 2
        {
            work_id: 6,
            technician_id: 2,
            assigned_by: 1,
            assignment_date: new Date("2025-12-14T09:00:00.000Z"),
            assigned_status: "rejected",
            accepted_at: null,
            rejected_reason: "Bận công việc khác, không thể thực hiện kịp thời",
            estimated_start_time: new Date("2025-12-23T08:00:00.000Z"),
            estimated_end_time: new Date("2025-12-23T16:00:00.000Z"),
            actual_start_time: null,
            actual_end_time: null,
            notes: "Công việc bị từ chối, cần chuyển cho kỹ thuật viên khác",
            created_at: new Date("2025-12-14T09:00:00.000Z"),
            updated_at: new Date("2025-12-14T16:30:00.000Z"),
        },

        // Phân công lại công việc 6 cho kỹ thuật viên 3
        {
            work_id: 6,
            technician_id: 3,
            assigned_by: 1,
            assignment_date: new Date("2025-12-14T17:00:00.000Z"),
            assigned_status: "accepted",
            accepted_at: new Date("2025-12-14T18:00:00.000Z"),
            rejected_reason: null,
            estimated_start_time: new Date("2025-12-23T08:00:00.000Z"),
            estimated_end_time: new Date("2025-12-23T16:00:00.000Z"),
            actual_start_time: null,
            actual_end_time: null,
            notes: "Phân công lại sau khi kỹ thuật viên 2 từ chối. Tiến hành chuẩn bị tài liệu kỹ thuật",
            created_at: new Date("2025-12-14T17:00:00.000Z"),
            updated_at: new Date("2025-12-14T18:00:00.000Z"),
        },

        // Phân công công việc 7 cho kỹ thuật viên 4
        {
            work_id: 7,
            technician_id: 3,
            assigned_by: 1,
            assignment_date: new Date("2025-12-08T10:00:00.000Z"),
            assigned_status: "completed",
            accepted_at: new Date("2025-12-08T11:00:00.000Z"),
            rejected_reason: null,
            estimated_start_time: new Date("2025-12-15T08:00:00.000Z"),
            estimated_end_time: new Date("2025-12-15T12:00:00.000Z"),
            actual_start_time: new Date("2025-12-15T08:30:00.000Z"),
            actual_end_time: new Date("2025-12-15T11:30:00.000Z"),
            notes: "Kiểm tra hệ thống điện hoàn thành, không có vấn đề nào phát hiện",
            created_at: new Date("2025-12-08T10:00:00.000Z"),
            updated_at: new Date("2025-12-15T12:00:00.000Z"),
        },

        // Phân công công việc 8 cho kỹ thuật viên 5
        {
            work_id: 8,
            technician_id: 3,
            assigned_by: 1,
            assignment_date: new Date("2025-12-16T13:00:00.000Z"),
            assigned_status: "accepted",
            accepted_at: new Date("2025-12-16T14:00:00.000Z"),
            rejected_reason: null,
            estimated_start_time: new Date("2025-12-24T09:00:00.000Z"),
            estimated_end_time: new Date("2025-12-24T17:00:00.000Z"),
            actual_start_time: null,
            actual_end_time: null,
            notes: "Lắp đặt hệ thống máy giặt công nghiệp, cần kiểm tra nước cấp và thoát",
            created_at: new Date("2025-12-16T13:00:00.000Z"),
            updated_at: new Date("2025-12-16T14:00:00.000Z"),
        },

        // Phân công công việc 9 cho kỹ thuật viên 2
        {
            work_id: 9,
            technician_id: 2,
            assigned_by: 1,
            assignment_date: new Date("2025-12-17T10:00:00.000Z"),
            assigned_status: "pending",
            accepted_at: null,
            rejected_reason: null,
            estimated_start_time: new Date("2025-12-25T08:00:00.000Z"),
            estimated_end_time: new Date("2025-12-25T16:00:00.000Z"),
            actual_start_time: null,
            actual_end_time: null,
            notes: "Sửa chữa hệ thống tuần hoàn nước, chờ xác nhận",
            created_at: new Date("2025-12-17T10:00:00.000Z"),
            updated_at: new Date("2025-12-17T10:00:00.000Z"),
        },

        // Phân công công việc 10 cho kỹ thuật viên 3
        {
            work_id: 10,
            technician_id: 3,
            assigned_by: 1,
            assignment_date: new Date("2025-12-09T15:00:00.000Z"),
            assigned_status: "accepted",
            accepted_at: new Date("2025-12-09T16:00:00.000Z"),
            rejected_reason: null,
            estimated_start_time: new Date("2025-12-18T08:00:00.000Z"),
            estimated_end_time: new Date("2025-12-18T12:00:00.000Z"),
            actual_start_time: new Date("2025-12-18T08:15:00.000Z"),
            actual_end_time: new Date("2025-12-18T11:45:00.000Z"),
            notes: "Kiểm tra và vệ sinh bộ lọc không khí - công việc hoàn thành đúng tiến độ",
            created_at: new Date("2025-12-09T15:00:00.000Z"),
            updated_at: new Date("2025-12-18T12:00:00.000Z"),
        },
    ];

    await queryInterface.bulkInsert("work_assignments", workAssignments, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("work_assignments", null, {});
}
