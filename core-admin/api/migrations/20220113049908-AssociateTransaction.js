'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.changeColumn('transactions', 'client_id', {
				type: Sequelize.INTEGER,
				references: {
					model: 'accounts',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			}),
			queryInterface.changeColumn('transactions', 'agent_id', {
				type: Sequelize.INTEGER,
				references: {
					model: 'accounts',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			}),
			queryInterface.changeColumn('transactions', 'vehicle_id', {
				type: Sequelize.INTEGER,
				references: {
					model: 'vehicles',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			}),
			queryInterface.changeColumn('transactions', 'product_id', {
				type: Sequelize.INTEGER,
				references: {
					model: 'products',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			}),
		])
	},

	down: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.removeColumn(
				'transactions',
				'client_id'
			),
			queryInterface.removeColumn(
				'transactions',
				'agent_id'
			),
			queryInterface.removeColumn(
				'transactions',
				'vehicle_id'
			),
			queryInterface.removeColumn(
				'transactions',
				'product_id'
			),
		])
	}
}