'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.changeColumn('account_vehicles', 'account_id', {
				type: Sequelize.INTEGER,
				references: {
					model: 'accounts',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			}),
			queryInterface.changeColumn('account_vehicles', 'vehicle_id', {
				type: Sequelize.INTEGER,
				references: {
					model: 'vehicles',
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
				'account_vehicles',
				'account_id'
			),
			queryInterface.removeColumn(
				'account_vehicles',
				'vehicle_id'
			)
		])
	}
}