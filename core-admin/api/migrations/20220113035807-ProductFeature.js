'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('product_features', {
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
			type: {
				type: Sequelize.ENUM('era', 'ambulance', 'call_center',
					'tow', 'replace_vehicle', 'taxi_fare', 'nfo',
					'repair_warranty', 'mobile_app', 'to_workshop', 'other'),
				allowNull: false,
			},
			short_description: {
				type: Sequelize.STRING,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('product_features')
	}
}