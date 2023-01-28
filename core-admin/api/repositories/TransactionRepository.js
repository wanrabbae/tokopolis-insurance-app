const { Op, QueryTypes } = require("sequelize");

const {
    sequelize,
    Account,
    AddressProvince,
    AddressRegency,
    AddressDistrict,
    AddressVillage,
    Product,
    Vehicle,
    Transaction,
    Comission,
    Point,
} = require("../models");

export default class TransactionRepository {
    constructor() {}

    async getTransactionAll(filter, limit, offset) {
        const dateFilter = `AND trans.start_date >= '${filter.start_period}' ` +
            `AND trans.start_date <= '${filter.end_period}' `

        return await sequelize.query(`SELECT trans.id, trans.start_date, trans.status, ` +
            `client_transactions.fullname as client_name, agent_transactions.fullname as agent_name, ` +
            `vehicle.brand, vehicle.sub_model, product.name as product_name ` +
            `FROM transactions as trans ` +
            `LEFT JOIN accounts as client_transactions ON trans.client_id = client_transactions.id ` +
            `LEFT JOIN accounts as agent_transactions ON trans.agent_id = agent_transactions.id ` +
            `JOIN vehicles as vehicle ON trans.vehicle_id = vehicle.id ` +
            `JOIN products as product ON trans.product_id = product.id ` +
            `WHERE trans.id LIKE '%${filter.id}%' ` +
            `AND (client_transactions.fullname LIKE '%${filter.name}%' ` +
            `OR agent_transactions.fullname LIKE '%${filter.name}%') ` +
            `AND vehicle.brand LIKE '%${filter.vehicle_brand}%' ` +
            `AND vehicle.sub_model LIKE '%${filter.vehicle_sub_model}%' ` +
            `AND vehicle.vehicle_type LIKE '%${filter.vehicle_type}%' ` +
            `AND product.name LIKE '%${filter.product_name}%' ` +
            (filter.start_period != null && filter.end_period != null ? dateFilter : '') +
            `AND trans.status IN ('waiting', 'paid') ` +
            `ORDER BY trans.created_at ASC ` +
            (limit != undefined && offset != undefined ? `LIMIT ${limit} OFFSET ${offset}` : ''),
            { type: QueryTypes.SELECT })
    }

    async getTransactionDetail(id) {
        return await sequelize.query(`SELECT trans.id, trans.client_data, trans.address_detail, ` +
            `village.name as village_name, district.name as district_name, regency.name as regency_name, ` +
            `province.name as province_name, trans.start_date, trans.status, ` +
            `client_transactions.fullname as client_name, agent_transactions.fullname as agent_name, ` +
            `vehicle.brand, vehicle.model, vehicle.sub_model, product.id as product_id, product.name as product_name, ` +
            `product.type as product_type, product.image as product_image, product.email as product_email, ` +
            `trans.vehicle_data, trans.documents, trans.assessment, trans.price, ` +
            `trans.discount_format, trans.discount_value, trans.discount_total, trans.loading_rate, trans.expansions, ` +
            `trans.fee_admin, trans.fee_stamp, trans.total, trans.status, trans.pg_data, trans.created_at ` +
            `FROM transactions as trans ` +
            `LEFT JOIN accounts as client_transactions ON trans.client_id = client_transactions.id ` +
            `LEFT JOIN accounts as agent_transactions ON trans.agent_id = agent_transactions.id ` +
            `JOIN vehicles as vehicle ON trans.vehicle_id = vehicle.id ` +
            `JOIN products as product ON trans.product_id = product.id ` +
            `JOIN address_villages as village ON trans.address_village_id = village.id ` +
            `JOIN address_districts as district ON village.district_id = district.id ` +
            `JOIN address_regencies as regency ON district.regency_id = regency.id ` +
            `JOIN address_provinces as province ON regency.province_id = province.id ` +
            `WHERE trans.id = '${id}' `,
            { type: QueryTypes.SELECT })
    }

    async getTransactionDetailForClient(id) {
        return await sequelize.query(`SELECT trans.id, trans.client_data, ` +
            `client_transactions.fullname as client_name, ` +
            `agent_transactions.fullname as agent_name, trans.vehicle_data ` +
            `FROM transactions as trans ` +
            `LEFT JOIN accounts as client_transactions ON trans.client_id = client_transactions.id ` +
            `LEFT JOIN accounts as agent_transactions ON trans.agent_id = agent_transactions.id ` +
            `WHERE trans.id = '${id}' `,
            { type: QueryTypes.SELECT })
    }

