'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('banks', {
			account_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
            type: Sequelize.ENUM('bca', 'bni', 'bri', 'mandiri', 'btn', 'cimb'),
			account_number: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			fullname: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			verified_at: Sequelize.DATE,
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('banks')
	}
}