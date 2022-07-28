const nodemailer = require('nodemailer')
const hbs = require("nodemailer-express-handlebars")

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
})

const handlebarOptions = {
    viewEngine: {
        extName: '.handlebars',
        defaultLayout: 'view/templates/default',
    },
    viewPath: 'view/templates/layouts',
    extName: '.handlebars',
}

transporter.use('compile', hbs(handlebarOptions))

export default transporter