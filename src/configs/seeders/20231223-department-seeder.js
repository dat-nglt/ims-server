/**
 * Seeder: Add Department and Department Roles
 *
 * Sample data:
 * - 3 Departments (Kỹ Thuật, Bán Hàng, HR)
 * - Department Role Mappings
 */

export const up = async (queryInterface, Sequelize) => {
  try {
    // 1. Insert departments
    const departments = await queryInterface.bulkInsert(
      "departments",
      [
        {
          id: 1,
          name: "Phòng Kỹ Thuật",
          code: "TECH",
          description: "Bộ phận phát triển và hỗ trợ kỹ thuật",
          manager_id: null, // Will be set after users are created
          phone: "0901-000-001",
          email: "tech@company.com",
          location: "Tầng 2, Toà A",
          parent_department_id: null,
          status: "active",
          is_deleted: false,
          created_by: 1,
          updated_by: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: "Phòng Bán Hàng",
          code: "SALES",
          description: "Bộ phận kinh doanh và bán hàng",
          manager_id: null,
          phone: "0901-000-002",
          email: "sales@company.com",
          location: "Tầng 1, Toà A",
          parent_department_id: null,
          status: "active",
          is_deleted: false,
          created_by: 1,
          updated_by: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: "Phòng Nhân Sự",
          code: "HR",
          description: "Bộ phận quản lý nhân sự và phát triển",
          manager_id: null,
          phone: "0901-000-003",
          email: "hr@company.com",
          location: "Tầng 3, Toà A",
          parent_department_id: null,
          status: "active",
          is_deleted: false,
          created_by: 1,
          updated_by: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    // 2. Insert department_roles
    // NOTE: Adjust role_id values based on actual roles in your database
    // These are example mappings - UPDATE THESE IDs based on your actual Role IDs
    // await queryInterface.bulkInsert(
    //   "department_roles",
    //   [
    //     // Phòng Kỹ Thuật -> Role Technician (ID: 10)
    //     {
    //       department_id: 1,
    //       role_id: 10,
    //       is_primary: true,
    //       is_default: true,
    //       priority: 0,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     // Phòng Kỹ Thuật -> Role Senior Technician (ID: 11) - Optional
    //     {
    //       department_id: 1,
    //       role_id: 11,
    //       is_primary: false,
    //       is_default: false,
    //       priority: 1,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },

    //     // Phòng Bán Hàng -> Role Sales (ID: 20)
    //     {
    //       department_id: 2,
    //       role_id: 20,
    //       is_primary: true,
    //       is_default: true,
    //       priority: 0,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     // Phòng Bán Hàng -> Role Sales Manager (ID: 21) - Optional
    //     {
    //       department_id: 2,
    //       role_id: 21,
    //       is_primary: false,
    //       is_default: false,
    //       priority: 1,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },

    //     // Phòng Nhân Sự -> Role HR Manager (ID: 30)
    //     {
    //       department_id: 3,
    //       role_id: 30,
    //       is_primary: true,
    //       is_default: true,
    //       priority: 0,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     // Phòng Nhân Sự -> Role HR Staff (ID: 31) - Optional
    //     {
    //       department_id: 3,
    //       role_id: 31,
    //       is_primary: false,
    //       is_default: false,
    //       priority: 1,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //   ],
    //   {}
    // );

    console.log("✅ Seeding completed: Departments and Department Roles");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    throw error;
  }
};

export const down = async (queryInterface, Sequelize) => {
  try {
    // Remove department_roles
    await queryInterface.bulkDelete("department_roles", null, {});

    // Remove departments
    await queryInterface.bulkDelete("departments", null, {});

    console.log("✅ Seeding rollback completed");
  } catch (error) {
    console.error("❌ Seeding rollback error:", error);
    throw error;
  }
};

/**
 * IMPORTANT NOTES:
 *
 * 1. Role ID Mapping:
 *    You need to check your actual role IDs in the database:
 *    SELECT id, name FROM roles;
 *
 *    Update the role_id values above to match your actual roles:
 *    - Technician (currently 10)
 *    - Senior Technician (currently 11)
 *    - Sales (currently 20)
 *    - Sales Manager (currently 21)
 *    - HR Manager (currently 30)
 *    - HR Staff (currently 31)
 *
 * 2. If you don't have all these roles, either:
 *    - Create them first using role seeder
 *    - Adjust the department_roles to use existing role IDs
 *
 * 3. Manager IDs:
 *    Currently set to null. Update manager_id after employees are created:
 *    UPDATE departments SET manager_id = X WHERE id = 1;
 *
 * 4. User ID for created_by:
 *    Currently set to 1 (assumes admin user exists with ID 1)
 *    Adjust if your admin user has a different ID
 */
