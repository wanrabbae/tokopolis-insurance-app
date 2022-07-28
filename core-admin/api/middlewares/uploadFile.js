const multer = require('multer')
const fs = require('fs')
const path = require('path')

const { randomString } = require('../utilities/functions')

const nuxtFolder = process.env.NUXT_STATIC_DIR
const tempFolder = process.env.NUXT_TEMP_DIR

const tempPath = `./${nuxtFolder}/${tempFolder}`

if (!fs.existsSync(tempPath))
    fs.mkdirSync(tempPath, { recursive: true })

function uploadFile(options = {})
{
    const defaults = {
        allowExt: ['.png', '.jpg', '.jpeg'],
        fileSize: 1
    }

    Object.keys(defaults).forEach((key, index) => {
        if (options[key] == undefined) {
            options[key] = Object.values(defaults)[index]
        }
    })

    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, tempPath)
        },
        filename: function (req, file, callback) {
            let ext = path.extname(file.originalname)
            callback(null, `${randomString(32)}${ext}`)
        }
    })

    return multer({
        storage: storage,
        limits: { fileSize: options.fileSize * 1024 * 1024 },
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname)

            req.body[file.fieldname] = file.originalname

            if (!options.allowExt.includes(ext)) {
                return callback(null, false)
            }

            callback(null, true)
        }
    })
}

module.exports.uploadFile = uploadFile