'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('profiles', {
			account_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			gender: Sequelize.ENUM('male', 'female'),
			birth_date: Sequelize.DATEONLY,
			photo: Sequelize.STRING,
			address: Sequelize.TEXT,
			phone: Sequelize.STRING,
			city: Sequelize.STRING,
			province: Sequelize.STRING,
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('profiles')
	}
}