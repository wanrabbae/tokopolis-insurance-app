'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('transactions', {
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
				primaryKey: true
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
                comment: "If the car condition is new, use BASTK, ID Card. If not, use STNK, Front Side, Back Side, Left Side, Right Side, Dashboard instead",
			},
			assessment: {
				type: Sequelize.JSON,
                comment: "Required if document assessment is done",
			},
			rate: {
				type: Sequelize.FLOAT,
				allowNull: false,
                comment: "Product Premium Rate",
			},
			price: {
				type: Sequelize.INTEGER,
				allowNull: false,
                comment: "Product Base Price",
			},
            discount_format: {
                type: Sequelize.ENUM('amount', 'percentage'),
                defaultValue: 'amount',
                comment: "Required if agent using discount",
            },
            discount_value: {
                type: Sequelize.INTEGER,
                comment: "Required if agent using discount",
            },
            discount_total: {
                type: Sequelize.INTEGER,
                comment: "Required if agent using discount",
            },
			loading_rate: {
				type: Sequelize.INTEGER,
				allowNull: false,
                comment: "Loading rate based on product price and purchase year",
			},
			expansions: {
				type: Sequelize.JSON,
				allowNull: false,
                comment: "Product Expansions",
			},
			total: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			pg_transaction_id: {
				type: Sequelize.STRING,
                comment: "Transaction ID from Midtrans / Xendit"
			},
			pg_data: { // platform, due, date,
				type: Sequelize.JSON,
                comment: "Required if pg_transaction_id not null"
			},
            fee_admin: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            fee_stamp: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
			status: {
				type: Sequelize.ENUM('open', 'waiting', 'paid', 'denied', 'canceled'),
				defaultValue: 'open'
			},
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('transactions')
	}
}