const express = require('express')
const path = require('path'
)
const app = express()
const router = express.Router()

const payment = require('./routes/payment.routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.use(payment)

app.use('/', router)

module.exports = app

if (require.main === module) {
    const port = process.env.EXPRESS_PORT || 5126
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API server listening on port ${port}`)
    })
}