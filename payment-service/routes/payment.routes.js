const { Router } = require('express')
const { getPaymentFee, createPayment } = require('../controllers/PaymentController')

const router = Router()

router.get('/payment', getPaymentFee)
router.post('/payment', createPayment)

module.exports = router