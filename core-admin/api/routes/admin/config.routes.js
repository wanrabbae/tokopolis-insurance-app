const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')

const { create, all, update, destroy } = require('../../controllers/admin/ConfigController')

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')

router.get('/admin/config/all', AuthRoleMiddleware, all)
router.post('/admin/config', AuthRoleMiddleware, create)
router.put('/admin/config/:id', AuthRoleMiddleware, update)
router.delete('/admin/config/:id', AuthRoleMiddleware, destroy)

module.exports = router
