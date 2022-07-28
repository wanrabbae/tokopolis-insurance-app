'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('vehicle_prices', 'vehicle_id', {
			type: Sequelize.INTEGER,
			references: {
				model: 'vehicles',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn(
			'vehicle_prices',
			'vehicle_id'
		)
	}
}