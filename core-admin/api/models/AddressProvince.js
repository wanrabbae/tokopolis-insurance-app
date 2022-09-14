module.exports = (sequelize, Sequelize) => {
	const AddressProvince = sequelize.define('address_provinces', {
		id: {
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

	AddressProvince.associate = function(models) {
        AddressProvince.hasMany(models.AddressRegency, {
			as: 'regencies',
			sourceKey: 'id',
			foreignKey: 'province_id',
			onDelete: 'CASCADE'
		})
	}

	return AddressProvince
}