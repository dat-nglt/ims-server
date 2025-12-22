"use strict";

/**
 * Migration 001: Tạo bảng Users (Người dùng)
 * Note: Không sử dụng unique constraints vì hệ thống thực hiện soft delete
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
            allowNull: true, // nullable for Zalo users until approval
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
            allowNull: true, // Updated to allow null as per later migration
        },
        email: {
            type: Sequelize.STRING(255),
            allowNull: true, // Updated to allow null as per later migration
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: 'Mật khẩu đã hash',
        },
        zalo_id: {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'Zalo ID của người dùng',
        },
        status: {
            type: Sequelize.STRING(50),
            defaultValue: "active",
        },
        // department moved to employee_profiles; keep users table lean for Zalo workflow


        manager_id: {
            type: Sequelize.INTEGER,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        approved: {
            type: Sequelize.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
            comment: 'Trạng thái phê duyệt tài khoản: pending, approved, rejected',
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

    // Đã xóa unique constraints vì hệ thống sử dụng soft delete
    await queryInterface.addIndex("users", ["employee_id"]);
    await queryInterface.addIndex("users", ["email"]);
    await queryInterface.addIndex("users", ["is_active"]);
    await queryInterface.addIndex("users", ["manager_id"]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
}