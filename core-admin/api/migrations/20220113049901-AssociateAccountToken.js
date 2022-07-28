'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('account_tokens', 'account_id', {
			type: Sequelize.INTEGER,
			references: {
				model: 'accounts',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn(
			'account_tokens',
			'account_id'
		)
	}
}