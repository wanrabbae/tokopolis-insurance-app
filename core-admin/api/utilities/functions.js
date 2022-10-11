const fs = require('fs')
const moment = require('moment-timezone')

function getMoment() {
    return moment().locale('id').tz('Asia/Jakarta')
}

function extensionHelper(values)
{
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

function randomString(length = 16)
{
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength))
    }

    return result
}

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uploadHandler(filePath, newPath)
{
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
    if (value == null)
        return null

    return code + value.substr(1, value.length)
}

const moneyFormat = (price) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    })

    return formatter.format(price)
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

module.exports = {
    getMoment, extensionHelper,
    randomString, randomNumber, uploadHandler,
    phoneFormat, moneyFormat, stringTag,
    titleCase, percentToDecimal
}