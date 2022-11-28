const { Router } = require('express')
const verify = require("../../middlewares/verifyToken");

const { create, list, update, destroy, addEndpoint, removeEndpoint } = require('../../controllers/admin/RoleController')

const router = Router()
const admin = verify(1)

router.post('/admin/role', admin,create)
router.get('/admin/role/list',admin,list)
router.put('/admin/role/:id', admin, update)
router.delete('/admin/role/:id', admin, destroy)

// Role Management
router.post('/admin/role/endpoint/add', admin,addEndpoint)
router.delete('/admin/role/endpoint/:id', admin, removeEndpoint)

module.exports = router
