module.exports = (sequelize, Sequelize) => {
	const Profile = sequelize.define('profiles', {
		account_id: {
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		gender: Sequelize.ENUM('male', 'female'),
		birth_date: Sequelize.DATEONLY,
		photo: Sequelize.STRING,
		address: Sequelize.TEXT,
		phone: Sequelize.STRING,
		city: Sequelize.STRING,
		province: Sequelize.STRING,
	}, {
		defaultScope: {
			attributes: {
				exclude: ['account_id']
			}
		},
		freezeTableName: true,
		timestamps: false,
	})

	Profile.associate = function(models) {
		Profile.belongsTo(models.Account, { foreignKey: 'account_id' })
	}

	return Profile
}