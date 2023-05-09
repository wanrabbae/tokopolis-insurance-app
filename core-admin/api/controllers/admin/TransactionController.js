const excel = require('excel4node')
const moment = require('moment')
const fs = require('fs')
const archiver = require('archiver')
const validation = require('../../validation/transaction.validation')

import { string } from 'joi'
import TransactionService from '../../services/TransactionService'
import AccountService from '../../services/AccountService'
import { safelyParseJSON } from '../../utilities/functions'

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

    const filter = {
        id: req.query.id || '',
        client_name: req.query.client_name || '',
        status: req.query.status || '',
    }

    const count = await service.getTransactionStatusCount(filter)
    const list = await service.getTransactionStatusAll(filter, limit, offset)

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
    const client_data = data[0].client_data

    const findAccount = await accountService.getAccount(data[0].agent_id)

    service.sendEmailFeedBackAgent({
        host: process.env.REDIRECT_CLIENT || req.fullhost,
        target: findAccount.email,
        title: "Revert to Agent | " + client_data.fullname != undefined ? client_data.fullname : "Customer" + " - " + req.params.id,
        data: {
            name: client_data.fullname != undefined ? client_data.fullname : "Customer",
            message: req.body.message,
            product: data.product_name,
        },
    })

    return res.jsonData({
        message: "success feeback to agent"
    })
}

