const { Router } = require('express')
const { getPaymentFee, createPayment, cancelPayment, simulateVaPay, comissionWithdraw, pointWithdraw } = require('../controllers/PaymentController')

const router = Router()

router.get('/payment', getPaymentFee)
router.post('/payment', createPayment)
router.post('/payment/simulate-va', simulateVaPay)
router.post("/payment/cancel", cancelPayment)
router.post("/payment/comission/withdraw", comissionWithdraw)
router.post("/payment/point/withdraw", pointWithdraw)

module.exports = router