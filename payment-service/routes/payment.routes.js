const { Router } = require('express')
const { getPaymentFee, createPayment, cancelPayment } = require('../controllers/PaymentController')

const router = Router()

router.get('/payment', getPaymentFee)
router.post('/payment', createPayment)
router.post("/payment/cancel", cancelPayment)

module.exports = router