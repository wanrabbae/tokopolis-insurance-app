'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('transactions', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			account_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			product_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			account_vehicle_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			start_date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			documents: {
				type: Sequelize.JSON,
				allowNull: false,
			},
			price: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			loading_rate: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			expansions: {
				type: Sequelize.JSON,
				allowNull: false,
			},
			total: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			pg_transaction_id: {
				type: Sequelize.STRING,
			},
			pg_data: { // platform, due, date,
				type: Sequelize.JSON,
			},
			status: {
				type: Sequelize.ENUM('open', 'waiting', 'paid', 'denied', 'canceled'),
				defaultValue: 'open'
			},
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('transactions')
	}
}