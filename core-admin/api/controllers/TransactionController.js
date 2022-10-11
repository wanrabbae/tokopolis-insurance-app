const moment = require('moment')

import AccountService from '../services/AccountService'
import ProductService from '../services/ProductService'
import TransactionService from '../services/TransactionService'
import PaymentService from '../services/PaymentService'
import PdfService from '../services/PdfService'

const validation = require('../validation/transaction.validation')
const { getMoment, moneyFormat,
    randomString, randomNumber, titleCase,
    percentToDecimal } = require('../utilities/functions')

const service = new TransactionService()
const accountService = new AccountService()
const productService = new ProductService()
const paymentService = new PaymentService()
const pdfService = new PdfService()

exports.getAll = async (req, res) => {
    const account = await accountService.getAccountData(req.account._id)
    if (account == null) return res.errorBadRequest(req.polyglot.t('error.auth'))

    const invoice = {
        shipping: {
            name: "Rahmat Ansori",
            address: "Perumdam BA 23",
            city: "Singosari",
            state: "Malang",
            country: "ID",
            postal_code: 94111
        },
        items: [
            {
                item: "Comprehensive",
                calculation: "IDR 226.200.000 x 3.18%",
                currency: "IDR",
                amount: 5474040
            },
            {
                item: "Earthquake",
                calculation: "IDR 226.200.000 x 0.12%",
                currency: "IDR",
                amount: 271440
            },
            {
                item: "Flood",
                calculation: "IDR 226.200.000 x 0.075%",
                currency: "IDR",
                amount: 169650
            },
            {
                item: "Personal Accident Passenger",
                calculation: "IDR 226.200.000 x 0.1% x [SEAT]",
                currency: "IDR",
                amount: 30000
            },
        ],
        subtotal: 5474040,
        paid: 0,
        invoice_nr: 1234
    };

    pdfService.createInvoice(invoice, 'document.pdf')

    const transaction = await service.getClientTransactionAll(account.id)
    if (transaction == null) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    return res.jsonData(transaction)
}

exports.transaction = async (req, res) => {
    if (req.session.product?.price == null) return res.errorBadRequest(req.polyglot.t('error.product.data'))
    if (req.account == null) return res.errorBadRequest(req.polyglot.t('error.auth'))

    return res.jsonData({
        plate: req.session.vehicle?.plate,
        price: req.session.product?.price
    })
}

exports.postOffer = async (req, res) => {
    const validate = validation.postTemporary(req)
    if (validate.error) return res.errorValidation(validate.details)

    const account = await accountService.getAccount(req.account._id)

    const vehicle = {
        year: req.session.vehicle.year,
        plate: req.session.vehicle.plate,
        price: req.session.vehicle.price,
    }

    const now = getMoment().format('yyyyMMDD')
    const nowHour = getMoment().format('HHmmss')
    const postfix = randomNumber(1111, 9999)

    const discountFormat = req.body.discount_format
    const discountTotal = req.body.discount_total || 0

    var basePrice = req.session.product.price

    // If agent give discount
    if (discountTotal != 0 &&
        (discountFormat == 'amount' && discountTotal > basePrice * percentToDecimal(25)) ||
        (discountFormat == 'percent' && discountTotal > 25)) {
        return res.errorBadRequest(req.polyglot.t('error.transaction'))
    }

    switch (discountFormat) {
        case 'amount':
            basePrice -= discountTotal
            break

        case 'percent':
            basePrice -= basePrice * percentToDecimal(discountTotal)
            break
    }

    const transaction = await service.createOffer({
        id: `TRX-${now}-${nowHour}-${postfix}`,
        agent_id: account.id,
        vehicle_id: req.session.vehicle.id,
        product_id: req.body.product_id,
        is_new_condition: true,
        vehicle_data: vehicle,
        start_date: req.session.product.start_date,
        price: basePrice,
        discount_format: discountFormat,
        discount_total: discountTotal,
        loading_rate: req.session.product.loading_rate,
        expansions: req.session.product.expansion,
        total: basePrice + req.session.product.expansion_price
    })

    return res.jsonData({
        transaction_id: transaction.id
    })
}

exports.postTemporary = async (req, res) => {
    const validate = validation.postTemporary(req)
    if (validate.error) return res.errorValidation(validate.details)

    const expList = await productService.getExpansionList(req.session.vehicle,
        req.body.product_id)
    const json = productService.getExpansionJson(req.body.exp)
    const expansions = productService.getExpansionWithPrice(expList, json)
    const expansionPrice = productService.getExpansionTotalPrice(expansions)

    const discountFormat = req.body.discount_format
    const discountTotal = req.body.discount_total || 0

    var basePrice = req.session.product.price

    // If agent give discount
    if (discountTotal != 0 &&
        (discountFormat == 'amount' && discountTotal > basePrice * percentToDecimal(25)) ||
        (discountFormat == 'percent' && discountTotal > 25)) {
        return res.errorBadRequest(req.polyglot.t('error.transaction'))
    }

    switch (discountFormat) {
        case 'amount':
            req.session.product.price -= discountTotal
            break

        case 'percent':
            req.session.product.price -= basePrice * percentToDecimal(discountTotal)
            break
    }

    req.session.product.expansion = expansions
    req.session.product.expansion_price = expansionPrice

    req.session.product.discount_format = discountFormat
    req.session.product.discount_total = discountTotal

    return res.jsonSuccess()
}

