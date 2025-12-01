"use strict";

/**
 * Migration 017: Tạo bảng User Roles
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_roles", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "roles",
                key: "id",
            },
        },
        assigned_by: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "id",
            },
        },
        assigned_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
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

    // Index lẻ cho foreign key performance
    await queryInterface.addIndex("user_roles", ["user_id"]);
    await queryInterface.addIndex("user_roles", ["role_id"]);

    // THAY ĐỔI QUAN TRỌNG: Dùng addIndex với unique: true thay cho addConstraint
    await queryInterface.addIndex("user_roles", ["user_id", "role_id"], {
        unique: true,
        name: "unique_user_role_index",
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_roles");
}
