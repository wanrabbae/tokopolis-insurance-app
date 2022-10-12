const { QueryTypes } = require('sequelize')

const { sequelize, Account, AddressProvince, AddressRegency,
    AddressDistrict, AddressVillage, Product, Vehicle,
    Transaction } = require('../models')

export default class TransactionRepository {
    constructor() {}

    async getTransactionAll(filter, limit, offset) {
        return await sequelize.query(`SELECT trans.id, trans.start_date, trans.status, ` +
            `client_transactions.fullname as client_name, agent_transactions.fullname as agent_name, ` +
            `vehicle.brand, vehicle.sub_model, product.name as product_name ` +
            `FROM transactions as trans ` +
            `LEFT JOIN accounts as client_transactions ON trans.client_id = client_transactions.id ` +
            `LEFT JOIN accounts as agent_transactions ON trans.agent_id = agent_transactions.id ` +
            `JOIN vehicles as vehicle ON trans.vehicle_id = vehicle.id ` +
            `JOIN products as product ON trans.product_id = product.id ` +
            `WHERE (client_transactions.fullname LIKE '%${filter.name}%' ` +
            `OR agent_transactions.fullname LIKE '%${filter.name}%') ` +
            `AND vehicle.brand LIKE '%${filter.vehicle_brand}%' ` +
            `AND vehicle.vehicle_type LIKE '%${filter.vehicle_type}%' ` +
            `AND product.name LIKE '%${filter.product_name}%' ` +
            `ORDER BY trans.created_at ASC ` +
            `LIMIT ${limit} OFFSET ${offset}`,
            { type: QueryTypes.SELECT })
    }

    async getTransactionDetail(id) {
        return await sequelize.query(`SELECT trans.id, trans.client_data, trans.address_detail, ` +
            `village.name as village_name, district.name as district_name, regency.name as regency_name, ` +
            `province.name as province_name, trans.start_date, trans.status, ` +
            `client_transactions.fullname as client_name, agent_transactions.fullname as agent_name, ` +
            `vehicle.brand, vehicle.sub_model, product.name as product_name, trans.documents, trans.price, ` +
            `trans.discount_format, trans.discount_total, trans.loading_rate, trans.expansions, trans.total, ` +
            `trans.status, trans.pg_data, trans.created_at ` +
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
            attributes: ['id', 'start_date', 'status'],
            where: {
                client_id: client_id,
            },
            include: [
                {
                    attributes: ['name'],
                    model: Product,
                    as: 'product'
                },
            ]
        })
    }

    async getClientTransactionDetail(client_id, id) {
        return await Transaction.findOne({
            where: {
                id: id,
                client_id: client_id,
            },
            include: [
                { model: Vehicle, as: 'vehicle' },
                { model: Product, as: 'product' },
            ]
        })
    }

    async getAgentTransactionDetail(agent_id, id) {
        return await Transaction.findOne({
            where: {
                id: id,
                agent_id: agent_id,
            },
            include: [
                { model: Vehicle, as: 'vehicle' },
                { model: Product, as: 'product' },
                {
                    model: AddressVillage,
                    as: 'village',
                    attributes: ['name'],
                    include: {
                        model: AddressDistrict,
                        attributes: ['name'],
                        include: {
                            model: AddressRegency,
                            attributes: ['name'],
                            include: {
                                model: AddressProvince,
                                attributes: ['name'],
                            }
                        }
                    }
                },
            ]
        })
    }

    async getTransactionByPaymentId(pg_transaction_id) {
        return await Transaction.findOne({
            where: { pg_transaction_id: pg_transaction_id },
            include: [
                { model: Account, as: 'account' }
            ]
        })
    }

    async getTransactionByAccountId(client_id) {
        return await Transaction.findAll({
            attributes: ['id', 'client_id', 'product_id',
                'start_date', 'status'],
            where: { client_id: client_id },
            include: [
                {
                    attributes: ['fullname'],
                    model: Account,
                    as: 'client_transactions'
                },
                {
                    attributes: ['name'],
                    model: Product,
                    as: 'product'
                },
            ]
        })
    }

    async getTransactionCount(filter) {
        return await sequelize.query(`SELECT COUNT(*) as total ` +
            `FROM transactions as trans ` +
            `LEFT JOIN accounts as client_transactions ON trans.client_id = client_transactions.id ` +
            `LEFT JOIN accounts as agent_transactions ON trans.agent_id = agent_transactions.id ` +
            `JOIN vehicles as vehicle ON trans.vehicle_id = vehicle.id ` +
            `JOIN products as product ON trans.product_id = product.id ` +
            `WHERE (client_transactions.fullname LIKE '%${filter.name}%' ` +
            `OR agent_transactions.fullname LIKE '%${filter.name}%') ` +
            `AND vehicle.brand LIKE '%${filter.vehicle_brand}%' ` +
            `AND vehicle.vehicle_type LIKE '%${filter.vehicle_type}%' ` +
            `AND product.name LIKE '%${filter.product_name}%' ` +
            `ORDER BY trans.created_at ASC `,
            { type: QueryTypes.SELECT })
    }

    // async getTransactionCount() {
    //     return await Transaction.count()
    // }

    async createTransaction(payload) {
        return await Transaction.create(payload)
    }

    async getPaymentData(client_id, transaction_id) {
        return await Transaction.findOne({
            where: {
                id: transaction_id,
                client_id: client_id
            },
            attributes: ['total', 'pg_data', 'status']
        })
    }

    async getAgentPaymentData(agent_id, transaction_id) {
        return await Transaction.findOne({
            where: {
                id: transaction_id,
                agent_id: agent_id
            },
            attributes: ['id', 'fee_admin', 'fee_pg', 'total',
                'pg_data', 'status']
        })
    }

    async setPaymentData(id, payload) {
        return await Transaction.update(payload, {
            where: { id: id }
        })
    }

    async setPaymentStatus(pg_transaction_id, payload) {
        return await Transaction.update(payload, {
            where: { pg_transaction_id: pg_transaction_id }
        })
    }
}