'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('product_expansions', 'product_id', {
			type: Sequelize.INTEGER,
			references: {
				model: 'products',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn(
			'product_expansions',
			'product_id'
		)
	}
}