'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('role_endpoints', 'role_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }),
      queryInterface.changeColumn('role_endpoints', 'endpoint_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'endpoints',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        'role_endpoints',
        'role_id'
      ),
      queryInterface.removeColumn(
        'role_endpoints',
        'endpoint_id'
      )
    ])
  }
};
