module.exports = (sequelize, Sequelize) => {
	const ProductFeature = sequelize.define('product_features', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		product_id: {
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		type: {
			type: Sequelize.ENUM('era', 'ambulance', 'call_center',
				'tow', 'replace_vehicle', 'taxi_fare', 'nfo',
				'repair_warranty', 'mobile_app', 'to_workshop', 'other'),
			allowNull: false,
		},
		short_description: {
			type: Sequelize.STRING,
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
	}, {
		defaultScope: {
			attributes: {
				exclude: ['product_id']
			}
		},
		freezeTableName: true,
		timestamps: false,
	})

	ProductFeature.associate = function(models) {
		ProductFeature.belongsTo(models.Product, { foreignKey: 'product_id' })
	}

	return ProductFeature
}