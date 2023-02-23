const { Router } = require('express')
const { getPaymentFee, createPayment, cancelPayment, simulateVaPay } = require('../controllers/PaymentController')

const router = Router()

router.get('/payment', getPaymentFee)
router.post('/payment', createPayment)
router.post('/payment/simulate-va', simulateVaPay)
router.post("/payment/cancel", cancelPayment)

module.exports = router