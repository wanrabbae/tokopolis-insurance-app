import Mailer from '../utilities/mail'
import TransactionRepository from '../repositories/TransactionRepository'

const { uploadHandler } = require('../utilities/functions')

export default class TransactionService {
    constructor() {
        this.repository = new TransactionRepository()
    }

    getAll(account_id) {
        return this.repository.getAll(account_id)
    }

    getTransaction(account_id, id) {
        return this.repository.getTransaction(account_id, id)
    }

    getTransactionByPaymentId(pg_transaction_id) {
        return this.repository.getTransactionByPaymentId(pg_transaction_id)
    }

    getTransactionByAccountId(account_id) {
        return this.repository.getTransactionByAccountId(account_id)
    }

    createOffer(payload) {
        return this.repository.createTransaction(payload)
    }

    createTransaction(payload, files) {
        const documents = {}

        Object.keys(files).forEach(key => {
            const image = uploadHandler(files[key][0].path, 'transaction')
            documents[key] = image.clearPath
        })

        payload.documents = documents

        return this.repository.createTransaction(payload)
    }

    getPaymentData(account_id, transaction_id) {
        return this.repository.getPaymentData(account_id, transaction_id)
    }

    setPaymentData(id, payload) {
        return this.repository.setPaymentData(id, payload)
    }

    setPaymentStatus(pg_transaction_id, payload) {
        return this.repository.setPaymentStatus(pg_transaction_id, payload)
    }

    sendEmailPayment(payload) {
        let mailer = new Mailer(payload.host)
        // mailer.setUrl('/path')
        mailer.setTemplate('payment-created')
        mailer.setTarget(payload.target)
        mailer.setMail(payload.title, {
            name: payload.data.name,
            total: payload.data.total,
            platform: payload.data.platform,
            virtual_number: payload.data.virtual_number,
            date: payload.data.date,
        })
        mailer.send()
    }

    sendEmailPaymentSuccess(payload) {
        let mailer = new Mailer(payload.host)
        // mailer.setUrl('/path')
        mailer.setTemplate('payment-success')
        mailer.setTarget(payload.target)
        mailer.setMail(payload.title, {
            name: payload.data.name,
            total: payload.data.total,
            platform: payload.data.platform,
            date: payload.data.date,
        })
        mailer.send()
    }
}