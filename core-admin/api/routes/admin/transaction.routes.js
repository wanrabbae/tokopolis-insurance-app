const { Router } = require('express')
const verify = require("../../middlewares/verifyToken");

const { list, detail } = require('../../controllers/admin/TransactionController')

const router = Router()
const admin = verify('admin')

// router.post('/admin/role', admin,create)
router.get('/admin/transaction/list', admin, list)
router.get('/admin/transaction/:id/detail', admin, detail)
// router.put('/admin/role/:id', admin, update)
// router.delete('/admin/role/:id', admin, destroy)

module.exports = router
