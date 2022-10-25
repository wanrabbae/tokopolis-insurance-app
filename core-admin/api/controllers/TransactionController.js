const moment = require('moment')
const axios = require('axios')

import AccountService from '../services/AccountService'
import ProductService from '../services/ProductService'
import TransactionService from '../services/TransactionService'
import PaymentService from '../services/PaymentService'
import PdfService from '../services/PdfService'

const validation = require('../validation/transaction.validation')
const { getMoment, moneyFormat, moneyFormatNonSymbol,
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

    const transaction = await service.getClientTransactionAll(account.id)
    if (transaction == null) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    return res.jsonData(transaction)
}

exports.transaction = async (req, res) => {
    const account = await accountService.getAccountData(req.account._id)
    if (account == null) return res.errorBadRequest(req.polyglot.t('error.auth'))

    if (req.query.transaction_id != null) {
        const transaction = await service.getAgentTransactionDetail(account.id, req.query.transaction_id)
        if (transaction == null) return res.errorBadRequest(req.polyglot.t('error.transaction'))

        const expansionPrice = productService.getExpansionTotalPrice(transaction.expansions)

        return res.jsonData({
            plate: transaction.vehicle_data.plate,
            price: {
                product: transaction.price,
                expansion: expansionPrice,
                discount: getDiscountValue(transaction.price, expansionPrice,
                    transaction.discount_format, transaction.discount_value)
            },
            client: {
                fullname: transaction.client_data.fullname,
                email: transaction.client_data.email != "null" ?
                    transaction.client_data.email : null,
                phone: transaction.client_data.phone != "null" ?
                    transaction.client_data.phone : null,
            }
        })
    } else {
        if (req.session.product?.price == null) return res.errorBadRequest(req.polyglot.t('error.product.data'))

        return res.jsonData({
            plate: req.session.vehicle?.plate,
            price: {
                product: req.session.product?.price,
                expansion: req.session.product.expansion_price,
                discount: getDiscountValue(req.session.product?.price,
                    req.session.product.expansion_price,
                    req.session.product.discount_format,
                    req.session.product.discount_value)
            },
        })
    }
}

const getExpansions = async (product_id, vehicle, expansionInput) => {
    const expList = await productService.getExpansionList(vehicle, product_id)
    const json = productService.getExpansionJson(expansionInput)
    const expansions = productService.getExpansionWithPrice(expList, json)
    const expansionPrice = productService.getExpansionTotalPrice(expansions)

    return {
        list: expansions,
        price: expansionPrice || 0
    }
}

const getTransactionID = () => {
    const now = getMoment().format('yyyyMMDD')
    const nowHour = getMoment().format('HHmmss')
    const postfix = randomNumber(1111, 9999)

    return `TRX-${now}-${nowHour}-${postfix}`
}

const getDiscountValue = (productPrice, expansionPrice, format, value) => {
    switch (format) {
        case 'amount':
            return value
        case 'percent':
            return percentToDecimal(value) * (productPrice + expansionPrice)
        default:
            return 0
    }
}

const fetchImage = async (src) => {
    const image = await axios.get(src, {
        responseType: 'arraybuffer'
    }).catch()

    if (!image) return null

    return image.data
}

