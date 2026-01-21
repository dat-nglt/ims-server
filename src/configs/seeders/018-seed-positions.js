"use strict";

/**
 * Seeder: Position (Chức vụ)
 *
 * Tạo dữ liệu mẫu cho bảng positions
 * Bao gồm các chức vụ cho các phòng ban (TECH, IT, DESIGN, SALES, HR):
 * - Phòng Kỹ Thuật (TECH - department_id: 1)
 * - Phòng Bán Hàng (SALES - department_id: 2)
 * - Phòng Nhân Sự (HR - department_id: 3)
 * - Phòng IT (IT - department_id: 4)
 * - Phòng Kỹ Sư Thiết Kế (DESIGN - department_id: 5)
 *
 * Các vị trí bổ sung chính: Trưởng phòng, Kỹ thuật chính (SR), Kỹ thuật phụ (JR), Nhân sự văn phòng (HR-ADMIN)
 * Cấu trúc phân cấp (ví dụ):
 * - Giám đốc (Director)
 *   - Quản lý (Manager)
 *     - Trưởng nhóm (Lead)
 *       - Cao cấp (Senior)
 *         - Nhân viên (Staff)
 */

export async function up(queryInterface, Sequelize) {
    try {
        // Positions for Technical Department (Phòng Kỹ Thuật - department_id = 1)
        const techPositions = [
            {
                name: "Trưởng Phòng Kỹ Thuật",
                code: "MGR-TECH",
                description: "Chịu trách nhiệm quản lý Phòng Kỹ Thuật",
                department_id: 1,
                level: "manager",
                parent_position_id: null,
                salary_range_min: 3500,
                salary_range_max: 6000,
                expected_headcount: 1,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Kỹ Thuật Chính",
                code: "SR-TECH",
                description: "Kỹ thuật chính chịu trách nhiệm các tác vụ chuyên môn",
                department_id: 1,
                level: "senior",
                parent_position_id: null,
                salary_range_min: 1800,
                salary_range_max: 2800,
                expected_headcount: 2,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Kỹ Thuật Thực Tập",
                code: "INTERN-TECH",
                description: "Kỹ thuật thực tập hỗ trợ các tác vụ chuyên môn",
                department_id: 1,
                level: "intern",
                parent_position_id: null,
                salary_range_min: 800,
                salary_range_max: 1200,
                expected_headcount: 2,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Kỹ Thuật Phụ",
                code: "JR-TECH",
                description: "Nhân viên kỹ thuật hỗ trợ và vận hành",
                department_id: 1,
                level: "staff",
                parent_position_id: null,
                salary_range_min: 1000,
                salary_range_max: 1600,
                expected_headcount: 4,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Trưởng Nhóm Kỹ Thuật",
                code: "LEAD-TECH",
                description: "Lãnh đạo nhóm kỹ thuật",
                department_id: 1,
                level: "lead",
                parent_position_id: null,
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
        ];

        // Positions for IT Department (Phòng IT - department_id = 4)
        const itPositions = [
            {
                name: "Giám đốc Công Nghệ",
                code: "DIR-IT",
                description: "Chịu trách nhiệm toàn bộ bộ phận công nghệ",
                department_id: 4,
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
                department_id: 4,
                level: "manager",
                parent_position_id: null,
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
                name: "Kỹ Sư Phần Mềm Cao Cấp",
                code: "SR-ENG-IT",
                description: "Kỹ sư phần mềm cấp cao, xử lý dự án phức tạp",
                department_id: 4,
                level: "senior",
                parent_position_id: null,
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
                department_id: 4,
                level: "staff",
                parent_position_id: null,
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

        // Positions for Design Department (Phòng Kỹ Sư Thiết Kế - department_id = 5)
        const designPositions = [
            {
                name: "Trưởng Phòng Thiết Kế",
                code: "MGR-DESIGN",
                description: "Quản lý bộ phận thiết kế kỹ thuật",
                department_id: 5,
                level: "manager",
                parent_position_id: null,
                salary_range_min: 3200,
                salary_range_max: 5000,
                expected_headcount: 1,
                status: "active",
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Kỹ Sư Thiết Kế Chính",
                code: "SR-DESIGN",
                description: "Kỹ sư thiết kế chính phụ trách bản vẽ và công nghệ",
                department_id: 5,
                level: "senior",
                parent_position_id: null,
                salary_range_min: 1600,
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
                name: "Kỹ Sư Thiết Kế",
                code: "ENG-DESIGN",
                description: "Kỹ sư thiết kế thực hiện bản vẽ và mô phỏng",
                department_id: 5,
                level: "staff",
                parent_position_id: null,
                salary_range_min: 1100,
                salary_range_max: 1700,
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
                parent_position_id: null,
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
                parent_position_id: null,
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
                parent_position_id: null,
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
                parent_position_id: null,
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
                parent_position_id: null,
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
                parent_position_id: null,
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
        const allPositions = [...techPositions, ...itPositions, ...designPositions, ...salesPositions, ...hrPositions];

        // Insert all positions
        await queryInterface.bulkInsert("positions", allPositions, {});

        console.log(`✅ Successfully seeded ${allPositions.length} positions into the database`);
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
                    "SR-ENG-IT",
                    "ENG-IT",
                    "MGR-TECH",
                    "SR-TECH",
                    "JR-TECH",
                    "LEAD-TECH",
                    "MGR-DESIGN",
                    "SR-DESIGN",
                    "ENG-DESIGN",
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
            {},
        );

        console.log("✅ Successfully removed seeded positions from the database");
    } catch (error) {
        console.error("❌ Error removing seeded positions:", error.message);
        throw error;
    }
}
