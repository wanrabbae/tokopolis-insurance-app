module.exports = (sequelize, Sequelize) => {
	const AccountVehicle = sequelize.define('account_vehicles', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		account_id: {
	        type: Sequelize.INTEGER,
	        primaryKey: true
	    },
	    vehicle_id: {
	        type: Sequelize.INTEGER,
	        primaryKey: true
	    },
		year: {
			type: Sequelize.DATEONLY,
			allowNull: false,
		},
		plate: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		plate_detail: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		vehicle_color: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		machine_number: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		skeleton_number: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	}, {
		freezeTableName: true,
		timestamps: false,
	})

	AccountVehicle.associate = function(models) {
		AccountVehicle.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id' })
	}

	return AccountVehicle
}