const generateQuotation = async (payload) => {
    const productLogo = await fetchImage(`${process.env.HOST_ADMIN}${payload.product.image}`)
    const calculation = [
        {
            label: titleCase(payload.product.type),
            price: moneyFormatNonSymbol(payload.vehicle_data.price),
            percentage: '3.18%',
            total: moneyFormatNonSymbol(payload.price)
        },
    ]

    payload.expansions.forEach(expansion => {
        calculation.push({
            label: expansion.label,
            price: moneyFormatNonSymbol(expansion.price),
            percentage: '100%',
            total: moneyFormatNonSymbol(expansion.price),
        })
    })

    const data = {
        logo: {
            product: productLogo
        },
        header: [
            {
                label: 'Nomor',
                text: payload.id
            },
            {
                label: 'Jenis Asuransi',
                text: 'Asuransi Kendaraan Bermotor (PSAKBI)'
            },
            {
                label: 'Tanggal Terbit',
                text: moment(payload.created_at).format('LLL')
            },
        ],
        detail: [
            {
                label: 'Nama Tertanggung',
                text: payload.client_data.fullname,
            },
            {
                label: 'Nama Produk',
                text: payload.product.name,
            },
            {
                label: 'Tipe Perlindungan',
                text: titleCase(payload.product.type),
            },
            {
                label: 'Periode Asuransi',
                text: `${moment(payload.start_date).format('LL')} - ${moment(payload.start_date).add(1,'y').format('LL')}`,
            },
        ],
        vehicle: [
            {
                label: 'Merk',
                text: payload.vehicle.brand
            },
            {
                label: 'Model',
                text: payload.vehicle.sub_model
            },
            {
                label: 'Tipe',
                text: payload.vehicle.vehicle_type
            },
            {
                label: 'Kategori',
                text: payload.vehicle.category
            },
            {
                label: 'Tahun Produksi',
                text: payload.vehicle_data.year
            },
            // {
            //     label: 'Kategori Lokasi',
            //     text: ''
            // },
            // {
            //     label: 'Fungsi Kendaraan',
            //     text: ''
            // },
        ],
        calculation: calculation,
        currency: 'IDR',
        total: moneyFormatNonSymbol(payload.total),
        link: `${process.env.HOST_CLIENT}/asuransi/mobil/polis/pembelian?id=${payload.id}`
    }

    return await pdfService.createInvoice(data, `view/static/quotation/${payload.id}.pdf`)
}

exports.postOffer = async (req, res) => {
    const validate = validation.postOffer(req)
    if (validate.error) return res.errorValidation(validate.details)

    const account = await accountService.getAccount(req.account._id)

    const vehicle = {
        year: req.session.vehicle.year,
        capacity: req.session.vehicle.capacity,
        zone: req.session.vehicle.zone,
        plate: req.session.vehicle.plate,
        accessories: req.session.vehicle.accessories,
        price: req.session.vehicle.price,
    }

    const client = {
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
    }

    const expansion = await getExpansions(req.body.product_id, req.session.vehicle,
        req.body.exp)

    const discountFormat = req.body.discount_format
    const discountValue = req.body.discount_value || 0

    const discountMaxPercent = 25
    const discountMaxAmount = getDiscountValue(req.session.product.price,
            expansion.price, discountFormat, discountMaxPercent)

    // If agent give discount
    if (discountValue != 0 &&
        (discountFormat == 'amount' && discountValue > discountMaxAmount) ||
        (discountFormat == 'percent' && discountValue > discountMaxPercent)) {
        return res.errorBadRequest(req.polyglot.t('error.transaction'))
    }

    const discountTotal = getDiscountValue(req.session.product.price,
        expansion.price, discountFormat, discountValue)

    const newOffer = await service.createOffer({
        id: getTransactionID(),
        agent_id: account.id,
        vehicle_id: req.session.vehicle.id,
        product_id: req.body.product_id,
        client_data: client,
        is_new_condition: true,
        vehicle_data: vehicle,
        start_date: req.session.product.start_date,
        price: req.session.product.price,
        discount_format: discountFormat,
        discount_value: discountValue,
        discount_total: discountTotal,
        loading_rate: req.session.product.loading_rate,
        expansions: expansion.list,
        total: req.session.product.price + expansion.price - discountTotal
    })

    if (!newOffer)
        return res.errorBadRequest(req.polyglot.t('error.transaction.create'))

    const transaction = await service.getAgentTransactionDetail(account.id, newOffer.id)

    await generateQuotation(transaction)

    return res.jsonData({
        transaction_id: newOffer.id
    })
}

exports.postTemporary = async (req, res) => {
    const validate = validation.postTemporary(req)
    if (validate.error) return res.errorValidation(validate.details)

    const expansion = await getExpansions(req.body.product_id, req.session.vehicle,
        req.body.exp)

    const discountFormat = req.body.discount_format
    const discountValue = req.body.discount_value || 0

    const discountMaxPercent = 25
    const discountMaxAmount = getDiscountValue(req.session.product.price,
        expansion.price, discountFormat, discountMaxPercent)

    // If agent give discount
    if (discountValue != 0 &&
        (discountFormat == 'amount' && discountValue > discountMaxAmount) ||
        (discountFormat == 'percent' && discountValue > discountMaxPercent)) {
        return res.errorBadRequest(req.polyglot.t('error.transaction'))
    }

    const discountTotal = getDiscountValue(req.session.product.price,
        expansion.price, discountFormat, discountValue)

    req.session.product.expansion = expansion.list
    req.session.product.expansion_price = expansion.price

    req.session.product.discount_format = discountFormat
    req.session.product.discount_value = discountValue
    req.session.product.discount_total = discountTotal

    return res.jsonSuccess()
}

