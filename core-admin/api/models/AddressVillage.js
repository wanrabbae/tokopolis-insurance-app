module.exports = (sequelize, Sequelize) => {
	const AddressVillage = sequelize.define('address_villages', {
		id: {
			type: Sequelize.STRING,
			primaryKey: true
		},
		district_id: {
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

	AddressVillage.associate = function(models) {
        AddressVillage.hasMany(models.Transaction, {
			as: 'village',
			sourceKey: 'id',
			foreignKey: 'address_village_id',
			onDelete: 'CASCADE'
		})

        AddressVillage.belongsTo(models.AddressDistrict, { foreignKey: 'district_id' })
	}

	return AddressVillage
}