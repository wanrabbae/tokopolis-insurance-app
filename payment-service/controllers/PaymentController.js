const moment = require('moment')

const { XenditService } = require('../services/XenditService')
const { MidtransService } = require('../services/MidtransService')
const axios = require('axios');

let xenditService = new XenditService()
let midtransService = new MidtransService()

let percentToDecimal = (number) => number / parseFloat(100)
let calculateFeePercentage = (price, percentage) => (price / parseFloat(1 - percentage) - price) / parseFloat(price) * 1.11 // Add VAT 11%

let calculatePaymentFee = (platform, rawPrice) => {
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

        default:
            return null
    }
}

exports.getPaymentFee = async (req, res) => {
    const platform = req.query.platform
    const total = req.query.total

    return res.status(200).send({
        data: calculatePaymentFee(platform, total)
    })
}

exports.createPayment = async (req, res) => {
    const customer = {
        fullname: req.body.customer.fullname,
        email: req.body.customer.email,
        phone: req.body.customer.phone,
    }

    const total = parseInt(req.body.total)
    const paymentFee = calculatePaymentFee(req.body.platform, total)

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

exports.cancelPayment = async (req, res) => {
    const transaction_id = req.body.transaction_id;

    const cancelPayment = async (platform) => {
        switch (platform) {
            case 'bca':
            case 'bni':
            case 'bri':
            case 'bsi':
            case 'bjb':
            case 'mandiri':
            case 'permata':
                return await xenditService.bankCancel({
                    transaction_id: transaction_id,
                    expiration: moment().add(-1, "days"),
                })

            case 'ovo':
            case 'dana':
            case 'shopeepay':
            case 'linkaja':
                return await xenditService.eWalletCancel({
                    transaction_id: transaction_id,
                })

            case 'qris':
                return {
                    status: false,
                    message: "Ups something went wrong!"
                }

            case 'gopay':
                return await midtransService.gopayCancel(transaction_id)
        }
    }

    const cancelResult = await cancelPayment(req.body.platform)

    if (!cancelResult.status) return res.status(400).send(cancelResult)

    return res.status(200).send(cancelResult)

}

exports.comissionWithdraw = async (req, res) => {
    try {
        const withdrawReq = await xenditService.disbursmentComission(req.body)
        return res.status(200).json(withdrawReq)
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.toString()
        })
    }
}

exports.pointWithdraw = async (req, res) => {
    try {
        const withdrawReq = await xenditService.disbursmentPoint(req.body)
        return res.status(200).json(withdrawReq)
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.toString()
        })
    }
}

exports.simulateVaPay = async (req, res) => {
    const transaction_id = req.body.transaction_id;
    const amount = req.body.amount;

    console.log(`[DEBUG]: simulateVaPay {transaction_id: ${transaction_id}, amount: ${amount}}`)

    try {
        const simulate = await axios.post(`https://api.xendit.co/callback_virtual_accounts/external_id=${transaction_id}/simulate_payment`, {
            amount: amount,
        }, {
            auth: {
                username: process.env.XENDIT_SECRET_KEY,
                password: ""
            }
        });

        if (simulate) {
            return res.status(200).json(simulate.data)
        }
    } catch (error) {
        return res.status(400).json(error.response.data)
    }
}