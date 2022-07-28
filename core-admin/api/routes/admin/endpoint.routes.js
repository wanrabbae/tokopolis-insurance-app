const { Router } = require('express')
const verify = require("../../middlewares/verifyToken");

const { create, all, list, update, destroy } = require('../../controllers/admin/EndpointController')

const router = Router()
const admin = verify('admin')

router.get('/admin/endpoint/all', admin, all)
router.get('/admin/endpoint/list', admin, list)
router.post('/admin/endpoint', admin, create)
router.put('/admin/endpoint/:id', admin, update)
router.delete('/admin/endpoint/:id', admin, destroy)

module.exports = router
