'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('identities', {
			account_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			identity_number: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			image: Sequelize.STRING,
			type: Sequelize.ENUM('ktp', 'npwp'),
			verified_at: Sequelize.DATE,
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('identities')
	}
}