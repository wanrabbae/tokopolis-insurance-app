const excel = require('excel4node')
const moment = require('moment')
const fs = require('fs')
const archiver = require('archiver')

import { string } from 'joi'
import TransactionService from '../../services/TransactionService'
import AccountService from '../../services/AccountService'

const service = new TransactionService()
const accountService = new AccountService();

exports.list = async (req, res, next) => {

    const filter = {
        id: req.query.id || '',
        name: req.query.name || '',
        vehicle_brand: req.query.vehicle_brand || '',
        vehicle_sub_model: req.query.vehicle_sub_model || '',
        vehicle_type: req.query.vehicle_type || '',
        product_name: req.query.product_name || '',
        start_period: req.query.start_period || null,
        end_period: req.query.end_period || null,
    }

    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const count = await service.getTransactionCount(filter)
    const list = await service.getTransactionAll(filter, limit, offset)

    if (count.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))
    return res.jsonData({
        pagination: {
            total: count[0].total,
            per_page: limit,
            current_page: current,
            last_page: Math.ceil(count[0].total / limit),
        },
        list: list
    })
}

exports.history = async (req, res, next) => {
    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const count = await service.getTransactionStatusAll(req.query.status)
    const list = await service.getTransactionStatusAll(req.query.status, limit, offset)

    if (count.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))
    return res.jsonData({
        pagination: {
            total: count[0].total,
            per_page: limit,
            current_page: current,
            last_page: Math.ceil(count[0].total / limit),
        },
        list: list
    })
}

