module.exports = (sequelize, Sequelize) => {
	const Bank = sequelize.define('banks', {
		account_id: {
			type: Sequelize.INTEGER,
			primaryKey: true
		},
        type: Sequelize.ENUM('bca', 'bni', 'bri', 'mandiri', 'btn', 'cimb'),
		account_number: {
			type: Sequelize.STRING,
			allowNull: false,
		},
        fullname: {
            type: Sequelize.STRING,
            allowNull: false,
        },
		verified_at: Sequelize.DATE,
		is_verified: {
			type: Sequelize.VIRTUAL,
			get() {
				return this.verified_at != null
			}
		}
	}, {
		freezeTableName: true,
		timestamps: false,
	})

	Bank.associate = function(models) {
		Bank.belongsTo(models.Account, { foreignKey: 'account_id' })
	}

	return Bank
}