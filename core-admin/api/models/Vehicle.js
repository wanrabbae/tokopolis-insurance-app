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
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
	}, {
		freezeTableName: true,
		createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false,
	})

	Vehicle.associate = function(models) {
		Vehicle.hasMany(models.VehiclePrice, {
			as: 'prices',
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

		Vehicle.hasMany(models.Transaction, {
			as: 'transactions',
			sourceKey: 'id',
			foreignKey: 'vehicle_id',
			onDelete: 'CASCADE'
		})

		Vehicle.belongsToMany(models.Account, { foreignKey: 'vehicle_id',
			through: 'account_vehicles', timestamps: false })
	}

	return Vehicle
}