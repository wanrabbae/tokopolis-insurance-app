module.exports = (sequelize, Sequelize) => {
	const Transaction = sequelize.define('transactions', {
		id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: Sequelize.VIRTUAL,
            get() {
                var prefix = "TRX"
                var combined = "0000000"

                return prefix + (combined + this.id).slice(combined.length * -1)
            }
        },
        account_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        account_vehicle_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        agent_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        start_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        documents: {
            type: Sequelize.JSON,
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        loading_rate: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        expansions: {
            type: Sequelize.JSON,
            allowNull: true,
        },
        pg_transaction_id: {
            type: Sequelize.STRING,
        },
        pg_data: { // platform, due, date,
            type: Sequelize.JSON,
        },
        total: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('open', 'waiting', 'paid', 'denied', 'canceled'),
            defaultValue: 'open'
        },
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
	}, {
		defaultScope: {
			attributes: {
				exclude: ['pg_transaction_id']
			}
		},
		freezeTableName: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		deletedAt: false,
	})

	Transaction.associate = function(models) {
        Transaction.belongsTo(models.Account, { foreignKey: 'account_id' })
        Transaction.belongsTo(models.AccountVehicle, { foreignKey: 'account_vehicle_id' })
        Transaction.belongsTo(models.Account, { foreignKey: 'agent_id' })
        Transaction.belongsTo(models.Product, { foreignKey: 'product_id' })
	}

	return Transaction
}
