const request = require('request-promise')

export default class PaymentService {
    constructor () {
        const host = process.env.PAYMENT_SERVICE_HOST
        const port = process.env.PAYMENT_SERVICE_PORT

        this.url = `http://${host}:${port}`
    }

    async getFee(payload) {
        var clientServerOptions = {
            uri: `${this.url}/payment`,
            qs: payload,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        }

        return await request(clientServerOptions, function (error, response) {
            if (error != null) return error

            return response.body
        })
    }

    async createRequest(payload) {
        var clientServerOptions = {
            uri: `${this.url}/payment`,
            body: payload,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        }

        return await request(clientServerOptions, function (error, response) {
            if (error != null) return error

            return response.body
        })
    }

    async simulateVA(payload) {
        var clientServerOptions = {
            uri: `${this.url}/payment/simulate-va`,
            body: payload,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        }

        return await request(clientServerOptions, function (error, response) {
            if (error != null) return error

            return response.body
        })
    }


    async comissionWithdraw(payload) {
        var clientServerOptions = {
            uri: `${this.url}/payment/comission/withdraw`,
            body: payload,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        }

        return await request(clientServerOptions, function (error, response) {
            if (error != null) return error

            return response.body
        })
    }

    async pointWithdraw(payload) {
        var clientServerOptions = {
            uri: `${this.url}/payment/point/withdraw`,
            body: payload,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        }

        return await request(clientServerOptions, function (error, response) {
            if (error != null) return error

            return response.body
        })
    }

}