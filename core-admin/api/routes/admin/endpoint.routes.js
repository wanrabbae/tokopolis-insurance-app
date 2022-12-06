const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')

const { create, all, list, update, destroy } = require('../../controllers/admin/EndpointController')

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')

router.get('/admin/endpoint/all', AuthRoleMiddleware, all)
router.get('/admin/endpoint/list', AuthRoleMiddleware, list)
router.post('/admin/endpoint', AuthRoleMiddleware, create)
router.put('/admin/endpoint/:id', AuthRoleMiddleware, update)
router.delete('/admin/endpoint/:id', AuthRoleMiddleware, destroy)

module.exports = router
