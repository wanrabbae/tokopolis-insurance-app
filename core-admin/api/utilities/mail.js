const amqplib = require('amqplib')

class Mailer {
    constructor(host) {
        this.host = host
        this.target = ""
        this.type = ""
        this.subject = ""
        this.body = {}
    }

    setUrl(url) {
        this.host = `${this.host}${url}/`
    }

    setTarget(target) {
        this.target = target
    }

    setType(type) {
        this.type = type
    }

    setMail(subject, body) {
        this.subject = subject
        this.body = body
    }

    async send() {
        const host = process.env.MESSAGE_BROKER_HOST
        const port = process.env.MESSAGE_BROKER_PORT
        const user = process.env.MESSAGE_BROKER_USER
        const pass = process.env.MESSAGE_BROKER_PASSWORD

        var conn = await amqplib.connect(`amqp://${user}:${pass}@${host}:${port}`, "heartbeat=60")
        var channel = await conn.createChannel()

        var queue = 'hello'
        var exchange = 'exchange'
        var route = 'route'

        var message = JSON.stringify({
            host: this.host,
            target: this.target,
            type: this.type,
            subject: this.subject,
            body: this.body
        })

        channel.bindQueue(queue, exchange, route)
        channel.publish(exchange, route, Buffer.from(message))

        setTimeout(function() {
            channel.close()
            conn.close()
        }, 500)
    }
}

export default Mailer