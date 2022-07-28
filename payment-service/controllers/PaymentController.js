const moment = require('moment')

const { XenditService } = require('../services/XenditService')
const { MidtransService } = require('../services/MidtransService')

let xenditService = new XenditService()
let midtransService = new MidtransService()

let percentToDecimal = (number) => number / parseFloat(100)
let calculateFeePercentage = (price, percentage) => (price / parseFloat(1 - percentage) - price) / parseFloat(price)

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

        case 'gopay':
            return Math.ceil(rawPrice * calculateFeePercentage(rawPrice, percentToDecimal(2)))

        case 'qris':
            return Math.ceil(rawPrice * calculateFeePercentage(rawPrice, percentToDecimal(0.7)))
    }
}

exports.createPayment = async (req, res) => {
    const customer = {
        fullname: 'Rahmat Ansori',
        firstname: 'Rahmat',
        lastname: 'Ansori',
        email: 'ansori34@gmail.com',
        phone: '+6285258754300',
    }

    const total = parseInt(req.body.total)
    const paymentFee = getPaymentFee(req.body.platform, total)

    const requestPayment = async (platform) => {
        switch (platform) {
            case 'bca':
            case 'bri':
            case 'bni':
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

            case 'gopay':
            case 'qris':
                return await midtransService.eWalletRequest({
                    order_id: req.body.order_id,
                    customer: customer,
                    platform: req.body.platform,
                    amount: total + paymentFee,
                    order_time: `${moment().format('YYYY-MM-DD HH:mm:ss')} +0700`
                })
        }
    }

    const paymentResult = await requestPayment(req.body.platform)

    if (!paymentResult.status) return console.log(paymentResult)

    const paymentData = paymentResult.data
    const data = {
        name: paymentData.name,
        total: total,
        fee: paymentFee,
        due: moment().add(1, 'd').format('YYYY-MM-DD HH:mm:ss'),
        date: null
    }

    if (paymentData['virtual_number'] != null) {
        data['virtual_number'] = paymentData.virtual_number
    }

    if (paymentResult['links'] != null) {
        data['links'] = paymentResult.links
    }

    return res.status(200).send({
        data: {
            pg_transaction_id: paymentData.transaction_id,
            pg_data: data,
            status: 'waiting'
        }
    })
}