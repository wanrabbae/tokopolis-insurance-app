const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')

const { list, detail, addReview } = require('../../controllers/admin/TransactionController')

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')

router.get('/admin/transaction/list', AuthRoleMiddleware, list)
router.get('/admin/transaction/:id/detail', AuthRoleMiddleware, detail)
router.put('/admin/transaction/:id/review', AuthRoleMiddleware, addReview)

module.exports = router
