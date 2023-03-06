import ClaimProductService from "../../services/ClaimProductService.js";

const validation = require("../../validation/claim.validation");
const { randomString } = require("../../utilities/functions");
const excel = require('excel4node')
const moment = require('moment')
const fs = require('fs')
const archiver = require('archiver')

const service = new ClaimProductService();

exports.getAllClaimData = async (req, res) => {
    try {
        const data = await service.getAllData();
        return res.jsonData(data);
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
        return res.jsonData(data);
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

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

    service.sendEmailClaimFile({
        host: process.env.REDIRECT_CLIENT || req.fullhost,
        target: JSON.parse(claimData.product.email)[0],
        title: "Claim Product Tokopolis",
        data: {
            name: claimData.account.fullname,
            product: claimData.product.name,
            url: `${process.env.REDIRECT_CLIENT}/dokumen/${claimData.id}`,
        },
    })

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

    const isNew = true

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
        'Foto KTP': claimData.documents.identity_card ? 'Terlampir' : 'N/A',
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

        worksheet.cell(1, index + 1).string(key)

        if (typeof values[key] == 'number')
            worksheet.cell(2, index + 1).number(values[key])
        else
            worksheet.cell(2, index + 1).string(values[key])
    }

    workbook.write(`${destination}/Claim_${claimData.transaction_id}.xlsx`)
}