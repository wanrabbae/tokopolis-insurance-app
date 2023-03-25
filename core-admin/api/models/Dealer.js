module.exports = (sequelize, Sequelize) => {
	const Dealer = sequelize.define('dealers', {
		id: {
			type: Sequelize.STRING,
			primaryKey: true
		},
		other_id: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
	}, {
		freezeTableName: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	})

	Dealer.associate = function(models) {
		Dealer.hasMany(models.Account, {
            as: "accounts",
            sourceKey: "id",
            foreignKey: "dealer_id",
        });
	}

	return Dealer
}