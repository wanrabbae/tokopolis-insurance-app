const fs = require('fs')
const moment = require('moment-timezone')

function getMoment() {
    return moment().locale('id').tz('Asia/Jakarta')
}

function extensionHelper(values) {
    const regexFirst = '.('
    const regexEnd = ')$'

    var regexCombine = ''

    values.forEach((item, index) => {
        regexCombine += item

        if (index != values.length - 1) {
            regexCombine += '|'
        }
    })

    return {
        regex: `${regexFirst}${regexCombine}${regexEnd}`,
        message: values.join(', ')
    }
}

function randomString(length = 16) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength))
    }

    return result
}

function randomNumber(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min + 1)) + min
}

function uploadHandler(filePath, newPath) {
    const nuxtFolder = process.env.NUXT_STATIC_DIR
    const tempPath = process.env.NUXT_TEMP_DIR
    const uploadFolder = process.env.NUXT_UPLOAD_DIR

    filePath = filePath.replace(/\\/g, '/')

    const combinePath = `${uploadFolder}/${newPath}`

    if (!fs.existsSync(`${nuxtFolder}/${combinePath}`)) {
        fs.mkdirSync(`${nuxtFolder}/${combinePath}`, { recursive: true })
    }

    const fileName = filePath.replace(tempPath, combinePath)

    // move file from temp
    if (fs.existsSync(filePath)) {
        fs.renameSync(filePath, fileName)
    }

    return {
        clearPath: fileName.replace(nuxtFolder, '')
    }
}

function phoneFormat(value, code = '+62') {
    let number = value.replace(/\D/g, '');

    if (number.substring(0, 3) == '628') {
        number = '+628' + number.substring(3);
    }

    if (number.substring(0, 2) == '08') {
        number = '+62' + number.substring(1);
    }

    return number.replace(/(\d{4})(?=\d)/g, '$1');
}


const moneyFormat = (price) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    })

    return formatter.format(price)
}

const moneyFormatNonSymbol = (price) => {
    return price.toLocaleString('id-ID')
}

const stringTag = (value) => {
    const lower = value.toLowerCase()

    return lower.replace(/\s+/g, '_')
}

const titleCase = (value) => {
    return value
        .split(' ')
        .map(item => {
            return item.charAt(0).toUpperCase() + item.substr(1).toLowerCase()
        })
        .join(' ')
}


const percentToDecimal = (number) => number / parseFloat(100)

function safelyParseJSON(json) {
    try {
        if (typeof json != "object") {
            json = JSON.parse(json)
        }
    } catch (e) {
        json = {}
    }

    return json
}

module.exports = {
    getMoment, extensionHelper,
    randomString, randomNumber, uploadHandler,
    phoneFormat, moneyFormat, moneyFormatNonSymbol,
    stringTag, titleCase, percentToDecimal, safelyParseJSON
}