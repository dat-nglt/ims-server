"use strict";

/**
 * Migration 003: Tạo bảng Users (Người dùng)
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employee_id: {
            type: Sequelize.STRING(50),
            unique: true, // Đã tự động tạo index unique
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        position: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        avatar_url: {
            type: Sequelize.TEXT,
        },
        phone: {
            type: Sequelize.STRING(20),
        },
        email: {
            type: Sequelize.STRING(255),
            unique: true, // Đã tự động tạo index unique
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING(50),
            defaultValue: "active",
        },
        department: {
            type: Sequelize.STRING(100),
        },
        manager_id: {
            type: Sequelize.INTEGER,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        last_login: {
            type: Sequelize.DATE,
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

    // Đã xóa addIndex cho employee_id và email vì đã có unique: true ở trên
    await queryInterface.addIndex("users", ["department"]);
    await queryInterface.addIndex("users", ["is_active"]);
    await queryInterface.addIndex("users", ["manager_id"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
}