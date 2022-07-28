module.exports = (sequelize, Sequelize) => {
	const Vehicle = sequelize.define('vehicles', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		brand: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		code: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
		capacity: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		model: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		sub_model: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		vehicle_type: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		vehicle_type_code: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		category: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		category_code: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		is_private: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
		is_commercial: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
		is_comprehensive: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
		is_tlo: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
	}, {
		freezeTableName: true,
		timestamps: false,
	})

	Vehicle.associate = function(models) {
		Vehicle.hasOne(models.VehiclePrice, {
			as: 'price',
			sourceKey: 'id',
			foreignKey: 'vehicle_id',
			onDelete: 'CASCADE'
		})

		Vehicle.hasMany(models.AccountVehicle, {
			as: 'accounts',
			sourceKey: 'id',
			foreignKey: 'vehicle_id',
			onDelete: 'CASCADE'
		})

		Vehicle.belongsToMany(models.Account, { foreignKey: 'vehicle_id',
			through: 'account_vehicles', timestamps: false })
	}

	return Vehicle
}