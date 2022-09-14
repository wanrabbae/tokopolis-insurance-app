module.exports = (sequelize, Sequelize) => {
	const AddressRegency = sequelize.define('address_regencies', {
		id: {
			type: Sequelize.STRING,
			primaryKey: true
		},
		province_id: {
	        type: Sequelize.STRING,
	        primaryKey: true
	    },
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	}, {
		freezeTableName: true,
		timestamps: false,
	})

	AddressRegency.associate = function(models) {
        AddressRegency.hasMany(models.AddressDistrict, {
			as: 'districts',
			sourceKey: 'id',
			foreignKey: 'regency_id',
			onDelete: 'CASCADE'
		})

		AddressRegency.belongsTo(models.AddressProvince, { foreignKey: 'province_id' })
	}

	return AddressRegency
}