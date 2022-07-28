const nodemailer = require('nodemailer')

import transporter from '../../config/mail.config.js'

class Mailer {
    constructor(host) {
        this.host = host
        this.template = ""
        this.target = ""
        this.subject = ""
        this.context = {}
    }

    setUrl(url) {
        this.host = `${this.host}${url}/`
    }

    setTemplate(template) {
        this.template = template
    }

    setTarget(target) {
        this.target = target
    }

    setMail(subject, context) {
        this.subject = subject
        this.context = context
    }

    async send() {
        this.context.host = this.host

        let info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: this.target,
            subject: this.subject,
            template: this.template,
            context: this.context
        })

        nodemailer.getTestMessageUrl(info)
    }
}

export default Mailer