    async getTransactionForXlsx(data) {
        const dateFilter = `trans.start_date >= '${data.start_period}' ` +
            `AND trans.start_date <= '${data.end_period}' `

        return await sequelize.query(`SELECT trans.id, trans.client_data, trans.address_detail, ` +
            `village.name as village_name, district.name as district_name, regency.name as regency_name, ` +
            `province.name as province_name, trans.start_date, trans.status, ` +
            `client_transactions.fullname as client_name, agent_transactions.fullname as agent_name, ` +
            `vehicle.brand, vehicle.model, vehicle.sub_model, product.id as product_id, product.name as product_name, ` +
            `product.type as product_type, product.image as product_image, product.email as product_email, ` +
            `trans.vehicle_data, trans.documents, trans.assessment, trans.price, ` +
            `trans.discount_format, trans.discount_value, trans.discount_total, trans.loading_rate, trans.expansions, ` +
            `trans.fee_admin, trans.fee_stamp, trans.total, trans.status, trans.pg_data, trans.created_at ` +
            `FROM transactions as trans ` +
            `LEFT JOIN accounts as client_transactions ON trans.client_id = client_transactions.id ` +
            `LEFT JOIN accounts as agent_transactions ON trans.agent_id = agent_transactions.id ` +
            `JOIN vehicles as vehicle ON trans.vehicle_id = vehicle.id ` +
            `JOIN products as product ON trans.product_id = product.id ` +
            `JOIN address_villages as village ON trans.address_village_id = village.id ` +
            `JOIN address_districts as district ON village.district_id = district.id ` +
            `JOIN address_regencies as regency ON district.regency_id = regency.id ` +
            `JOIN address_provinces as province ON regency.province_id = province.id ` +
            `WHERE ${dateFilter}` +
            `AND trans.status IN ('waiting', 'paid') ` +
            `ORDER BY trans.created_at ASC `,
            { type: QueryTypes.SELECT })
    }


    // async getTransactionAll(limit, offset) {
    //     return await Transaction.findAll({
    //         attributes: ['id', 'start_date', 'status'],
    //         include: [
    //             {
    //                 attributes: ['fullname'],
    //                 model: Account,
    //                 as: 'client_transactions'
    //             },
    //             {
    //                 attributes: ['fullname'],
    //                 model: Account,
    //                 as: 'agent_transactions'
    //             },
    //             {
    //                 attributes: ['brand', 'sub_model'],
    //                 model: Vehicle,
    //                 as: 'vehicle'
    //             },
    //             {
    //                 attributes: ['name'],
    //                 model: Product,
    //                 as: 'product'
    //             },
    //         ],
    //         order: [
    //             ['created_at', 'ASC'],
    //         ],
    //         limit: limit,
    //         offset: offset,
    //     })
    // }

    async getClientTransactionAll(client_id) {
        return await Transaction.findAll({
            attributes: ["id", "start_date", "status"],
            where: {
                client_id: client_id,
            },
            include: [
                {
                    attributes: ["name"],
                    model: Product,
                    as: "product",
                },
            ],
        });
    }

    async getClientTransactionDetail(client_id, id) {
        return await Transaction.findOne({
            where: {
                id: id,
                client_id: client_id,
            },
            include: [
                { model: Vehicle, as: "vehicle" },
                { model: Product, as: "product" },
            ],
        });
    }

    async getAgentTransactionDetail(agent_id, id) {
        return await Transaction.findOne({
            where: {
                id: id,
                agent_id: agent_id,
            },
            include: [
                { model: Vehicle, as: "vehicle" },
                { model: Product, as: "product" },
                {
                    model: AddressVillage,
                    as: "village",
                    attributes: ["name"],
                    include: {
                        model: AddressDistrict,
                        attributes: ["name"],
                        include: {
                            model: AddressRegency,
                            attributes: ["name"],
                            include: {
                                model: AddressProvince,
                                attributes: ["name"],
                            },
                        },
                    },
                },
            ],
        });
    }

