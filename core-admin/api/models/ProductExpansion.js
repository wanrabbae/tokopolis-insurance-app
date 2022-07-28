module.exports = (sequelize, Sequelize) => {
	const ProductExpansion = sequelize.define('product_expansions', {
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
		label: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		rate: {
			type: Sequelize.INTEGER,
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

	ProductExpansion.associate = function(models) {
		ProductExpansion.belongsTo(models.Product, { foreignKey: 'product_id' })
	}

	return ProductExpansion
}