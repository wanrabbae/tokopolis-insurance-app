const moment = require('moment')

const { XenditService } = require('../services/XenditService')
const { MidtransService } = require('../services/MidtransService')

let xenditService = new XenditService()
let midtransService = new MidtransService()

let percentToDecimal = (number) => number / parseFloat(100)
let calculateFeePercentage = (price, percentage) => (price / parseFloat(1 - percentage) - price) / parseFloat(price) * 1.11 // Add VAT 11%

let getPaymentFee = (platform, rawPrice) => {
    switch (platform) {
        case 'bca':
        case 'bni':
        case 'bri':
        case 'bsi':
        case 'bjb':
        case 'mandiri':
        case 'permata':
            return 4500

        case 'ovo':
        case 'dana':
        case 'linkaja':
            return Math.ceil(rawPrice * calculateFeePercentage(rawPrice, percentToDecimal(1.5)))

        case 'shopeepay':
            return Math.ceil(rawPrice * calculateFeePercentage(rawPrice, percentToDecimal(1.8)))

        case 'qris':
            return Math.ceil(rawPrice * calculateFeePercentage(rawPrice, percentToDecimal(0.63)))

        case 'gopay':
            return Math.ceil(rawPrice * calculateFeePercentage(rawPrice, percentToDecimal(2)))
    }
}

exports.createPayment = async (req, res) => {
    const customer = {
        fullname: req.body.customer.fullname,
        email: req.body.customer.email,
        phone: req.body.customer.phone,
    }

    const total = parseInt(req.body.total)
    const paymentFee = getPaymentFee(req.body.platform, total)

    const requestPayment = async (platform) => {
        switch (platform) {
            case 'bca':
            case 'bni':
            case 'bri':
            case 'bsi':
            case 'bjb':
            case 'mandiri':
            case 'permata':
                return await xenditService.bankRequest({
                    order_id: req.body.order_id,
                    customer: customer,
                    platform: req.body.platform,
                    amount: total + paymentFee,
                })

            case 'ovo':
            case 'dana':
            case 'shopeepay':
            case 'linkaja':
                return await xenditService.eWalletRequest({
                    order_id: req.body.order_id,
                    customer: customer,
                    platform: req.body.platform,
                    redirectSuccess: process.env.XENDIT_EWALLET_REDIRECT_SUCCESS,
                    amount: total + paymentFee,
                })

            case 'qris':
                return await xenditService.qrisRequest({
                    order_id: req.body.order_id,
                    customer: customer,
                    redirectSuccess: process.env.XENDIT_EWALLET_REDIRECT_SUCCESS,
                    amount: total + paymentFee,
                })

            case 'gopay':
                return await midtransService.gopayRequest({
                    order_id: req.body.order_id,
                    customer: customer,
                    platform: req.body.platform,
                    amount: total + paymentFee,
                    order_time: `${moment().format('YYYY-MM-DD HH:mm:ss')} +0700`
                })
        }
    }

    const paymentResult = await requestPayment(req.body.platform)

    if (!paymentResult.status) return res.status(400).send(paymentResult)

    return res.status(200).send({
        data: paymentResult.data
    })
}