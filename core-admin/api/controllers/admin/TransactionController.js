const excel = require('excel4node')
const moment = require('moment')
const fs = require('fs')
const archiver = require('archiver')

import { string } from 'joi'
import TransactionService from '../../services/TransactionService'

const service = new TransactionService()

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

exports.detail = async (req, res, next) => {
    const data = await service.getTransactionDetail(req.params.id)
    if (data.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    return res.jsonData(data[0])
}

<<<<<<< HEAD
const generateXls = (transaction, destination) => {
=======
const generateXls = (review, transaction, destination) => {
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
    var workbook = new excel.Workbook()
    var worksheet = workbook.addWorksheet('Sheet1')

    const isNew = transaction.documents.bastk != undefined

<<<<<<< HEAD
    const values = {
        'Registration Date': moment(transaction.created_at).format("DD/MMM/YYYY"),
        'Processed Time': '-',
=======
    const accessoriesPriceTotal = transaction.vehicle_data.accessories.reduce((a, b) => a + b.price, 0)
    const expansionPriceTotal = transaction.expansions.reduce((a, b) => a + b.price, 0)

    var addressDetail = transaction.address_detail.split(' ')
    var postalCode = addressDetail.pop()

    var values = {
        'Registration Date': moment(transaction.created_at).format("DD/MMM/YYYY"),
        // 'Processed Time': '-', // get date ketika virtual account dibuat
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
        'Quotation No.': transaction.id,
        'Insurance Name': transaction.product_name,
        'Tokopolis Policy Number': '-',
        'Period Of Insured': `${moment(transaction.start_date).format("DD/MMM/YYYY")} - ${moment(transaction.start_date).add(1, 'year').format("DD/MMM/YYYY")}`,
        'Nomor Rangka': transaction.vehicle_data.skeleton_number,
        'Nomor Mesin': transaction.vehicle_data.machine_number,
        'Warna': transaction.vehicle_data.color,
        'Foto STNK': !isNew ? 'Terlampir' : 'N/A',
        'Foto NPWP': '-',
        'Foto KTP': isNew ? 'Terlampir' : 'N/A',
        'Foto BSTK': isNew ? 'Terlampir' : 'N/A',
        'Tampak Depan': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Belakang': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Kanan': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Kiri': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Mesin': !isNew ? 'Terlampir' : 'N/A',
        'Tampak 3D': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Dashboard': !isNew ? 'Terlampir' : 'N/A',
        'Tahun Kendaraan': transaction.vehicle_data.year,
<<<<<<< HEAD
        'Pemakaian': '',
        'Kondisi': isNew != undefined ? 'BARU' : 'BEKAS',
        'Merek Kendaraan': transaction.brand,
        'Tipe Kendaraan': '',
        'Seri Kendaraan': transaction.sub_model,
        'Nomor Polisi': !isNew && transaction.vehicle_data.plate_detail != undefined ?
            `${transaction.vehicle_data.plate} ${transaction.vehicle_data.plate_detail}` : transaction.vehicle_data.plate,
        'Coverage': transaction.product_type == 'comprehensive' ? 'Komprehensif' : 'Total Loss',
        'TSI': '',
        'Premi Jaminan Utama': '',
        'STRIKE_RIOT_CIVIL_COMMOTION': '',
        'TYPHOON_STORM_FLOOD_HAIL_LANDSLIDE': '',
        'EARTHQUAKE_TSUNAMI_VOLCANIC_ERUPTION': '',
        'THIRD_PARTY_LIABILITY': '',
        'AUTHORIZED_WORKSHOP': '',
        'Harga Aksesoris': '',
        'Detil Aksesoris': '',
        'GWP': '',
        'Diskon': '',
        'Persenan Diskon': '',
        'Biaya Admin': transaction.fee_admin + transaction.fee_stamp,
        'NWP': '',
        'Nama Tertanggung': transaction.client_data.fullname,
        'Tanggal Lahir Tertanggung': '-',
        'Tipe Identitas Tertanggung': '-',
        'Alamat Tertanggung': `${transaction.address_detail}, ${transaction.village_name},
            ${transaction.district_name}, ${transaction.regency_name}, ${transaction.province_name}`,
        'Insurance Notes': '-',
        'Quotation Status': 'WAITING',
    }

=======
        'Pemakaian': transaction.vehicle_data.use == 'private' ? 'PERSONAL' : 'KOMERSIL',
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
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
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
    if (!fs.existsSync(destination)){
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

    archive.on('error', function(err){
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
<<<<<<< HEAD
    generateXls(transaction, destination)

    service.sendEmailTransactionFile({
        host: req.fullhost,
=======
    generateXls(req.body, transaction, destination)

    service.sendEmailTransactionFile({
        host: process.env.REDIRECT_CLIENT || req.fullhost,
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
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

<<<<<<< HEAD
=======
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

>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
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