exports.detail = async (req, res, next) => {
    const data = await service.getTransactionDetail(req.params.id)
    if (data.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    return res.jsonData(data[0])
}

exports.feedbackAgent = async (req, res, next) => {
    const data = await service.getTransactionDetail(req.params.id)
    if (data.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    const findAccount = await accountService.getAccount(data[0].agent_id)

    service.sendEmailFeedBackAgent({
        host: process.env.REDIRECT_CLIENT || req.fullhost,
        target: findAccount.email,
        title: "Feedback to Agent",
        data: {
            name: data.client_data.fullname,
            message: req.body.message,
            product: data.product_name,
        },
    })

    return res.jsonData({
        message: "success feeback to agent"
    })
}

const generateXls = (review, transaction, destination) => {
    var workbook = new excel.Workbook()
    var worksheet = workbook.addWorksheet('Sheet1')

    const isNew = transaction.documents.bastk != undefined

    const accessoriesPriceTotal = transaction.vehicle_data.accessories.reduce((a, b) => a + b.price, 0)
    const expansionPriceTotal = transaction.expansions.reduce((a, b) => a + b.price, 0)

    var addressDetail = transaction.address_detail.split(' ')
    var postalCode = addressDetail.pop()

    var values = {
        'Registration Date': moment(transaction.created_at).format("DD/MMM/YYYY"),
        // 'Processed Time': '-', // get date ketika virtual account dibuat
        'Quotation No.': transaction.id,
        'Insurance Name': transaction.product_name,
        'Tokopolis Policy Number': '-',
        'Period Of Insured': `${moment(transaction.start_date).format("DD/MMM/YYYY")} - ${moment(transaction.start_date).add(1, 'year').format("DD/MMM/YYYY")}`,
        'Nomor Rangka': transaction.vehicle_data.skeleton_number,
        'Nomor Mesin': transaction.vehicle_data.machine_number,
        'Warna': transaction.vehicle_data.color,
        'Foto STNK': !isNew ? 'Terlampir' : 'N/A',
        'Foto Identitas': isNew ? 'Terlampir' : 'N/A',
        'Foto BSTK': isNew ? 'Terlampir' : 'N/A',
        'Tampak Depan': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Belakang': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Kanan': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Kiri': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Mesin': !isNew ? 'Terlampir' : 'N/A',
        'Tampak 3D': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Dashboard': !isNew ? 'Terlampir' : 'N/A',
        'Tahun Kendaraan': transaction.vehicle_data.year,
        // 'Pemakaian': transaction.vehicle_data.use == 'private' ? 'PERSONAL' : 'KOMERSIL',
        'Kondisi': isNew != undefined ? 'BARU' : 'BEKAS',
        'Merek Kendaraan': transaction.brand,
        'Tipe Kendaraan': transaction.model,
        'Seri Kendaraan': transaction.sub_model,
        'Nomor Polisi': !isNew && transaction.vehicle_data.plate_detail != undefined ?
            `${transaction.vehicle_data.plate} ${transaction.vehicle_data.plate_detail}` :
            transaction.vehicle_data.plate,
        'Coverage': transaction.product_type == 'comprehensive' ? 'Komprehensif' : 'Total Loss',
        'TSI': transaction.vehicle_data.price,
        'Premi Jaminan Utama': transaction.price,
        // ====================== LINE FOR EXPANSION_CODES ======================
        'Harga Aksesoris': accessoriesPriceTotal,
        'Detail Aksesoris': transaction.vehicle_data.accessories
            .map(item => `${item.type} (${item.brand})`)
            .join(', '),
        'GWP': transaction.price + expansionPriceTotal,
        'Diskon': transaction.discount_total,
        'Persenan Diskon': transaction.discount_format == 'percent' ? transaction.discount_value :
            transaction.discount_total / (transaction.price + expansionPriceTotal) * 100,
        'Biaya Admin': transaction.fee_admin + transaction.fee_stamp,
        'NWP': (transaction.price + expansionPriceTotal) - transaction.discount_total +
            transaction.fee_admin + transaction.fee_stamp, // gwp - discount + biaya admin
        'Nama Tertanggung': transaction.client_data.fullname,
        'Tipe Identitas Tertanggung': '-',
        'Alamat Tertanggung': (`${addressDetail.join(' ')}, ${transaction.village_name}, ` +
            `${transaction.district_name}, ${transaction.regency_name}, ` +
            `${transaction.province_name} ${postalCode}`)
            .replace((/  |\r\n|\n|\r/gm), ''),
        'Insurance Notes': Object.entries(review.item)
            .filter(el => el[1].note != null)
            .map(a => `${a[0]} (${a[1].note})`)
            .join(', ') || '-',
        'Quotation Status': 'WAITING',
    }

    const expansionCodes = {
        'srcc': 'STRIKE_RIOT_CIVIL_COMMOTION',
        'terorism': 'TERRORISM_SABOTAGE',
        'flood': 'TYPHOON_STORM_FLOOD_HAIL_LANDSLIDE',
        'earthquake': 'EARTHQUAKE_TSUNAMI_VOLCANIC_ERUPTION',
        'tpl': 'THIRD_PARTY_LIABILITY',
        'pad': 'PERSONAL_ACCIDENT_DRIVER',
        'pap': 'PERSONAL_ACCIDENT_PASSANGER',
        'taxi_allowance': 'TRANSPORTATION_ALLOWANCE',
    }

    // Append Expansion into object
    var expansionIndex = 30
    var valueEntries = Object.entries(values)

    for (const item of transaction.expansions) {
        if (item.code in expansionCodes) {
            valueEntries.splice(expansionIndex, 0, [expansionCodes[item.code], item.price])
        } else {
            valueEntries.splice(expansionIndex, 0, [item.code.toUpperCase(), item.price])
        }

        expansionIndex++
    }

    values = Object.fromEntries(valueEntries)

    // Print object into excel file
    for (let index = 0; index < Object.keys(values).length; index++) {
        const key = Object.keys(values)[index]

        worksheet.cell(1, index + 1).string(key)

        if (typeof values[key] == 'number')
            worksheet.cell(2, index + 1).number(values[key])
        else
            worksheet.cell(2, index + 1).string(values[key])
    }

    workbook.write(`${destination}/${transaction.id}.xlsx`)
}

const generateZip = (transaction, destination) => {
    // Generate Folder & move file
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true })
    }

    for (let index = 0; index < Object.keys(transaction.documents).length; index++) {
        const key = Object.keys(transaction.documents)[index]
        const value = Object.values(transaction.documents)[index]

        fs.copyFileSync(`view/static${value}`, `${destination}/${key}.${value.split('.').pop()}`)
    }

    // Generate Zip
    var filename = `${transaction.id}.zip`
    var output = fs.createWriteStream(`${destination}/${filename}`)
    var archive = archiver('zip')

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes')
        console.log('archiver has been finalized and the output file descriptor has closed.')
    });

    archive.on('error', function (err) {
        return
    })

    archive.pipe(output)
    archive.glob('**/*', {
        cwd: destination,
        ignore: filename
    })
    archive.finalize()
}

