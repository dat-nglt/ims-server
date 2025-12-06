"use strict";

/**
 * Migration 023: Thay đổi cột approved trong bảng users từ BOOLEAN thành ENUM
 */

export async function up(queryInterface, Sequelize) {
    // Thay đổi cột approved thành ENUM
    await queryInterface.changeColumn("users", "approved", {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        comment: 'Trạng thái phê duyệt tài khoản: pending, approved, rejected',
    });
}

export async function down(queryInterface, Sequelize) {
    // Revert về BOOLEAN
    await queryInterface.changeColumn("users", "approved", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Trạng thái phê duyệt tài khoản',
    });
}