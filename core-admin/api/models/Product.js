module.exports = (sequelize, Sequelize) => {
	const Product = sequelize.define('products', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		type: {
			type: Sequelize.ENUM('comprehensive', 'tlo'),
			allowNull: false,
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
		image: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		tnc: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
		claim: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
		brochure_file: Sequelize.STRING,
		workshop_file: Sequelize.STRING,
		workshop_count: Sequelize.INTEGER,
		deleted_at: Sequelize.DATE,
	}, {
		freezeTableName: true,
		paranoid: true,
		createdAt: false,
		updatedAt: false,
		deletedAt: 'deleted_at',
	})

	Product.associate = function(models) {
		Product.hasMany(models.ProductFeature, {
			as: 'features',
			sourceKey: 'id',
			foreignKey: 'product_id',
			onDelete: 'CASCADE'
		})

		Product.hasMany(models.ProductExpansion, {
			as: 'expansions',
			sourceKey: 'id',
			foreignKey: 'product_id',
			onDelete: 'CASCADE'
		})

		Product.hasMany(models.Transaction, {
			as: 'transactions',
			sourceKey: 'id',
			foreignKey: 'product_id',
			onDelete: 'CASCADE'
		})
	}

	return Product
}