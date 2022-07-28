const { Router } = require('express')

const { register, login, guestLogin,
    forgetPassword, validateForgetToken,
    changeForgetPassword, confirmEmail } = require('../controllers/AuthController.js')

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/guest', guestLogin)

router.post('/forget-password', forgetPassword)
router.get('/forget-password/:token', validateForgetToken)
router.post('/change-forget', changeForgetPassword)
router.post('/confirm-email', confirmEmail)

module.exports = router
