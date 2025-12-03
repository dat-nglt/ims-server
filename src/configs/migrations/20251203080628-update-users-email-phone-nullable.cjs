'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Cho phép email nullable
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING(255),
      unique: true,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    });

    // Cho phép phone nullable
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
      validate: {
        is: /^\+?[0-9\-\s]+$/i,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    // Revert về NOT NULL
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    });

    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        is: /^\+?[0-9\-\s]+$/i,
      },
    });
  }
};
