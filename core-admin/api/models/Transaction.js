module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define('transactions', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
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
        address_village_id: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        address_detail: {
            type: Sequelize.STRING,
        },
        is_address_used_to_ship: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        start_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        is_new_condition: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        vehicle_data: {
            type: Sequelize.JSON,
        },
        documents: {
            type: Sequelize.JSON,
        },
        assessment: {
            type: Sequelize.JSON,
        },
        rate: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        discount_format: {
            type: Sequelize.ENUM('amount', 'percent'),
            defaultValue: 'amount'
        },
        discount_value: {
            type: Sequelize.INTEGER,
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
        extra_point: {
            type: Sequelize.INTEGER,
        },
        expansion_price: {
            type: Sequelize.INTEGER
        },
        pg_transaction_id: {
            type: Sequelize.STRING,
        },
        pg_data: { // platform, due, date,
            type: Sequelize.JSON,
        },
        fee_admin: {
            type: Sequelize.INTEGER,
        },
        fee_stamp: {
            type: Sequelize.INTEGER,
        },
        fee_pg: {
            type: Sequelize.INTEGER,
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

    Transaction.associate = function (models) {
        Transaction.belongsTo(models.AddressVillage, { foreignKey: 'address_village_id', as: 'village' })
        Transaction.belongsTo(models.Account, { foreignKey: 'client_id', as: 'client_transactions' })
        Transaction.belongsTo(models.Account, { foreignKey: 'agent_id', as: 'agent_transactions' })
        Transaction.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id' })
        Transaction.belongsTo(models.Product, { foreignKey: 'product_id' })
    }

    return Transaction
}
