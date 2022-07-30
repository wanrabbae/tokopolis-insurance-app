const Midtrans = require('midtrans-client')

exports.MidtransService = class {
    constructor() {
        this.midtransApi = new Midtrans.CoreApi({
            isProduction : false,
            serverKey : process.env.MIDTRANS_SERVER_KEY,
            clientKey : process.env.MIDTRANS_CLIENT_KEY
        })

        this.midtransGopaySuccess = (platform, result) => {
            return {
                status: true,
                message: result.status_message,
                data: {
                    transaction_id: result.transaction_id,
                    type: "ewallet",
                    name: platform,
                    amount: parseInt(result.gross_amount),
                    status: result.transaction_status,
                    actions: result.actions
                },
            }
        }

        this.midtransError = (error) => {
            return {
                status: false,
                message: error.ApiResponse.status_message
            }
        }
    }

    async gopayRequest(payload) {
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
            .then(result => this.midtransGopaySuccess(payload.platform, result))
            .catch(this.midtransError)
    }
}