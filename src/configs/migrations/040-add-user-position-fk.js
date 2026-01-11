"use strict";

/**
 * Migration 033: Add Foreign Key Constraint for user.position_id
 * 
 * Thêm ràng buộc khóa ngoại từ users.position_id -> positions.id
 * Migration này được tạo sau khi bảng positions đã được tạo
 */

export async function up(queryInterface, Sequelize) {
    try {
        // Add foreign key constraint to position_id in users table
        await queryInterface.addConstraint("users", {
            fields: ["position_id"],
            type: "foreign key",
            name: "fk_users_position_id",
            references: {
                table: "positions",
                field: "id",
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        });

        console.log("✅ Added FK constraint: users.position_id -> positions.id");
    } catch (error) {
        console.error("❌ Error adding FK constraint:", error);
        throw error;
    }
}

export async function down(queryInterface, Sequelize) {
    try {
        // Remove the foreign key constraint
        await queryInterface.removeConstraint("users", "fk_users_position_id");
        console.log("✅ Removed FK constraint: users.position_id -> positions.id");
    } catch (error) {
        console.error("❌ Error removing FK constraint:", error);
        throw error;
    }
}
