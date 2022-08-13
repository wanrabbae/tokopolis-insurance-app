const { Account, Product, Vehicle,
    Transaction } = require('../models')

export default class TransactionRepository {
    constructor() {}

    async getAll(client_id) {
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

    async getTransaction(client_id, id) {
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

    async getAgentTransaction(agent_id, id) {
        return await Transaction.findOne({
            where: {
                id: id,
                agent_id: agent_id,
            },
            include: [
                { model: Vehicle, as: 'vehicle' },
                { model: Product, as: 'product' },
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
                    as: 'account'
                },
                {
                    attributes: ['name'],
                    model: Product,
                    as: 'product'
                },
            ]
        })
    }

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
            attributes: ['total', 'pg_data', 'status']
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