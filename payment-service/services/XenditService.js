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
                data: {
                    transaction_id: result.id,
                    type: "bank_transfer",
                    name: platform,
                    virtual_number: result.account_number,
                    amount: parseInt(result.expected_amount),
                    status: result.status
                }
            }
        }

        this.xenditEWalletSuccess = (platform, result) => {
            return {
                status: true,
                data: {
                    transaction_id: result.id,
                    type: "ewallet",
                    name: platform,
                    amount: parseInt(result.charge_amount),
                    status: result.status,
                    action: result.actions
                },
            }
        }

        this.xenditQRSuccess = (platform, result) => {
            return {
                status: true,
                data: {
                    transaction_id: result.id,
                    type: "qr",
                    name: platform,
                    qr_string: result.qr_string,
                    amount: parseInt(result.charge_amount),
                    status: result.status,
                },
            }
        }

        this.paymentCancel = () => {
            return {
                status: true,
                message: "success cancel the payment"
            }
        }

        this.xenditError = (error) => {
            return {
                status: false,
                message: error
            }
        }

        this.xenditDisbursmentSuccess = (result) => {
            return {
                status: true,
                data: result
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
            // virtualAccNumber: payload.customer.phone.split("+62")[1],
            isClosed: true,
            expirationDate: new Date(new Date().setDate(new Date().getDate() + 3)),
            // expirationDate: new Date(new Date().setMinutes(new Date().getMinutes() + 5)), // FOR TESTING
            isSingleUse: true,
            expectedAmt: payload.amount,
        }

        return await va.createFixedVA(parameters)
            .then(result => this.xenditBankSuccess(payload.platform, result))
            .catch(this.xenditError)
    }

    async disbursmentComission(payload) {
        const { Disbursement } = this.xenditApi
        const disburs = new Disbursement({})
        const parameters = {
            externalID: payload.external_id,
            bankCode: payload.bankCode,
            accountHolderName: payload.accountHolderName,
            accountNumber: payload.accountNumber,
            amount: payload.amount,
            description: "test"
        }

        return await disburs.create(parameters)
            .then(result => this.xenditDisbursmentSuccess(result))
            .catch(this.xenditError)
    }

    async disbursmentPoint(payload) {
        const { Disbursement } = this.xenditApi
        const disburs = new Disbursement({})
        const parameters = {
            externalID: payload.external_id,
            bankCode: payload.bankCode,
            accountHolderName: payload.accountHolderName,
            accountNumber: payload.accountNumber,
            amount: payload.amount,
            description: "test"
        }

        return await disburs.create(parameters)
            .then(result => this.xenditDisbursmentSuccess(result))
            .catch(this.xenditError)
    }

    async bankCancel(payload) {
        const { VirtualAcc } = this.xenditApi
        const va = new VirtualAcc({})

        const parameters = {
            id: payload.transaction_id,
            expirationDate: payload.expiration,
            expectedAmt: 20000,
        }

        return await va.updateFixedVA(parameters)
            .then(result => this.paymentCancel())
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
            .then(result => this.xenditEWalletSuccess(payload.platform, result))
            .catch(this.xenditError)
    }

    async eWalletCancel(payload) { // OVO,DANA,ShopeePay,LinkAja,Sakuku
        const { EWallet } = this.xenditApi
        const wallet = new EWallet({})

        const parameters = {
            chargeID: payload.transaction_id
        }

        return await wallet.voidEWalletCharge(parameters)
            .then(result => this.paymentCancel())
            .catch(this.xenditError)
    }

    async qrisRequest(payload) {
        const { QrCode } = this.xenditApi
        const qrcode = new QrCode({})

        const parameters = {
            externalID: payload.order_id,
            type: 'DYNAMIC',
            amount: payload.amount,
            callbackURL: payload.redirectSuccess
        }

        return await qrcode.createCode(parameters)
            .then(result => this.xenditQRSuccess(payload.platform, result))
            .catch(this.xenditError)
    }

    async disbursmentComission(payload) {
        const { Disbursement } = this.xenditApi
        const disburs = new Disbursement({})
        const parameters = {
            externalID: payload.external_id,
            bankCode: payload.bankCode,
            accountHolderName: payload.accountHolderName,
            accountNumber: payload.accountNumber,
            amount: payload.amount,
            description: "test"
        }

        return await disburs.create(parameters)
            .then(result => this.xenditDisbursmentSuccess(result))
            .catch(this.xenditError)
    }

    async disbursmentPoint(payload) {
        const { Disbursement } = this.xenditApi
        const disburs = new Disbursement({})
        const parameters = {
            externalID: payload.external_id,
            bankCode: payload.bankCode,
            accountHolderName: payload.accountHolderName,
            accountNumber: payload.accountNumber,
            amount: payload.amount,
            description: "test"
        }

        return await disburs.create(parameters)
            .then(result => this.xenditDisbursmentSuccess(result))
            .catch(this.xenditError)
    }
}