exports.addReview = async (req, res, next) => {
    const transactions = await service.getTransactionDetail(req.params.id)
    if (transactions.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    const transaction = transactions[0]

    const data = await service.addReview(req.params.id, req.body)
    if (!data) res.errorBadRequest()

    const destination = `view/static/documents/${transaction.id}`

    generateZip(transaction, destination)
    generateXls(req.body, transaction, destination)

    service.sendEmailTransactionFile({
        host: process.env.REDIRECT_CLIENT || req.fullhost,
        target: transaction.product_email,
        title: req.polyglot.t("mail.transaction.file"),
        data: {
            name: transaction.client_data.fullname,
            product: transaction.product_name,
            url: `${process.env.REDIRECT_CLIENT}/dokumen/${transaction.id}`,
        },
    })

    return res.jsonData(data)
}

exports.getTransactionQuotation = async (req, res, next) => {
    const transactions = await service.getTransactionDetailForClient(req.params.id)
    if (transactions.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    const transaction = transactions[0]
    const quotationFile = `quotation/${transaction.id}.pdf`

    if (!fs.existsSync(`view/static/${quotationFile}`))
        return res.errorBadRequest(req.polyglot.t('error.transaction.quotation'))

    return res.jsonData({
        quotation: `${process.env.REDIRECT_ADMIN}/${quotationFile}`
    })
}

exports.getTransactionFile = async (req, res, next) => {
    const transactions = await service.getTransactionDetail(req.params.id)
    if (transactions.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    const transaction = transactions[0]
    const destination = `view/static/documents/${transaction.id}`

    const checkFileExists = (filename) => {
        return fs.existsSync(`${destination}/${filename}`) ?
            `${process.env.REDIRECT_ADMIN}/documents/${transaction.id}/${filename}` : null
    }

    return res.jsonData({
        document: checkFileExists(`${transaction.id}.zip`),
        excel: checkFileExists(`${transaction.id}.xlsx`),
    })
}

exports.getXlsxAllTransaction = async (req, res) => {
    var workbook = new excel.Workbook()
    var worksheet = workbook.addWorksheet('Sheet1')

    const list = await service.getTransactionForXlsx(req.body)

    for (let index = 0; index < list.length; index++) {
        const data2 = list[index]
        const isNew = data2.documents.bastk != undefined

        const accessoriesPriceTotal = data2.vehicle_data.accessories.reduce((a, b) => a + b.price, 0)
        const expansionPriceTotal = data2.expansions.reduce((a, b) => a + b.price, 0)

        var addressDetail = data2.address_detail.split(' ')
        var postalCode = addressDetail.pop()

        worksheet.cell(1, 1).string("Registration Date")
        worksheet.cell(1, 2).string("Quotation No.")
        worksheet.cell(1, 3).string("Insurance Name")
        worksheet.cell(1, 4).string("Tokopolis Policy Number")
        worksheet.cell(1, 5).string("Period Of Insured")
        worksheet.cell(1, 6).string("Nomor Rangka")
        worksheet.cell(1, 7).string("Nomor Mesin")
        worksheet.cell(1, 8).string("Warna")
        worksheet.cell(1, 9).string("Foto STNK")
        worksheet.cell(1, 10).string("Foto Identitas")
        worksheet.cell(1, 11).string("Foto BSTK")
        worksheet.cell(1, 12).string("Tampak Depan")
        worksheet.cell(1, 13).string("Tampak Belakang")
        worksheet.cell(1, 14).string("Tampak Kanan")
        worksheet.cell(1, 15).string("Tampak Kiri")
        worksheet.cell(1, 16).string("Tampak Mesin")
        worksheet.cell(1, 17).string("Tampak 3D")
        worksheet.cell(1, 18).string("Tampak Dashboard")
        worksheet.cell(1, 19).string("Tahun Kendaraan")
        // worksheet.cell(1, 22).string("Pemakaian")
        worksheet.cell(1, 20).string("Kondisi")
        worksheet.cell(1, 21).string("Merek Kendaraan")
        worksheet.cell(1, 22).string("Tipe Kendaraan")
        worksheet.cell(1, 23).string("Seri Kendaraan")
        worksheet.cell(1, 24).string("Nomor Polisi")
        worksheet.cell(1, 25).string("Coverage")
        worksheet.cell(1, 26).string("TSI")
        worksheet.cell(1, 27).string("Premi Jaminan Utama")
        worksheet.cell(1, 28).string("Harga Aksesoris")
        worksheet.cell(1, 29).string("Detail Aksesoris")
        worksheet.cell(1, 30).string("GWP")
        worksheet.cell(1, 31).string("Diskon")
        worksheet.cell(1, 32).string("Persenan Diskon")
        worksheet.cell(1, 33).string("Biaya Admin")
        worksheet.cell(1, 34).string("NWP")
        worksheet.cell(1, 35).string("Nama Tertanggung")
        worksheet.cell(1, 36).string("Tipe Identitas Tertanggung")
        worksheet.cell(1, 37).string("Alamat Tertanggung")
        worksheet.cell(1, 38).string("Insurance Notes")
        worksheet.cell(1, 39).string("Quotation Status")

        worksheet.cell(index + 1, 1).string(`${moment(data2.created_at).format("DD/MMM/YYYY")}`)
        worksheet.cell(index + 1, 2).string(`${data2.id}`)
        worksheet.cell(index + 1, 3).string(`${data2.product_name}`)
        worksheet.cell(index + 1, 4).string("-")
        worksheet.cell(index + 1, 5).string(`${moment(data2.start_date).format("DD/MMM/YYYY")} - ${moment(data2.start_date).add(1, 'year').format("DD/MMM/YYYY")}`)
        worksheet.cell(index + 1, 6).string(`${data2.vehicle_data.skeleton_number}`)
        worksheet.cell(index + 1, 7).string(`${data2.vehicle_data.machine_number}`)
        worksheet.cell(index + 1, 8).string(`${data2.vehicle_data.color}`)
        worksheet.cell(index + 1, 9).string(!isNew ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 10).string(!isNew ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 11).string(!isNew ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 12).string(!isNew ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 13).string(!isNew ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 14).string(!isNew ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 15).string(!isNew ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 16).string(!isNew ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 17).string(!isNew ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 18).string(!isNew ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 19).string(data2.vehicle_data.year)
        // worksheet.cell(index + 1, 22).string(data2.vehicle_data.use == 'private' ? 'PERSONAL' : 'KOMERSIL')
        worksheet.cell(index + 1, 20).string(isNew != undefined ? 'BARU' : 'BEKAS')
        worksheet.cell(index + 1, 21).string(data2.brand)
        worksheet.cell(index + 1, 22).string(data2.model)
        worksheet.cell(index + 1, 23).string(data2.sub_model)
        worksheet.cell(index + 1, 24).string(!isNew && data2.vehicle_data.plate_detail != undefined ?
            `${data2.vehicle_data.plate} ${data2.vehicle_data.plate_detail}` :
            data2.vehicle_data.plate)
        worksheet.cell(index + 1, 25).string(data2.product_type == 'comprehensive' ? 'Komprehensif' : 'Total Loss')
        worksheet.cell(index + 1, 26).string(`${data2.vehicle_data.price}`)
        worksheet.cell(index + 1, 27).string(`${data2.price}`)
        // ====================== LINE FOR EXPANSION_CODES ======================
        worksheet.cell(index + 1, 28).string(`${accessoriesPriceTotal}`)
        worksheet.cell(index + 1, 29).string(data2.vehicle_data.accessories
            .map(item => `${item.type} (${item.brand})`)
            .join(', '))
        worksheet.cell(index + 1, 30).string(`${data2.price + expansionPriceTotal}`)
        worksheet.cell(index + 1, 31).string(`${data2.discount_total}`)
        worksheet.cell(index + 1, 32).string(`${data2.discount_format == 'percent' ? data2.discount_value :
            data2.discount_total / (data2.price + expansionPriceTotal) * 100}`)
        worksheet.cell(index + 1, 33).string(data2.fee_admin + data2.fee_stamp)
        worksheet.cell(index + 1, 34).string(`${(data2.price + expansionPriceTotal) - data2.discount_total +
            data2.fee_admin + data2.fee_stamp}`)
        worksheet.cell(index + 1, 35).string(data2.client_data.fullname)
        worksheet.cell(index + 1, 36).string("-")
        worksheet.cell(index + 1, 37).string((`${addressDetail.join(' ')}, ${data2.village_name}, ` +
            `${data2.district_name}, ${data2.regency_name}, ` +
            `${data2.province_name} ${postalCode}`)
            .replace((/  |\r\n|\n|\r/gm), ''))
        worksheet.cell(index + 1, 38).string('-')
        worksheet.cell(index + 1, 39).string(`${data2.status}`)
    }

    workbook.write(`view/static/doc/transaction_${req.body.start_period}-${req.body.end_period}.xlsx`);

    return res.jsonData({
        download_link: `${process.env.REDIRECT_ADMIN}/doc/transaction_${req.body.start_period}-${req.body.end_period}.xlsx`
    })
}
