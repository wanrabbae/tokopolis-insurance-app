'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('license_plates', {
			code: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			zone: {
				type: Sequelize.ENUM('1', '2', '3'),
				allowNull: false,
			},
			province: {
				type: Sequelize.STRING,
				allowNull: false,
			},
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('license_plates')
	}
}