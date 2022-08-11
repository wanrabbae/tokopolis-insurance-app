const { Router } = require('express')

const { register, login,
    forgetPassword, validateForgetToken,
    changeForgetPassword, confirmEmail } = require('../controllers/AuthController.js')

const router = Router()

router.post('/register', register)
router.post('/login', login)

router.post('/forget-password', forgetPassword)
router.get('/forget-password/:token', validateForgetToken)
router.post('/change-forget', changeForgetPassword)
router.post('/confirm-email', confirmEmail)

module.exports = router
