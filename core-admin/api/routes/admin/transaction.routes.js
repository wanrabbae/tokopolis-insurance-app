const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')

const { list, detail } = require('../../controllers/admin/TransactionController')

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')

// router.post('/admin/role', AuthRoleMiddleware,create)
router.get('/admin/transaction/list', AuthRoleMiddleware, list)
router.get('/admin/transaction/:id/detail', AuthRoleMiddleware, detail)
// router.put('/admin/role/:id', AuthRoleMiddleware, update)
// router.delete('/admin/role/:id', AuthRoleMiddleware, destroy)

module.exports = router
