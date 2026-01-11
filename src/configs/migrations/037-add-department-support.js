/**
 * Migration: Add Department Support to System
 *
 * This migration:
 * 1. Creates the 'departments' table
 * 2. Alters 'employee_profiles' to add department_id FK
 * 3. Creates necessary indexes
 */

export const up = async (queryInterface, Sequelize) => {
  try {
    // 1. Create departments table
    await queryInterface.createTable(
      "departments",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
          comment: "Tên phòng ban",
        },
        code: {
          type: Sequelize.STRING(50),
          allowNull: true,
          comment: "Mã phòng ban",
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: "Mô tả phòng ban",
        },
        manager_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          comment: "Trưởng phòng",
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: true,
          comment: "Số điện thoại phòng ban",
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: "Email phòng ban",
        },
        location: {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: "Vị trí phòng ban",
        },
        parent_department_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "departments",
            key: "id",
          },
          comment: "Phòng ban cha",
        },
        status: {
          type: Sequelize.ENUM("active", "inactive", "archived"),
          defaultValue: "active",
          comment: "Trạng thái phòng ban",
        },
        is_deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          comment: "Soft delete flag",
        },
        created_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          comment: "Người tạo",
        },
        updated_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          comment: "Người cập nhật",
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        comment: "Bảng phòng ban của công ty",
      }
    );

    // Create indexes for departments
    await queryInterface.addIndex(
      "departments",
      ["name", "is_deleted"],
      {
        unique: true,
        name: "unique_department_name_deleted",
      }
    );

    await queryInterface.addIndex(
      "departments",
      ["code", "is_deleted"],
      {
        unique: true,
        name: "unique_department_code_deleted",
      }
    );

    await queryInterface.addIndex(
      "departments",
      ["manager_id"],
      { name: "idx_department_manager" }
    );

    await queryInterface.addIndex(
      "departments",
      ["parent_department_id"],
      { name: "idx_department_parent" }
    );

    await queryInterface.addIndex(
      "departments",
      ["status"],
      { name: "idx_department_status" }
    );

    await queryInterface.addIndex(
      "departments",
      ["is_deleted"],
      { name: "idx_department_deleted" }
    );

    // 2. Add department_id column to employee_profiles
    // First check if column already exists to avoid errors
    const hasColumn = await queryInterface.describeTable("employee_profiles");

    if (!hasColumn.department_id) {
      await queryInterface.addColumn(
        "employee_profiles",
        "department_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "departments",
            key: "id",
          },
          comment: "Tham chiếu tới phòng ban",
        }
      );

      // Create index for department_id
      await queryInterface.addIndex(
        "employee_profiles",
        ["department_id"],
        { name: "idx_employee_profile_dept" }
      );
    }

    console.log("✅ Migration completed: Department support added");
  } catch (error) {
    console.error("❌ Migration error:", error);
    throw error;
  }
};

export const down = async (queryInterface, Sequelize) => {
  try {
    // Remove department_id from employee_profiles
    const hasColumn = await queryInterface.describeTable("employee_profiles");
    if (hasColumn.department_id) {
      await queryInterface.removeColumn("employee_profiles", "department_id");
    }

    // Drop departments table
    await queryInterface.dropTable("departments");

    console.log("✅ Migration rollback completed");
  } catch (error) {
    console.error("❌ Migration rollback error:", error);
    throw error;
  }
};
