const Xendit = require('xendit-node')

let toDecimal = (valueInPercent) => valueInPercent / 100

exports.XenditService = class {
    constructor() {
        this.xenditApi = new Xendit({
            secretKey: process.env.XENDIT_SECRET_KEY
        })

        this.xenditBankSuccess = (platform, result) => {
            return {
                status: true,
                message: result.status_message,
                data: {
                    type: "bank_transfer",
                    name: platform,
                    virtual_number: result.account_number,
                    transaction_id: result.id,
                    amount: result.expected_amount,
                    status: result.status
                }
            }
        }

        this.xenditEWalletSuccess = (platform, result) => {
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

    async bankRequest(payload) {
        const { VirtualAcc } = this.xenditApi
        const va = new VirtualAcc({})

        const parameters = {
            externalID: payload.order_id,
            bankCode: payload.platform.toUpperCase(),
            name: payload.customer.fullname,
            isClosed: true,
            isSingleUse: true,
            expectedAmt: payload.amount,
        }

        return await va.createFixedVA(parameters)
            .then(result => {
                console.log(result)
                return this.xenditBankSuccess(payload.platform, result)
            })
            .catch(this.xenditError)
    }

    async eWalletRequest(payload) { // OVO,DANA,ShopeePay,LinkAja,Sakuku
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
            channelCode: channelCode(payload.platform),
            channelProperties: {
                mobileNumber: payload.customer.phone,
                successRedirectURL: payload.redirectSuccess
            },
        }

        return await wallet.createEWalletCharge(parameters)
            .then(result => {
                console.log(result)
                return this.xenditEWalletSuccess(payload.platform, result)
            })
            .catch(this.xenditError)
    }

    async xenditRetailRequest(payload) { // Indomaret,Alfamart
        const { RetailOutlet } = this.xenditApi
        const retail = new RetailOutlet({})

        return await retail.createFixedPaymentCode({
            externalID: payload.order_id,
            retailOutletName: payload.platform,
            name: payload.customer.fullname,
            expectedAmt: payload.amount,
        })
    }
}