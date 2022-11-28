const { Router } = require('express')
const verify = require('../../middlewares/verifyToken')

const { list ,create ,account, updateData,
    updatePassword, adminUpdate, destroy } = require('../../controllers/admin/AccountController')
const {uploadFile} = require("../../middlewares/uploadFile");

const router = Router()
const admin = verify(1)
const staff = verify(['admin','agent','insurance']);

// Administrator
router.get('/admin/account/list',admin,list)
router.post('/admin/account', admin, create)
router.put('/admin/account/:id', admin, adminUpdate)
router.delete('/admin/account/:id', admin, destroy)

// Staff
router.get('/admin/account', staff, account)
router.put('/admin/account', staff, updateData)
router.put('/admin/account/password', staff , updatePassword)

module.exports = router