    async getTransactionByPaymentId(pg_transaction_id) {
        return await Transaction.findOne({
            where: { pg_transaction_id: pg_transaction_id },
            include: [{ model: Account, as: "account" }],
        });
    }

    async getTransactionByAccountId(account_id) {
        return await Transaction.findAll({
            attributes: [
                "id",
                "product_id",
                "start_date",
                "client_data",
                "status",
            ],
            where: {
                [Op.or]: [
                    { client_id: account_id },
                    { agent_id: account_id },
                ]
            },
            include: [
                {
                    attributes: ["name", "type"],
                    model: Product,
                    as: "product",
                },
                {
                    attributes: ["brand"],
                    model: Vehicle,
                    as: "vehicle",
                },
            ],
            order: [
                ['created_at', 'DESC'],
            ],
        });
    }

    async getTransactionCount(filter) {
        const dateFilter = `AND trans.start_date >= '${filter.start_period}' ` +
            `AND trans.start_date <= '${filter.end_period}' `

        return await sequelize.query(`SELECT COUNT(*) as total ` +
            `FROM transactions as trans ` +
            `LEFT JOIN accounts as client_transactions ON trans.client_id = client_transactions.id ` +
            `LEFT JOIN accounts as agent_transactions ON trans.agent_id = agent_transactions.id ` +
            `JOIN vehicles as vehicle ON trans.vehicle_id = vehicle.id ` +
            `JOIN products as product ON trans.product_id = product.id ` +
            `WHERE trans.id LIKE '%${filter.id}%' ` +
            `AND (client_transactions.fullname LIKE '%${filter.name}%' ` +
            `OR agent_transactions.fullname LIKE '%${filter.name}%') ` +
            `AND vehicle.brand LIKE '%${filter.vehicle_brand}%' ` +
            `AND vehicle.sub_model LIKE '%${filter.vehicle_sub_model}%' ` +
            `AND vehicle.vehicle_type LIKE '%${filter.vehicle_type}%' ` +
            `AND product.name LIKE '%${filter.product_name}%' ` +
            (filter.start_period != null && filter.end_period != null ? dateFilter : '') +
            `AND trans.status IN ('waiting', 'paid') ` +
            `ORDER BY trans.created_at ASC `,
            { type: QueryTypes.SELECT })
    }

    async getTransactionTotal(account_id) {
        return await Transaction.count({
            where: {
                [Op.or]: [
                    { client_id: account_id },
                    { agent_id: account_id },
                ]
            },
        })
    }

    async createTransaction(payload) {
        return await Transaction.create(payload);
    }

    async updateTransaction(id, payload) {
        return await Transaction.update(payload, {
            where: { id: id },
        });
    }

    async getPaymentData(client_id, transaction_id) {
        return await Transaction.findOne({
            where: {
                id: transaction_id,
                client_id: client_id,
            },
            attributes: ["total", "pg_data", "status"],
        });
    }

    async getAgentPaymentData(agent_id, transaction_id) {
        return await Transaction.findOne({
            where: {
                id: transaction_id,
                agent_id: agent_id,
            },
            attributes: [
                "id",
                "fee_admin",
                "fee_stamp",
                "fee_pg",
                "total",
                "pg_data",
                "status",
            ],
        });
    }

    async setPaymentStatus(pg_transaction_id, payload) {
        return await Transaction.update(payload, {
            where: { pg_transaction_id: pg_transaction_id },
        });
    }

    async createComission(payload) {
        return await Comission.create(payload);
    }

    async getComission(account_id) {
        return await Comission.findAll({
            attributes: [
                "id",
                [sequelize.fn("sum", sequelize.col("value")), "value"],
            ],
            where: {
                account_id: account_id,
            },
        })
    }

    async getComissionHistory(account_id) {
        return await Comission.findAll({
            where: {
                account_id: account_id,
            },
        });
    }

    async getPointHistory(account_id) {
        return await Point.findAll({
            where: {
                account_id: account_id,
            },
        });
    }

    async getPoint(account_id) {
        return await Point.findAll({
            attributes: [
                "id",
                [sequelize.fn("sum", sequelize.col("value")), "value"],
            ],
            where: {
                account_id: account_id,
            },
        })
    }

    async createPoint(payload) {
        return await Point.create(payload);
    }
}
