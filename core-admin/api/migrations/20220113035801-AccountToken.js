'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('account_tokens', {
			account_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			token: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			type: {
				type: Sequelize.ENUM('email', 'password'),
				allowNull: false,
			},
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('account_tokens')
	}
}