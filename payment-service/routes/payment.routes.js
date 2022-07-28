const { Router } = require('express')
const { createPayment } = require('../controllers/PaymentController')

const router = Router()

router.post('/payment', createPayment)

module.exports = router