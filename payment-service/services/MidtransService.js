const Midtrans = require('midtrans-client')

exports.MidtransService = class {
    constructor() {
        this.midtransApi = new Midtrans.CoreApi({
            isProduction : false,
            serverKey : process.env.MIDTRANS_SERVER_KEY,
            clientKey : process.env.MIDTRANS_CLIENT_KEY
        })

        this.midtransEWalletSuccess = (platform, result) => {
            var links = {
                website: null,
                mobile: null,
                deeplink: null,
                qrcode: null,
            }

            if (platform == 'gopay') {
                links['qrcode'] = result.actions[0].url
                links['deeplink'] = result.actions[1].url
            }
            else {
                links['deeplink'] = result.actions[0].url
            }

            return {
                status: true,
                message: result.status_message,
                data: {
                    type: "ewallet",
                    name: platform,
                    transaction_id: result.transaction_id,
                    amount: result.gross_amount,
                    status: result.transaction_status
                },
                links: links
            }
        }

        this.midtransError = (error) => {
            return {
                status: false,
                message: error.ApiResponse.status_message
            }
        }
    }

    async eWalletRequest(payload) { // Gopay,QRIS
        var parameters = {
            "payment_type": payload.platform,
            "transaction_details": {
                "order_id": payload.order_id,
                "gross_amount": payload.amount
            },
            "customer_details": {
                "first_name": payload.customer.firstname,
                "last_name": payload.customer.lastname,
                "email": payload.customer.email,
                "phone": payload.customer.phone
            },
            "custom_expiry": {
                "order_time": payload.order_time,
                "expiry_duration": 24,
                "unit": "hour"
            }
        }

        return await this.midtransApi.charge(parameters)
            .then(result => this.midtransEWalletSuccess(payload.platform, result))
            .catch(this.midtransError)
    }
}