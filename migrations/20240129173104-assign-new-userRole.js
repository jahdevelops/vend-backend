'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    queryInterface.changeColumn('users', 'role', {
      type: DataTypes.ENUM('seller', 'buyer', 'admin', 'courier')
    })
  },

  async down (queryInterface) {
    queryInterface.changeColumn('users', 'role', {
      type: DataTypes.ENUM('seller', 'buyer', 'admin')
    })
  }
};
