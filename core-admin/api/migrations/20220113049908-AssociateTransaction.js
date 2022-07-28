'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.changeColumn('transactions', 'account_id', {
				type: Sequelize.INTEGER,
				references: {
					model: 'accounts',
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
			queryInterface.changeColumn('transactions', 'account_vehicle_id', {
				type: Sequelize.INTEGER,
				references: {
					model: 'account_vehicles',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			})
		])
	},

	down: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.removeColumn(
				'transactions',
				'account_id'
			),
			queryInterface.removeColumn(
				'transactions',
				'product_id'
			),
			queryInterface.removeColumn(
				'transactions',
				'account_vehicle_id'
			)
		])
	}
}