const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')

const { create, list, update, destroy, addEndpoint, removeEndpoint } = require('../../controllers/admin/RoleController')

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')

router.post('/admin/role', AuthRoleMiddleware, create)
router.get('/admin/role/list',AuthRoleMiddleware,list)
router.put('/admin/role/:id', AuthRoleMiddleware, update)
router.delete('/admin/role/:id', AuthRoleMiddleware, destroy)

// Role Management
router.post('/admin/role/endpoint/add', AuthRoleMiddleware, addEndpoint)
router.delete('/admin/role/endpoint/:id', AuthRoleMiddleware, removeEndpoint)

module.exports = router
