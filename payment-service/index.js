const express = require('express')
const app = express()

const payment = require('./routes/payment.routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(payment)

module.exports = app

if (require.main === module) {
    const port = 5123
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API server listening on port ${port}`)
    })
}