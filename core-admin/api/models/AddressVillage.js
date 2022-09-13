module.exports = (sequelize, Sequelize) => {
	const AddressVillage = sequelize.define('address_villages', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		district_id: {
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

	AddressVillage.associate = function(models) {
		AddressVillage.belongsTo(models.AddressDistrict, { foreignKey: 'district_id' })
	}

	return AddressVillage
}