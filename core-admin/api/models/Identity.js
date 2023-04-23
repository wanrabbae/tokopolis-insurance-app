module.exports = (sequelize, Sequelize) => {
	const Identity = sequelize.define('identities', {
		account_id: {
			type: Sequelize.INTEGER,
		},
		identity_number: {
			type: Sequelize.STRING,
			allowNull: false,
			primaryKey: true
		},
		image: Sequelize.STRING,
		type: Sequelize.ENUM('ktp', 'npwp'),
		verified_at: Sequelize.DATE,
		is_verified: {
			type: Sequelize.VIRTUAL,
			get() {
				return this.verified_at != null
			}
		}
	}, {
		defaultScope: {
			// attributes: {
			//   exclude: ['account_id']
			// }
		},
		freezeTableName: true,
		timestamps: false,
	})

	Identity.associate = function (models) {
		Identity.belongsTo(models.Account, { foreignKey: 'account_id' })
	}

	return Identity
}