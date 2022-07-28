'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('vehicle_prices', {
			vehicle_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			year: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			price: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('vehicle_prices')
	}
}