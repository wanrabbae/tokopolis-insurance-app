'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('endpoints', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      route: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      method: {
				type: Sequelize.ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE'),
				allowNull: false,
			},
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      deleted_at: {
        type: Sequelize.DATE
      },
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('endpoints');
  }
};
