'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('account_vehicles', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			account_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			vehicle_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			year: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			plate: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			plate_detail: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			vehicle_color: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			machine_number: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			skeleton_number: {
				type: Sequelize.STRING,
				allowNull: false,
			},
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('account_vehicles')
	}
}