exports.listUnder = async (req, res, next) => {

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

    const account_ids = [1];
    const accountsUnder = await accountService.getAllAccountFromPrefixID(req.account._id)

    accountsUnder.forEach(au => account_ids.push(au.id))

    const agent_ids = account_ids.join(", ").replace(/\[|\]/g, "(") // 2, 3, 4

    const count = await service.getTransactionCount(filter)
    const list = await service.getTransactionAllWithAgent(filter, limit, offset, agent_ids)

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

const generateXls = (review, transaction, destination) => {
    var workbook = new excel.Workbook()
    var worksheet = workbook.addWorksheet('Sheet1')

    var style = workbook.createStyle({
        fill: {
            type: 'gradient',
            bgColor: '#FF0800',
        },
    });

    const isNew = transaction.documents.bastk != undefined
    const isNewCondition = transaction.is_new_condition

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
        'Period Of Insurance': `${moment(transaction.start_date).format("DD/MMM/YYYY")} - ${moment(transaction.start_date).add(1, 'year').format("DD/MMM/YYYY")}`,
        'Nomor Rangka': transaction.vehicle_data.skeleton_number,
        'Nomor Mesin': transaction.vehicle_data.machine_number,
        'Warna': transaction.vehicle_data.color,
        'Foto STNK': !isNew ? 'Terlampir' : 'N/A',
        'Identitas Customer': 'Terlampir',
        'Foto BSTK': isNew ? 'Terlampir' : 'N/A',
        'Tampak Depan': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Belakang': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Kanan': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Kiri': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Mesin': !isNew ? 'Terlampir' : 'N/A',
        // 'Tampak 3D': !isNew ? 'Terlampir' : 'N/A',
        'Tampak Dashboard': !isNew ? 'Terlampir' : 'N/A',
        'Tahun Kendaraan': transaction.vehicle_data.year,
        'Pemakaian': 'PRIBADI',
        'Kondisi': isNewCondition ? 'BARU' : 'BEKAS',
        'Merek Kendaraan': transaction.brand,
        'Tipe Kendaraan': transaction.model,
        'Seri Kendaraan': transaction.sub_model,
        'Nomor Polisi': !isNew && transaction.vehicle_data.plate_detail != undefined ?
            `${transaction.vehicle_data.plate} ${transaction.vehicle_data.plate_detail}` :
            transaction.vehicle_data.plate,
        'Coverage': transaction.product_type == 'comprehensive' ? 'Komprehensif' : 'Total Loss',
        'TSI': transaction.vehicle_data.price,
        'Harga Aksesoris include TSI': accessoriesPriceTotal,
        // ====================== LINE FOR EXPANSION_CODES ======================
        'Detail Aksesoris': transaction.vehicle_data.accessories
            .map(item => `${item.type} (${item.brand})`)
            .join(', '),
        'Premi Jaminan Utama': transaction.price,
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

        worksheet.cell(1, index + 1).string(key).style(style)

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

    const client_data = transaction.client_data
    const emails = safelyParseJSON(transaction.product_email)

    for (let i = 0; i < emails.length; i++) {
        const element = emails[i];

        service.sendEmailTransactionFile({
            host: process.env.REDIRECT_CLIENT || req.fullhost,
            target: element,
            title: `Penutupan Asuransi Mobil | ${transaction.id} - ${client_data.fullname}`,
            data: {
                name: client_data.fullname,
                product: transaction.product_name,
                url: `${process.env.REDIRECT_CLIENT}/dokumen/${transaction.id}`,
            },
        })
    }

    return res.jsonData({ success: true })
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

    var style = workbook.createStyle({
        fill: {
            type: 'gradient',
            bgColor: '#FF0800',
        },
    });

    for (let index = 0; index < list.length; index++) {
        const data2 = list[index]
        const isNew = data2.documents != null ? data2.documents.bastk != null ? true : false : false;
        const isNewCon = data2.is_new_condition;

        const accessoriesPriceTotal = data2.vehicle_data.accessories.reduce((a, b) => a + b.price, 0)
        const expansionPriceTotal = data2.expansions.reduce((a, b) => a + b.price, 0)

        var addressDetail = data2.address_detail.split(' ')
        var postalCode = addressDetail.pop()

        worksheet.cell(1, 1).string("Registration Date").style(style)
        worksheet.cell(1, 2).string("Quotation No.").style(style)
        worksheet.cell(1, 3).string("Insurance Name").style(style)
        worksheet.cell(1, 4).string("Tokopolis Policy Number").style(style)
        worksheet.cell(1, 5).string("Period Of Insurance").style(style)
        worksheet.cell(1, 6).string("Nomor Rangka").style(style)
        worksheet.cell(1, 7).string("Nomor Mesin").style(style)
        worksheet.cell(1, 8).string("Warna").style(style)
        worksheet.cell(1, 9).string("Foto STNK").style(style)
        worksheet.cell(1, 10).string("Identitas Customer").style(style)
        worksheet.cell(1, 11).string("Foto BSTK").style(style)
        worksheet.cell(1, 12).string("Tampak Depan").style(style)
        worksheet.cell(1, 13).string("Tampak Belakang").style(style)
        worksheet.cell(1, 14).string("Tampak Kanan").style(style)
        worksheet.cell(1, 15).string("Tampak Kiri").style(style)
        worksheet.cell(1, 16).string("Tampak Mesin").style(style)
        // worksheet.cell(1, 17).string("Tampak 3D").style(style)
        worksheet.cell(1, 17).string("Tampak Dashboard").style(style)
        worksheet.cell(1, 18).string("Tahun Kendaraan").style(style)
        worksheet.cell(1, 19).string("Pemakaian").style(style)
        worksheet.cell(1, 20).string("Kondisi").style(style)
        worksheet.cell(1, 21).string("Merek Kendaraan").style(style)
        worksheet.cell(1, 22).string("Tipe Kendaraan").style(style)
        worksheet.cell(1, 23).string("Seri Kendaraan").style(style)
        worksheet.cell(1, 24).string("Nomor Polisi").style(style)
        worksheet.cell(1, 25).string("Coverage").style(style)
        worksheet.cell(1, 26).string("TSI").style(style)
        worksheet.cell(1, 27).string("Harga Aksesoris include TSI").style(style)
        worksheet.cell(1, 28).string("Detail Aksesoris").style(style)
        worksheet.cell(1, 29).string("Premi Jaminan Utama").style(style)
        worksheet.cell(1, 30).string("GWP").style(style)
        worksheet.cell(1, 31).string("Diskon").style(style)
        worksheet.cell(1, 32).string("Persenan Diskon").style(style)
        worksheet.cell(1, 33).string("Biaya Admin").style(style)
        worksheet.cell(1, 34).string("NWP").style(style)
        worksheet.cell(1, 35).string("Nama Tertanggung").style(style)
        worksheet.cell(1, 36).string("Tipe Identitas Tertanggung").style(style)
        worksheet.cell(1, 37).string("Alamat Tertanggung").style(style)
        worksheet.cell(1, 38).string("Insurance Notes").style(style)
        worksheet.cell(1, 39).string("Quotation Status").style(style)

        worksheet.cell(index + 1, 1).string(`${moment(data2.created_at).format("DD/MMM/YYYY")}`)
        worksheet.cell(index + 1, 2).string(`${data2.id}`)
        worksheet.cell(index + 1, 3).string(`${data2.product_name}`)
        worksheet.cell(index + 1, 4).string("-")
        worksheet.cell(index + 1, 5).string(`${moment(data2.start_date).format("DD/MMM/YYYY")} - ${moment(data2.start_date).add(1, 'year').format("DD/MMM/YYYY")}`)
        worksheet.cell(index + 1, 6).string(`${data2.vehicle_data.skeleton_number}`)
        worksheet.cell(index + 1, 7).string(`${data2.vehicle_data.machine_number}`)
        worksheet.cell(index + 1, 8).string(`${data2.vehicle_data.color}`)
        worksheet.cell(index + 1, 9).string(!isNew ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 10).string('Terlampir')
        worksheet.cell(index + 1, 11).string('Terlampir')
        worksheet.cell(index + 1, 12).string(!isNewCon ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 13).string(!isNewCon ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 14).string(!isNewCon ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 15).string(!isNewCon ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 16).string(!isNewCon ? 'Terlampir' : 'N/A')
        // worksheet.cell(index + 1, 17).string(!isNewCon ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 17).string(!isNewCon ? 'Terlampir' : 'N/A')
        worksheet.cell(index + 1, 18).string(data2.vehicle_data.year)
        worksheet.cell(index + 1, 19).string('PRIBADI')
        worksheet.cell(index + 1, 20).string(isNewCon ? 'BARU' : 'BEKAS')
        worksheet.cell(index + 1, 21).string(data2.brand)
        worksheet.cell(index + 1, 22).string(data2.model)
        worksheet.cell(index + 1, 23).string(data2.sub_model)
        worksheet.cell(index + 1, 24).string(!isNew && data2.vehicle_data.plate_detail != undefined ?
            `${data2.vehicle_data.plate} ${data2.vehicle_data.plate_detail}` :
            data2.vehicle_data.plate)
        worksheet.cell(index + 1, 25).string(data2.product_type == 'comprehensive' ? 'Komprehensif' : 'Total Loss')
        worksheet.cell(index + 1, 26).string(`${data2.vehicle_data.price}`)
        // ====================== LINE FOR EXPANSION_CODES ======================
        worksheet.cell(index + 1, 27).string(`${accessoriesPriceTotal}`)
        worksheet.cell(index + 1, 28).string(data2.vehicle_data.accessories
            .map(item => `${item.type} (${item.brand})`)
            .join(', '))
        worksheet.cell(index + 1, 29).string(`${data2.price}`)
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

exports.getComissionHistoryUnder = async (req, res) => {
    const filter = {
        name: req.query.name || '',
        start_period: req.query.start_period || null,
        end_period: req.query.end_period || null,
    }

    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const account_ids = []
    const accountsUnder = await accountService.getAllAccountFromPrefixID(req.account._id)
    accountsUnder.forEach(au => account_ids.push(au.id))

    const count = await service.getComissionHistoryUnderCount(account_ids, filter, req.account.role);
    const comission = await service.getComissionHistoryUnder(account_ids, filter, limit, offset, req.account.role);

    res.jsonData({
        pagination: {
            total: count,
            per_page: limit,
            current_page: current,
            last_page: Math.ceil(count / limit),
        },
        list: comission
    });
}

exports.getPointHistoryUnder = async (req, res) => {
    const filter = {
        name: req.query.name || '',
        start_period: req.query.start_period || null,
        end_period: req.query.end_period || null,
    }

    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const account_ids = []
    const accountsUnder = await accountService.getAllAccountFromPrefixID(req.account._id)
    accountsUnder.forEach(au => account_ids.push(au.id))

    const count = await service.getPointHistoryUnderCount(account_ids, filter, req.account.role);
    const points = await service.getPointHistoryUnder(account_ids, filter, limit, offset, req.account.role);

    res.jsonData({
        pagination: {
            total: count,
            per_page: limit,
            current_page: current,
            last_page: Math.ceil(count / limit),
        },
        list: points
    });
}

exports.uploadEpolicy = async (req, res) => {
    const validate = validation.epolicy(req)
    if (validate.error) return res.errorValidation(validate.details)

    const transaction = await service.getTransactionDetail(req.body.transaction_id)

    if (transaction) {
        const uploads = await service.uploadEpolicy(req.files, transaction[0].documents, transaction[0].id);
        await service.updateStatus(transaction[0].id, { status: 'polis' })

        const client_data = transaction[0].client_data;
        await service.sendEmailEpolicyFile({
            host: process.env.REDIRECT_CLIENT || req.fullhost,
            target: transaction.agent_email != null ? transaction.agent_email : client_data.email,
            title: `Notifikasi Polis Asuransi Mobil | ${transaction[0].id} - ${client_data.fullname}`,
            data: {
                name: client_data.fullname,
                product: transaction[0].product_name,
                url: `${process.env.REDIRECT_CLIENT}/${uploads.epolicy}`,
            },
        })

        return res.jsonData({ message: "Success Upload E-policy" })
    }

    return res.errorBadRequest(req.polyglot.t('error.transaction'));
}

exports.getComissionTotalUnder = async (req, res) => {
    let total = 0
    let account_ids = []
    const accountsUnder = await accountService.getAllAccountFromPrefixID(req.account._id)
    accountsUnder.forEach(au => account_ids.push(au.id))

    const comission = await service.getComissionTotalUnder(account_ids);
    const calculate = comission.reduce((previous, current) => parseInt(previous.value) + parseInt(current.value))

    total = calculate

    res.jsonData({ total: total });
}