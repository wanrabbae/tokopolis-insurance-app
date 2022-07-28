const { Account, AccountVehicle, Product, Vehicle,
    Transaction } = require('../models')

export default class TransactionRepository {
    constructor() {}

    async getAll(account_id) {
        return await Transaction.findAll({
            attributes: ['id', 'start_date', 'status'],
            where: {
                account_id: account_id,
            },
            include: [
                {
                    attributes: ['id'],
                    model: AccountVehicle,
                    include: { attributes: ['sub_model'], model: Vehicle }
                },
                {
                    attributes: ['name'],
                    model: Product,
                    as: 'product'
                },
            ]
        })
    }

    async getTransaction(account_id, id) {
        return await Transaction.findOne({
            where: {
                id: id,
                account_id: account_id,
            },
            include: [
                { model: Product, as: 'product' }
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

    async getTransactionByAccountId(account_id) {
        return await Transaction.findAll({
            attributes: ['id', 'account_id', 'product_id',
                'start_date', 'status'],
            where: { account_id: account_id },
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

    async getPaymentData(account_id, transaction_id) {
        return await Transaction.findOne({
            where: {
                id: transaction_id,
                account_id: account_id
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