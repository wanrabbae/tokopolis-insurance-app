const { Router } = require('express')
const { simulateVaPay } = require('../controllers/PaymentController')

const router = Router()

router.post('/simulate-va', simulateVaPay)

module.exports = router