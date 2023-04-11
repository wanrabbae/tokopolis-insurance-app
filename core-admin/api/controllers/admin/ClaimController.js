import ClaimProductService from "../../services/ClaimProductService.js";

const validation = require("../../validation/claim.validation");
const { randomString, safelyParseJSON } = require("../../utilities/functions");
const excel = require('excel4node')
const moment = require('moment')
const fs = require('fs')
const archiver = require('archiver')

const service = new ClaimProductService();

exports.getAllClaimData = async (req, res) => {
    try {
        const filter = {
            id: req.query.id || '',
            id_claim: req.query.id_claim || '',
            holder_name: req.query.holder_name || '',
        }

        const current = Number(req.query.current) || 1
        const limit = Number(req.query.limit) || 10
        const offset = (current - 1) * limit

        const count = await service.getClaimCount(filter)
        const list = await service.getAllData(filter, limit, offset)

        return res.jsonData({
            pagination: {
                total: count[0][0].total,
                per_page: limit,
                current_page: current,
                last_page: Math.ceil(count[0][0].total / limit),
            },
            list: list
        })
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

exports.getDetailClaimProduct = async (req, res) => {
    try {
        const data = await service.getDetailData(req.params.id);
        data.documents = safelyParseJSON(data.documents);
        return res.jsonData(data);
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

exports.getClaimFileXlsx = async (req, res) => {
    try {
        var workbook = new excel.Workbook()
        var worksheet = workbook.addWorksheet('Sheet1')

        const claimData = await service.getClaimForXlsx();

        var style = workbook.createStyle({
            fill: {
                type: 'gradient',
                bgColor: '#FF0800',
            },
        });

        for (let index = 0; index < claimData.length; index++) {
            const element = claimData[index];
            element.documents = safelyParseJSON(element.documents);

            worksheet.cell(1, 1).string("Registration Date").style(style)
            worksheet.cell(1, 2).string("Processed Time").style(style)
            worksheet.cell(1, 3).string("ID Transaksi Tokopolis").style(style)
            worksheet.cell(1, 4).string("ID Claim No").style(style)
            worksheet.cell(1, 5).string("Nama Pelapor").style(style)
            worksheet.cell(1, 6).string("Nama Pemegang Polis").style(style)
            worksheet.cell(1, 7).string("Nomor Plat Kendaraan").style(style)
            worksheet.cell(1, 8).string("Waktu Kejadian").style(style)
            worksheet.cell(1, 9).string("Lokasi Lengkap Kejadian").style(style)
            worksheet.cell(1, 10).string("Identitas Customer").style(style)
            worksheet.cell(1, 11).string("Foto SIM").style(style)
            worksheet.cell(1, 12).string("Foto STNK").style(style)
            worksheet.cell(1, 13).string("Dokumen Lain (Opsional)").style(style)
            worksheet.cell(1, 14).string("Foto Kerusakan 1").style(style)
            worksheet.cell(1, 15).string("Foto Kerusakan 2").style(style)
            worksheet.cell(1, 16).string("Foto Kerusakan 3").style(style)
            worksheet.cell(1, 17).string("Foto Kerusakan 4").style(style)
            worksheet.cell(1, 18).string("Kronologis Kejadian").style(style)

            worksheet.cell(index + 1, 1).string(`${moment(element.created_at).format("DD/MMM/YYYY")}`)
            worksheet.cell(index + 1, 2).string(`-`)
            worksheet.cell(index + 1, 3).string(`${element.transaction_id}`)
            worksheet.cell(index + 1, 4).string(`${element.id}`)
            worksheet.cell(index + 1, 5).string(`${element.reporter_fullname}`)
            worksheet.cell(index + 1, 6).string(`${element.holder_fullname}`)
            worksheet.cell(index + 1, 7).string(`${element.plate_number}`)
            worksheet.cell(index + 1, 8).string(`${moment(element.incident_time).format("DD/MMM/YYYY")}`)
            worksheet.cell(index + 1, 9).string(`${element.location}`)
            worksheet.cell(index + 1, 10).string(`${element.documents.identity_card ? 'Terlampir' : 'N/A'}`)
            worksheet.cell(index + 1, 11).string(`${element.documents.driver_license ? 'Terlampir' : 'N/A'}`)
            worksheet.cell(index + 1, 12).string(`${element.documents.stnk ? 'Terlampir' : 'N/A'}`)
            worksheet.cell(index + 1, 13).string(`N/A`)
            worksheet.cell(index + 1, 14).string(`${element.documents.damage1 ? 'Terlampir' : 'N/A'}`)
            worksheet.cell(index + 1, 15).string(`${element.documents.damage2 ? 'Terlampir' : 'N/A'}`)
            worksheet.cell(index + 1, 16).string(`${element.documents.damage3 ? 'Terlampir' : 'N/A'}`)
            worksheet.cell(index + 1, 17).string(`${element.documents.damage4 ? 'Terlampir' : 'N/A'}`)
            worksheet.cell(index + 1, 18).string(`${element.chronology}`)
        }

        workbook.write(`view/static/doc/claims_data.xlsx`);

        return res.jsonData({
            download_link: `${process.env.REDIRECT_ADMIN}/doc/claims_data.xlsx`
        })
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
}

exports.updateStatusClaim = async (req, res) => {
    try {
        const validate = validation.updateStaging(req);
        if (validate.error) return res.errorValidation(validate.details);
        await service.updateStatusData(req);
        return res.jsonSuccess("Success update staging");
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

exports.generateSend = async (req, res, next) => {
    const claimData = await service.getDetailDataWithTrxId(req.params.transaction_id)
    if (claimData.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    const destination = `view/static/documents`
    claimData.documents = JSON.parse(claimData.documents)

    generateZip(claimData, destination)
    generateXls(claimData, destination)

    const emails = JSON.parse(claimData.product.email)

    for (let i = 0; i < emails.length; i++) {
        const element = emails[i];

        service.sendEmailClaimFile({
            host: process.env.REDIRECT_CLIENT || req.fullhost,
            target: element,
            title: `Claim Register | ${claimData.id} - ${claimData.account.fullname}`,
            data: {
                name: claimData.account.fullname,
                product: claimData.product.name,
                url: `${process.env.REDIRECT_CLIENT}/dokumen/${claimData.id}`,
            },
        })
    }

    return res.jsonData(claimData)
}

const generateZip = (claimData, destination) => {
    // Generate Folder & move file
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true })
    }

    for (let index = 0; index < Object.keys(claimData.documents).length; index++) {
        const key = Object.keys(claimData.documents)[index]
        const value = Object.values(claimData.documents)[index]

        fs.copyFileSync(`view/static${value}`, `${destination}/${key}.${value.split('.').pop()}`)
    }

    // Generate Zip
    var filename = `Claim_${claimData.transaction_id}.zip`
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

const generateXls = (claimData, destination) => {
    var workbook = new excel.Workbook()
    var worksheet = workbook.addWorksheet('Sheet1')

    var style = workbook.createStyle({
        fill: {
            type: 'gradient',
            bgColor: '#FF0800',
        },
    });

    var values = {
        'Registration Date': moment(claimData.created_at).format("DD/MMM/YYYY"),
        'Processed Time': "-",
        'ID Transaksi Tokopolis': claimData.transaction_id,
        'ID Claim No': claimData.id,
        'Nama Pelapor': claimData.reporter_fullname,
        'Nama Pemegang Polis': claimData.holder_fullname,
        'Nomor Plat Kendaraan': claimData.plate_number,
        'Waktu Kejadian': moment(claimData.incident_time).format("DD/MMM/YYYY"),
        'Lokasi Lengkap Kejadian': claimData.location,
        'Identitas Customer': claimData.documents.identity_card ? 'Terlampir' : 'N/A',
        'Foto SIM': claimData.documents.driver_license ? 'Terlampir' : 'N/A',
        'Foto STNK': claimData.documents.stnk ? 'Terlampir' : 'N/A',
        'Dokumen Lain (Opsional)': 'N/A',
        'Foto Kerusakan 1': claimData.documents.damage1 ? 'Terlampir' : 'N/A',
        'Foto Kerusakan 2': claimData.documents.damage2 ? 'Terlampir' : 'N/A',
        'Foto Kerusakan 3': claimData.documents.damage3 ? 'Terlampir' : 'N/A',
        'Foto Kerusakan 4': claimData.documents.damage4 ? 'Terlampir' : 'N/A',
        'Kronologis Kejadian': claimData.chronology,
    }
    var valueEntries = Object.entries(values)

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

    workbook.write(`${destination}/Claim_${claimData.transaction_id}.xlsx`)
}
