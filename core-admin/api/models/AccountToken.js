module.exports = (sequelize, Sequelize) => {
	const AccountToken = sequelize.define('account_tokens', {
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
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
	}, {
		freezeTableName: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	})

	AccountToken.associate = function(models) {
		AccountToken.belongsTo(models.Account, { foreignKey: 'account_id' })
	}

	return AccountToken
}