const { Router } = require('express')

const { login, forgetPassword,
    validateToken, changeForgetPassword,
    confirmEmail } = require('../../controllers/admin/AuthController')

const router = Router()

router.post('/admin/login', login)

router.post('/admin/forget-password', forgetPassword)
router.get('/admin/forget-password/:token', validateToken)
router.post('/admin/change-forget', changeForgetPassword)
router.post('/admin/confirm-email', confirmEmail)

module.exports = router
