'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		// return Promise.all([])
		return queryInterface.createTable('product_expansions', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			product_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			label: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			rate: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
		})
	},

	down: (queryInterface, Sequelize) => {
		// return Promise.all([])
		return queryInterface.dropTable('product_expansions')
	}
}