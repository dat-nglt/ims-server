"use strict";

/**
 * Migration 016: Tạo bảng Role Permissions
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("role_permissions", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "roles",
                key: "id",
            },
        },
        permission_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "permissions", // Đảm bảo bảng permissions đã tồn tại trước migration này
                key: "id",
            },
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
    });

    await queryInterface.addIndex("role_permissions", ["role_id"]);
    await queryInterface.addIndex("role_permissions", ["permission_id"]);

    // THAY ĐỔI QUAN TRỌNG
    await queryInterface.addIndex("role_permissions", ["role_id", "permission_id"], {
        unique: true,
        name: "unique_role_permission_index"
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("role_permissions");
}