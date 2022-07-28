const Midtrans = require('midtrans-client')
const Xendit = require('xendit-node')

const { getMoment } = require('../utilities/functions')
const { toDecimal } = require('../utilities/calculation')

export default class PaymentService {
    constructor() {
        this.midtransApi = new Midtrans.CoreApi({
            isProduction : false,
            serverKey : process.env.MIDTRANS_SERVER_KEY,
            clientKey : process.env.MIDTRANS_CLIENT_KEY
        })

        this.xenditApi = new Xendit({
            secretKey: process.env.XENDIT_SECRET_KEY
        })

        this.midtransPayload = (order_id, customer, amount) => {
            console.log(getMoment().format("YYYY-MM-DD HH:mm:ss"))
            return {
                "transaction_details": {
                    "order_id": order_id,
                    "gross_amount": amount
                },
                "customer_details": {
                    "first_name": customer.firstname,
                    "last_name": customer.lastname,
                    "email": customer.email,
                    "phone": customer.phone
                },
                "custom_expiry": {
                    "order_time": `${getMoment().format("YYYY-MM-DD HH:mm:ss")} +0700`,
                    "expiry_duration": 24,
                    "unit": "hour"
                }
            }
        }

        this.midtransBankSuccess = (platform, result) => {
            var data = {
                type: "bank_transfer",
                name: platform,
                transaction_id: result.transaction_id,
                amount: result.gross_amount,
                status: result.transaction_status
            }

            if (platform == 'mandiri') {
                data['virtual_number'] = result.bill_key
            }
            else if (platform == 'permata') {
                data['virtual_number'] = result.permata_va_number
            }
            else {
                data['virtual_number'] = result.va_numbers[0].va_number
            }

            return {
                status: true,
                message: result.status_message,
                data: data
            }
        }

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

        this.midtransRetailSuccess = (platform, result) => {
            return {
                status: true,
                message: result.status_message,
                data: {
                    type: "retail",
                    name: platform,
                    transaction_id: result.transaction_id,
                    virtual_number: result.payment_code,
                    amount: result.gross_amount,
                    status: result.transaction_status
                }
            }
        }

        this.midtransError = (error) => {
            return {
                status: false,
                message: error.ApiResponse.status_message
            }
        }

        this.xenditEWalletSuccess = (platform, result) => {
            console.log(result)
            var links = {
                website: null,
                mobile: null,
                deeplink: null,
                qrcode: null,
            }

            if (platform != 'ovo') {
                links = {
                    website: result.actions.desktop_web_checkout_url,
                    mobile: result.actions.mobile_web_checkout_url,
                    deeplink: result.actions.mobile_deeplink_checkout_url,
                    qrcode: result.actions.qr_checkout_string
                }
            }

            return {
                status: true,
                message: result.status_message,
                data: {
                    type: "ewallet",
                    name: platform,
                    transaction_id: result.id,
                    amount: result.charge_amount,
                    status: result.status
                },
                links: links
            }
        }

        this.xenditError = (error) => {
            return {
                status: false,
                message: error
            }
        }
    }

    async midtransBankRequest(payload) { // BCA,BNI,BRI,Mandiri,Permata
        var parameters = this.midtransPayload(payload.order_id,
            payload.customer, payload.amount)

        const otherData = (payload, value) => {
            switch (payload.platformName) {
                case 'bca':
                case 'bni':
                case 'bri':
                    value['payment_type'] = "bank_transfer"
                    value['bank_transfer'] = {
                        "bank": payload.platformName
                    }
                    break

                case 'mandiri':
                    value['payment_type'] = "echannel"
                    value['echannel'] = {
                        "bill_info1": "Payment:",
                        "bill_info2": "Online purchase"
                    }
                    break

                case 'permata':
                    value['payment_type'] = payload.platformName
                    break
            }

            return value
        }

        parameters = otherData(payload, parameters)

        return await this.midtransApi.charge(parameters)
            .then(result => this.midtransBankSuccess(payload.platformName, result))
            .catch(this.midtransError)
    }

    async midtransEWalletRequest(payload) { // Gopay,QRIS
        var parameters = this.midtransPayload(payload.order_id,
            payload.customer, payload.amount)

        parameters['payment_type'] = payload.platformName

        return await this.midtransApi.charge(parameters)
            .then(result => this.midtransEWalletSuccess(payload.platformName, result))
            .catch(this.midtransError)
    }

    async midtransRetailRequest(payload) { // Indomaret,Alfamart
        var parameters = this.midtransPayload(payload.order_id,
            payload.customer, payload.amount)

        parameters['payment_type'] = "cstore"
        parameters['cstore'] = {
            "store" : payload.platformName,
            "message" : "Message",
        }

        return await this.midtransApi.charge(parameters)
            .then(result => this.midtransRetailSuccess(payload.platformName, result))
            .catch(this.midtransError)
    }

    async midtransCancel(transaction_id) {
        return await this.midtransApi.transaction.cancel(transaction_id)
            .then(result => result)
            .catch(this.midtransError)
    }

    async xenditEWalletRequest(payload) { // OVO,DANA,ShopeePay,LinkAja,Sakuku
        const { EWallet } = this.xenditApi
        const wallet = new EWallet({})

        const channelCode = (input) => {
            switch (input) {
                case 'ovo': return 'ID_OVO'
                case 'dana': return 'ID_DANA'
                case 'shopeepay': return 'ID_SHOPEEPAY'
                case 'linkaja': return 'ID_LINKAJA'
                case 'sakuku': return 'ID_SAKUKU'
            }
        }

        const parameters = {
            referenceID: payload.order_id,
            currency: 'IDR',
            amount: payload.amount,
            checkoutMethod: 'ONE_TIME_PAYMENT',
            channelCode: channelCode(payload.platformName),
            channelProperties: {
                mobileNumber: payload.customer.phone,
                successRedirectURL: 'http://localhost'
            },
            // customerID: 'wew-123',
            // paymentMethodId: 'payment-123',
        }

        return await wallet.createEWalletCharge(parameters)
            .then(result => this.xenditEWalletSuccess(payload.platformName, result))
            .catch(this.xenditError)
    }

    async xenditRetailRequest(payload) { // Indomaret,Alfamart
        const { RetailOutlet } = this.xenditApi
        const retail = new RetailOutlet({})

        return await retail.createFixedPaymentCode({
            externalID: payload.order_id,
            retailOutletName: payload.platformName,
            name: payload.customer.fullname,
            expectedAmt: payload.amount,
        })
    }

    getPlatformName(name) {
        if (['mandiri', 'permata', 'gopay', 'shopeepay',
            'linkaja', 'indomaret', 'alfamart'].includes(name)) {
            name = name.split(' ')
                .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                .join(' ')
        }
        else {
            name = name.toUpperCase()
        }

        if (['bca', 'bri', 'bni', 'mandiri', 'permata']
            .includes(name.toLowerCase())) {
            name = `${name} Virtual Account`
        }

        return name
    }

    async getAdminFee(platform, price = 0) {
        if (['bca', 'bni', 'bri', 'mandiri', 'permata'].includes(platform)) {
            return 4000
        }
        else if (['dana', 'ovo', 'shopeepay', 'linkaja'].includes(platform)) {
            return price * toDecimal(1.5)
        }
        else if (platform == 'gopay') {
            return price * toDecimal(2)
        }
        else if (platform == 'qris') {
            return price * toDecimal(0.7)
        }
    }
}