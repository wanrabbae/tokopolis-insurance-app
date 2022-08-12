const request = require('request-promise')

export default class PaymentService {
    async createRequest(payload) {
        const host = process.env.PAYMENT_SERVICE_HOST
        const port = process.env.PAYMENT_SERVICE_PORT

        var clientServerOptions = {
            uri: `http://${host}:${port}/payment`,
            body: JSON.stringify(payload),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const response = await request(clientServerOptions, function (error, response) {
            if (error != null) return error

            return response.body
        })

        return JSON.parse(response)
    }
}