exports.postTransaction = async (req, res) => {
    const validate = validation.post(req)
    if (validate.error) return res.errorValidation(validate.details)

    if (req.session.vehicle == null) return res.errorBadRequest(req.polyglot.t('error.vehicle.data'))
    if (req.query.product_id == null) return res.errorBadRequest(req.polyglot.t('error.product.data'))
    if (req.account == null) return res.errorBadRequest(req.polyglot.t('error.auth'))

    const account = await accountService.getAccount(req.account._id)
    const condition = req.body.condition == "new" ? true : false

    const validateFile = condition ? validation.fileNew(req) : validation.fileOld(req)
    if (validateFile.error) return res.errorValidation(validateFile.details)

    const vehicle = {
        year: req.session.vehicle.year,
        plate: req.session.vehicle.plate,
        plate_detail: req.body.plate_detail,
        color: req.body.vehicle_color,
        machine_number: req.body.machine_number,
        skeleton_number: req.body.skeleton_number,
        price: req.session.vehicle.price,
    }

    const now = getMoment().format('yyyyMMDD')
    const nowHour = getMoment().format('HHmmss')
    const postfix = randomNumber(1111, 9999)

    const transaction = await service.createTransaction({
        id: `TRX-${now}-${nowHour}-${postfix}`,
        agent_id: account.id,
        vehicle_id: req.session.vehicle.id,
        product_id: req.query.product_id,
        client_data: {
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
        },
        address_village_id: req.body.address_village_id,
        address_detail: req.body.address_detail,
        is_address_used_to_ship: req.body.use_address_to_ship === 'true',
        is_new_condition: condition,
        vehicle_data: vehicle,
        start_date: req.session.product.start_date,
        price: req.session.product.price,
        discount_format: req.session.product.discount_format,
        discount_total: req.session.product.discount_total,
        loading_rate: req.session.product.loading_rate,
        expansions: req.session.product.expansion,
        total: req.session.product.price + req.session.product.expansion_price
    }, req.files)

    return res.jsonData({
        transaction_id: transaction.id
    })
}

const getPaymentGatewayFee = async (platform, total) => {
    const result = await paymentService.getFee({
        platform: platform,
        total: total,
    })

    if (!result) return null

    return result.data
}

const getAdminFee = () => {
    return 50000
}

exports.review = async (req, res) => {
    const validate = validation.review(req)
    if (validate.error) return res.errorValidation(validate.details)

    const account = await accountService.getAccountData(req.account._id)
    if (account == null) return res.errorBadRequest(req.polyglot.t('error.auth'))

    const transaction = await service.getAgentTransactionDetail(account.id, req.query.transaction_id)
    if (transaction == null) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    var client = null

    if (transaction.client_data) {
        const village = transaction.village
        const district = village?.address_district
        const regency = district?.address_regency
        const province = regency?.address_province

        client = {
            fullname: transaction.client_data.fullname,
            email: transaction.client_data.email != "null" ?
                transaction.client_data.email : null,
            phone: transaction.client_data.phone != "null" ?
                transaction.client_data.phone : null,
            address: {
                detail: transaction.address_detail,
                village: titleCase(village.name),
                district: titleCase(district.name),
                regency: titleCase(regency.name),
                province: titleCase(province.name),
            },
        }
    }

    const adminFee = getAdminFee()

    return res.jsonData({
        client: client,
        vehicle: {
            condition: transaction.is_new_condition ? true : false,
            brand: transaction.vehicle.brand,
            model: transaction.vehicle.model,
            sub_model: transaction.vehicle.sub_model,
            year: transaction.vehicle_data?.year,
            price: transaction.vehicle_data?.price,
            plate: transaction.vehicle_data?.plate,
            plate_detail: transaction.vehicle_data?.plate_detail,
            protection: transaction.product.type,
            color: transaction.vehicle_data?.color,
            machine_number: transaction.vehicle_data?.machine_number,
            skeleton_number: transaction.vehicle_data?.skeleton_number,
        },
        transaction: {
            id: transaction.id,
            product: transaction.product?.name,
            start_date: transaction.start_date,
            price: transaction.price,
            documents: transaction.documents,
            expansions: transaction.expansions,
            fee_admin: adminFee,
            total: transaction.total,
        }
    })
}

exports.getPaymentFee = async (req, res) => {
    const validate = validation.getPaymentFee(req)
    if (validate.error) return res.errorValidation(validate.details)

    const paymentRequest = await getPaymentGatewayFee(req.query.platform, req.query.total)

    return res.jsonData(paymentRequest)
}

