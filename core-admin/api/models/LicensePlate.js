module.exports = (sequelize, Sequelize) => {
	const LicensePlate = sequelize.define('license_plates', {
		code: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		zone: {
			type: Sequelize.ENUM('1', '2', '3'),
			allowNull: false,
		},
		province: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	}, {
		defaultScope: {
			attributes: {
			exclude: ['id']
			}
		},
		freezeTableName: true,
		timestamps: false,
	})

	LicensePlate.associate = function(models) {

	}

	return LicensePlate
}