exports.postTransaction = async (req, res) => {
    const validate = validation.post(req)
    if (validate.error) return res.errorValidation(validate.details)

    if (req.account == null) return res.errorBadRequest(req.polyglot.t('error.auth'))
    if (req.query.product_id == null) return res.errorBadRequest(req.polyglot.t('error.product.data'))

    const usingTransactionID = req.body.transaction_id != null

    if (!usingTransactionID && req.session.vehicle == null)
        return res.errorBadRequest(req.polyglot.t('error.vehicle.data'))

    const account = await accountService.getAccount(req.account._id)
    const condition = req.body.condition == "new" ? true : false

    const validateFile = condition ? validation.fileNew(req) : validation.fileOld(req)
    if (validateFile.error) return res.errorValidation(validateFile.details)

    if (condition && req.body.plate_detail != null)
        return res.errorBadRequest(req.polyglot.t('error.vehicle.plate.new'))
    else if (!condition && req.body.plate_detail == null)
        return res.errorBadRequest(req.polyglot.t('error.vehicle.plate.old'))

    const client = {
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
    }

    if (usingTransactionID) {
        const transaction = await service.getAgentTransactionDetail(account.id, req.body.transaction_id)
        if (transaction == null) return res.errorBadRequest(req.polyglot.t('error.transaction'))

        const updatedTransaction = await service.updateTransaction(transaction.id, {
            address_village_id: req.body.address_village_id,
            address_detail: req.body.address_detail,
            is_address_used_to_ship: req.body.use_address_to_ship === 'true',
            is_new_condition: condition,
            client_data: client, // update
            vehicle_data: { // update
                year: transaction.vehicle_data.year,
                capacity: transaction.vehicle_data.capacity,
                zone: transaction.vehicle_data.zone,
                plate: transaction.vehicle_data.plate,
                accessories: transaction.vehicle_data.accessories,

                plate_detail: req.body.plate_detail,
                color: req.body.vehicle_color,
                machine_number: req.body.machine_number,
                skeleton_number: req.body.skeleton_number,

                price: transaction.vehicle_data.price,
            },
        }, req.files)

        if (!updatedTransaction)
            return res.errorBadRequest(req.polyglot.t('error.transaction.create'))

        return res.jsonData({
            transaction_id: transaction.id
        })
    }

    const newTransaction = await service.createTransaction({
        id: getTransactionID(),
        agent_id: account.id,
        vehicle_id: req.session.vehicle.id,
        product_id: req.query.product_id,
        client_data: client,
        address_village_id: req.body.address_village_id,
        address_detail: req.body.address_detail,
        is_address_used_to_ship: req.body.use_address_to_ship === 'true',
        is_new_condition: condition,
        vehicle_data: {
            year: req.session.vehicle.year,
            capacity: req.session.vehicle.capacity,
            zone: req.session.vehicle.zone,
            plate: req.session.vehicle.plate,
            accessories: req.session.vehicle.accessories,

            plate_detail: req.body.plate_detail,
            color: req.body.vehicle_color,
            machine_number: req.body.machine_number,
            skeleton_number: req.body.skeleton_number,

            price: req.session.vehicle.price,
        },
        start_date: req.session.product.start_date,
        price: req.session.product.price,
        discount_format: req.session.product.discount_format,
        discount_value: req.session.product.discount_value,
        discount_total: req.session.product.discount_total,
        loading_rate: req.session.product.loading_rate,
        expansions: req.session.product.expansion,
        total: req.session.product.price + req.session.product.expansion_price -
            req.session.product.discount_total
    }, req.files)

    if (!newTransaction)
        return res.errorBadRequest(req.polyglot.t('error.transaction.create'))

    return res.jsonData({
        transaction_id: newTransaction.id
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
            discount_format: transaction.discount_format,
            discount_value: transaction.discount_value,
            discount_total: transaction.discount_total,
            documents: transaction.documents,
            expansions: transaction.expansions,
            fee_admin: adminFee,
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
    const paymentFee = await getPaymentGatewayFee(req.body.platform, transaction.total + adminFee)

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
        // Send total without payment fee
        // Even so, the return value of the api is the same as the total.payload + paymentFee
        total: transaction.total + adminFee,
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