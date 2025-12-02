"use strict";

/**
 * Migration 001: Tạo bảng Roles (Vai trò)
 *
 * Bảng này lưu trữ các vai trò trong hệ thống: admin, manager, sales, technician
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
        },
        level: {
            type: Sequelize.INTEGER,
            defaultValue: 10,
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        created_by: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "id",
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        updated_by: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "id",
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
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

    await queryInterface.addIndex("roles", ["name", "is_deleted"], { unique: true }); // Composite unique index for active records
    await queryInterface.addIndex("roles", ["created_at"]);
    await queryInterface.addIndex("roles", ["is_deleted"]);
    await queryInterface.addIndex("roles", ["level"]);
    await queryInterface.addIndex("roles", ["created_by"]);
    await queryInterface.addIndex("roles", ["updated_by"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("roles");
}