exports.doPayment = async (req, res) => {
    const validate = validation.createPayment(req)
    if (validate.error) return res.errorValidation(validate.details)

    const account = await accountService.getAccountData(req.account._id)
    if (account == null) return res.errorBadRequest(req.polyglot.t('error.auth'))

    const transaction = await service.getAgentTransactionDetail(account.id, req.body.transaction_id)
    if (transaction == null) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    const adminFee = getAdminFee()
    const paymentFee = await getPaymentGatewayFee(req.body.platform, transaction.total)

    const payload = {
        order_id: transaction.id,
        customer: {
            fullname: transaction.client_data.fullname,
            email: transaction.client_data.email != 'null' ?
                transaction.client_data.email : account.email,
            phone: transaction.client_data.phone != 'null' ?
                transaction.client_data.phone : account.profile?.phone,
        },
        platform: req.body.platform,
        total: transaction.total + adminFee + paymentFee,
    }

    const paymentRequest = await paymentService.createRequest(payload)

    if (paymentRequest.data) {
        const data = Object.assign({}, paymentRequest.data)

        delete data['transaction_id']
        delete data['status']

        data['due'] = getMoment().add(1, 'd').format('YYYY-MM-DD HH:mm:ss')

        await service.setPaymentData(transaction.id, {
            fee_admin: adminFee,
            fee_pg: paymentFee,
            pg_transaction_id: paymentRequest.data.transaction_id,
            pg_data: data,
            status: 'waiting'
        })

        service.sendEmailPayment({
            host: req.fullhost,
            target: account.email,
            title: req.polyglot.t('mail.payment.created'),
            data: {
                name: transaction.client_data.fullname,
                platform: data.name,
                virtual_number: data.virtual_number,
                total: moneyFormat(data.amount),
                date: data.due
            }
        })

        return res.jsonData(data)
    }

    return res.errorBadRequest()
}

exports.getPaymentDetail = async (req, res) => {
    const validate = validation.getPaymentDetail(req)
    if (validate.error) return res.errorValidation(validate.details)

    const data = await service.getAgentPaymentData(req.account._id, req.query.transaction_id)

    return res.jsonData(data)
}

exports.webhookMidtrans = async (req, res) => {
    const validate = validation.midtrans(req)
    if (validate.error) return res.errorValidation(validate.details)

    const transaction_id = req.body.transaction_id
    const status = () => {
        switch (req.body.transaction_status) {
            case 'settlement':
            case 'capture':
                return 'paid'

            case 'deny':
                return 'denied'

            case 'cancel':
                return 'canceled'

            case 'failure':
                return 'failed'
        }
    }

    const transaction = await service.getTransactionByPaymentId(transaction_id)
    if (transaction == null) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    const result = status()
    const platform = paymentService.getPlatformName(transaction.pg_data.name)

    transaction.pg_data['date'] = getMoment().format('YYYY-MM-DD HH:mm:ss')

    await service.setPaymentStatus(transaction_id, {
        pg_data: transaction.pg_data,
        status: result,
    })

    if (result == 'paid') {
        service.sendEmailPaymentSuccess({
            host: req.fullhost,
            target: transaction.account.email,
            title: req.polyglot.t('mail.payment.success'),
            data: {
                name: transaction.account.firstname,
                platform: platform,
                total: moneyFormat(transaction.total),
                date: getMoment().format('D MMMM YYYY h:mm:ss')
            }
        })
    }

    return res.jsonSuccess(req.polyglot.t('success.webhook.midtrans'))
}

exports.webhookXendit = async (req, res) => {
    const validate = validation.xendit(req)
    if (validate.error) return res.errorValidation(validate.details)

    const transaction_id = req.body.data.id
    const status = () => {
        switch (req.body.data.status) {
            case 'SUCCEEDED':
                return 'paid'

            case 'FAILED':
                return 'denied'

            case 'VOIDED':
                return 'canceled'
        }
    }

    const transaction = await service.getTransactionByPaymentId(transaction_id)
    if (transaction == null) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    const result = status()
    const platform = paymentService.getPlatformName(transaction.pg_data.name)

    transaction.pg_data['date'] = getMoment().format('YYYY-MM-DD HH:mm:ss')

    await service.setPaymentStatus(transaction_id, {
        pg_data: transaction.pg_data,
        status: result,
    })

    if (result == 'paid') {
        service.sendEmailPaymentSuccess({
            host: req.fullhost,
            target: transaction.account.email,
            title: req.polyglot.t('mail.payment.success'),
            data: {
                name: transaction.account.firstname,
                platform: platform,
                total: moneyFormat(transaction.total),
                date: getMoment().format('D MMMM YYYY h:mm:ss')
            }
        })
    }

    return res.jsonSuccess(req.polyglot.t('success.webhook.xendit'))
}