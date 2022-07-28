'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('role_endpoints', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      endpoint_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('role_endpoints')
  }
};
