import Mailer from '../utilities/mail'
import TransactionRepository from '../repositories/TransactionRepository'

const { uploadHandler } = require('../utilities/functions')

export default class TransactionService {
    constructor() {
        this.repository = new TransactionRepository()
    }

    getAll(client_id) {
        return this.repository.getAll(client_id)
    }

    getTransaction(client_id, id) {
        return this.repository.getTransaction(client_id, id)
    }

    getAgentTransaction(agent_id, id) {
        return this.repository.getAgentTransaction(agent_id, id)
    }

    getTransactionByPaymentId(pg_transaction_id) {
        return this.repository.getTransactionByPaymentId(pg_transaction_id)
    }

    getTransactionByAccountId(client_id) {
        return this.repository.getTransactionByAccountId(client_id)
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

    getPaymentData(client_id, transaction_id) {
        return this.repository.getPaymentData(client_id, transaction_id)
    }

    getAgentPaymentData(agent_id, transaction_id) {
        return this.repository.getAgentPaymentData(agent_id, transaction_id)
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
        mailer.setType('payment-created')
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
        mailer.setType('payment-success')
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