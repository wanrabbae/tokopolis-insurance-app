module.exports = (sequelize, Sequelize) => {
	const VehiclePrice = sequelize.define('vehicle_prices', {
		vehicle_id: {
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		year: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		price: {
			type: Sequelize.DOUBLE,
			allowNull: false,
		},
	}, {
		defaultScope: {
			attributes: {
				exclude: ['vehicle_id']
			}
		},
		freezeTableName: true,
		timestamps: false,
	})

	VehiclePrice.associate = function(models) {
		VehiclePrice.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id' })
	}

	return VehiclePrice
}