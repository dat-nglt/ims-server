"use strict";

/**
 * Seeder: Position (Chức vụ)
 *
 * Tạo dữ liệu mẫu cho bảng positions
 * Bao gồm các chức vụ cho 3 phòng ban chính:
 * - Phòng Kỹ Thuật (TECH - department_id: 1)
 * - Phòng Bán Hàng (SALES - department_id: 2)
 * - Phòng Nhân Sự (HR - department_id: 3)
 *
 * Cấu trúc phân cấp:
 * - Giám đốc (Director)
 *   - Quản lý (Manager)
 *     - Trưởng nhóm (Lead)
 *       - Cao cấp (Senior)
 *         - Nhân viên (Staff)
 */

export async function up(queryInterface, Sequelize) {
    try {
        // Positions for IT/Technical Department (department_id = 1)
        // Department Hierarchy: Director -> Manager -> Lead -> Senior -> Staff -> Intern

        const itPositions = [
            {
                name: "Giám đốc Công Nghệ",
                code: "DIR-IT",
                description: "Chịu trách nhiệm toàn bộ bộ phận công nghệ",
                department_id: 1,
                level: "director",
                parent_position_id: null,
                salary_range_min: 5000,
                salary_range_max: 8000,
                expected_headcount: 1,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Quản lý Dự Án",
                code: "MGR-IT-PM",
                description: "Quản lý các dự án phát triển phần mềm",
                department_id: 1,
                level: "manager",
                parent_position_id: 1,
                salary_range_min: 3000,
                salary_range_max: 4500,
                expected_headcount: 1,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Trưởng Nhóm Backend",
                code: "LEAD-BE",
                description: "Lãnh đạo nhóm phát triển backend",
                department_id: 1,
                level: "lead",
                parent_position_id: 2,
                salary_range_min: 2200,
                salary_range_max: 3200,
                expected_headcount: 1,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Kỹ Sư Phần Mềm Cao Cấp",
                code: "SR-ENG-IT",
                description: "Kỹ sư phần mềm cấp cao, xử lý dự án phức tạp",
                department_id: 1,
                level: "senior",
                parent_position_id: 3,
                salary_range_min: 1800,
                salary_range_max: 2600,
                expected_headcount: 2,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Kỹ Sư Phần Mềm",
                code: "ENG-IT",
                description: "Kỹ sư phần mềm phát triển tính năng",
                department_id: 1,
                level: "staff",
                parent_position_id: 3,
                salary_range_min: 1200,
                salary_range_max: 1800,
                expected_headcount: 3,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        // Positions for Sales Department (department_id = 2)
        const salesPositions = [
            {
                name: "Giám đốc Kinh Doanh",
                code: "DIR-SALES",
                description: "Chịu trách nhiệm toàn bộ bộ phận kinh doanh",
                department_id: 2,
                level: "director",
                parent_position_id: null,
                salary_range_min: 4500,
                salary_range_max: 7000,
                expected_headcount: 1,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Quản lý Bán Hàng",
                code: "MGR-SALES",
                description: "Quản lý nhóm bán hàng và khách hàng",
                department_id: 2,
                level: "manager",
                parent_position_id: 6,
                salary_range_min: 2500,
                salary_range_max: 3800,
                expected_headcount: 1,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Trưởng Nhóm Bán Hàng",
                code: "LEAD-SALES",
                description: "Lãnh đạo nhóm bán hàng khu vực",
                department_id: 2,
                level: "lead",
                parent_position_id: 7,
                salary_range_min: 1800,
                salary_range_max: 2600,
                expected_headcount: 1,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Nhân Viên Bán Hàng",
                code: "SALES-REP",
                description: "Nhân viên bán hàng phát triển khách hàng mới",
                department_id: 2,
                level: "staff",
                parent_position_id: 8,
                salary_range_min: 1000,
                salary_range_max: 1600,
                expected_headcount: 3,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        // Positions for HR Department (department_id = 3)
        const hrPositions = [
            {
                name: "Giám đốc Nhân Sự",
                code: "DIR-HR",
                description: "Chịu trách nhiệm toàn bộ bộ phận nhân sự",
                department_id: 3,
                level: "director",
                parent_position_id: null,
                salary_range_min: 4000,
                salary_range_max: 6500,
                expected_headcount: 1,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Quản lý Tuyển Dụng",
                code: "MGR-RECRUIT",
                description: "Quản lý quy trình tuyển dụng và onboarding",
                department_id: 3,
                level: "manager",
                parent_position_id: 10,
                salary_range_min: 2000,
                salary_range_max: 3000,
                expected_headcount: 1,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Chuyên Viên Tuyển Dụng",
                code: "SPECIALIST-RECRUIT",
                description: "Tìm kiếm, phỏng vấn và tuyển dụng nhân viên",
                department_id: 3,
                level: "senior",
                parent_position_id: 11,
                salary_range_min: 1400,
                salary_range_max: 2000,
                expected_headcount: 2,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Nhân Viên Hành Chính Nhân Sự",
                code: "HR-ADMIN",
                description: "Xử lý công việc hành chính và hỗ trợ nhân sự",
                department_id: 3,
                level: "staff",
                parent_position_id: 11,
                salary_range_min: 1000,
                salary_range_max: 1500,
                expected_headcount: 1,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        // Combine all positions
        const allPositions = [...itPositions, ...salesPositions, ...hrPositions];

        // Insert all positions
        await queryInterface.bulkInsert("positions", allPositions, {});

        console.log(
            `✅ Successfully seeded ${allPositions.length} positions into the database`
        );
    } catch (error) {
        console.error("❌ Error seeding positions:", error.message);
        throw error;
    }
}

export async function down(queryInterface, Sequelize) {
    try {
        // Delete all positions (soft delete first, then hard delete)
        // Note: This is a simple delete. For soft delete, update is_deleted flag
        // await queryInterface.sequelize.query('UPDATE positions SET is_deleted = true;');

        // Or completely remove if needed:
        await queryInterface.bulkDelete(
            "positions",
            {
                code: [
                    "DIR-IT",
                    "MGR-IT-PM",
                    "LEAD-BE",
                    "SR-ENG-IT",
                    "ENG-IT",
                    "DIR-SALES",
                    "MGR-SALES",
                    "LEAD-SALES",
                    "SALES-REP",
                    "DIR-HR",
                    "MGR-RECRUIT",
                    "SPECIALIST-RECRUIT",
                    "HR-ADMIN",
                ],
            },
            {}
        );

        console.log("✅ Successfully removed seeded positions from the database");
    } catch (error) {
        console.error("❌ Error removing seeded positions:", error.message);
        throw error;
    }
}
