module.exports = (sequelize, Sequelize) => {
	const AddressDistrict = sequelize.define('address_districts', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		regency_id: {
	        type: Sequelize.INTEGER,
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

	AddressDistrict.associate = function(models) {
        AddressDistrict.hasMany(models.AddressVillage, {
			as: 'villages',
			sourceKey: 'id',
			foreignKey: 'village_id',
			onDelete: 'CASCADE'
		})

		AddressDistrict.belongsTo(models.AddressRegency, { foreignKey: 'regency_id' })
	}

	return AddressDistrict
}