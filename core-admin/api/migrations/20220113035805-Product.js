'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('products', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			type: {
				type: Sequelize.ENUM('comprehensive', 'tlo'),
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			image: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			tnc: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			claim: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			brochure_file: Sequelize.STRING,
			workshop_file: Sequelize.STRING,
			workshop_count: Sequelize.INTEGER,
			deleted_at: Sequelize.DATE,
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('products')
	}
}