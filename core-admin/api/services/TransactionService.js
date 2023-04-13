import Mailer from "../utilities/mail";
import TransactionRepository from "../repositories/TransactionRepository";

const { uploadHandler } = require("../utilities/functions");

export default class TransactionService {
    constructor() {
        this.repository = new TransactionRepository();
    }

    getTransactionAll(filter, limit, offset) {
        return this.repository.getTransactionAll(filter, limit, offset);
    }

    getTransactionAllWithAgent(filter, limit, offset, agent_ids) {
        return this.repository.getTransactionAllWithAgent(filter, limit, offset, agent_ids);
    }

    getTransactionStatusAll(status, limit, offset) {
        return this.repository.getTransactionStatusAll(status, limit, offset);
    }

    getTransactionDetail(id) {
        return this.repository.getTransactionDetail(id);
    }

    getTransactionStatusAll(status, limit, offset) {
        return this.repository.getTransactionStatusAll(status, limit, offset);
    }

    getTransactionDetailForClient(id) {
        return this.repository.getTransactionDetailForClient(id);
    }

    getTransactionDetailWithVA(VA_number) {
        return this.repository.getTransactionDetailWithVA(VA_number)
    }

    getTransactionForXlsx(data) {
        return this.repository.getTransactionForXlsx(data);
    }

    getClientTransactionAll(client_id) {
        return this.repository.getClientTransactionAll(client_id);
    }

    getClientTransactionDetail(client_id, id) {
        return this.repository.getClientTransactionDetail(client_id, id);
    }

    getAgentTransactionDetail(agent_id, id) {
        return this.repository.getAgentTransactionDetail(agent_id, id);
    }

    getTransactionByPaymentId(pg_transaction_id) {
        return this.repository.getTransactionByPaymentId(pg_transaction_id);
    }

    getTransactionByAccountId(account_id) {
        return this.repository.getTransactionByAccountId(account_id);
    }

    getTransactionCount(filter) {
        return this.repository.getTransactionCount(filter);
    }

    getTransactionStatusCount(filter) {
        return this.repository.getTransactionStatusCount(filter);
    }

    getTransactionTotal(account_id) {
        return this.repository.getTransactionTotal(account_id)
    }

    createOffer(payload) {
        return this.repository.createTransaction(payload);
    }

    createTransaction(payload, files) {
        const documents = {};

        Object.keys(files).forEach((key) => {
            const image = uploadHandler(files[key][0].path, "transaction");
            documents[key] = image.clearPath;
        });

        payload.documents = documents;

        return this.repository.createTransaction(payload);
    }

    updateTransaction(id, payload, files) {
        const documents = {};

        Object.keys(files).forEach((key) => {
            const image = uploadHandler(files[key][0].path, "transaction");
            documents[key] = image.clearPath;
        });

        payload.documents = documents;

        return this.repository.updateTransaction(id, payload);
    }

    getPaymentData(client_id, transaction_id) {
        return this.repository.getPaymentData(client_id, transaction_id);
    }

    getAgentPaymentData(agent_id, transaction_id) {
        return this.repository.getAgentPaymentData(agent_id, transaction_id);
    }

    setPaymentData(id, payload) {
        return this.repository.updateTransaction(id, payload);
    }

    setPaymentStatus(pg_transaction_id, payload) {
        return this.repository.setPaymentStatus(pg_transaction_id, payload);
    }

    createComission(payload) {
        return this.repository.createComission(payload);
    }

    getComission(account_id) {
        return this.repository.getComission(account_id);
    }

    getComissionHistory(account_id) {
        return this.repository.getComissionHistory(account_id);
    }

    getComissionHistoryUnder(account_ids, filter) {
        return this.repository.getComissionHistoryUnder(account_ids, filter);
    }

    getPoint(account_id) {
        return this.repository.getPoint(account_id);
    }

    getPointHistory(account_id, filter) {
        return this.repository.getPointHistory(account_id, filter);
    }

    getPointHistoryUnder(account_ids, filter) {
        return this.repository.getPointHistoryUnder(account_ids, filter);
    }

    createPoint(payload) {
        return this.repository.createPoint(payload);
    }

    getPointAgents(account_ids, req) {
        return this.repository.getPointAgents(account_ids, req);
    }

    sendEmailPayment(payload) {
        let mailer = new Mailer(payload.host);
        // mailer.setUrl('/path')
        mailer.setType("payment-created");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: payload.data.name,
            total: payload.data.total,
            platform: payload.data.platform,
            virtual_number: payload.data.virtual_number,
            date: payload.data.date,
        });
        mailer.send();
    }

    sendEmailPaymentSuccess(payload) {
        let mailer = new Mailer(payload.host);
        // mailer.setUrl('/path')
        mailer.setType("payment-success");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: payload.data.name,
            total: payload.data.total,
            platform: payload.data.platform,
            date: payload.data.date,
        });
        mailer.send();
    }

    addReview(id, payload) {
        return this.repository.updateTransaction(id, {
            assessment: payload
        })
    }

    sendEmailTransactionFile(payload) {
        let mailer = new Mailer(payload.host);
        mailer.setType("transaction-file-sent");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: payload.data.name,
            product: payload.data.product,
            url: payload.data.url,
        });
        mailer.send();
    }

    sendEmailFeedBackAgent(payload) {
        let mailer = new Mailer(payload.host);
        mailer.setType("feedback-agent-sent");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: payload.data.name,
            message: payload.data.message,
            product: payload.data.product,
        });
        mailer.send();
    }
}
