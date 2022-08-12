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
        client_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        agent_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        vehicle_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        client_data: {
            type: Sequelize.JSON,
        },
        start_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        is_new_condition: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        vehicle_data: {
            type: Sequelize.JSON,
        },
        documents: {
            type: Sequelize.JSON,
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        discount_format: {
            type: Sequelize.ENUM('amount', 'percentage'),
            defaultValue: 'amount'
        },
        discount_total: {
            type: Sequelize.INTEGER,
        },
        loading_rate: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        expansions: {
            type: Sequelize.JSON,
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
        Transaction.belongsTo(models.Account, { foreignKey: 'client_id', as: 'client_transactions' })
        Transaction.belongsTo(models.Account, { foreignKey: 'agent_id', as: 'agent_transactions' })
        Transaction.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id' })
        Transaction.belongsTo(models.Product, { foreignKey: 'product_id' })
	}

	return Transaction
}
