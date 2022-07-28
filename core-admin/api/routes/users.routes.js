const { Router } = require('express')
const verify = require('../middlewares/verifyToken')
const { uploadFile } = require('../middlewares/uploadFile')

const { getAccountData, updateAccountData,
    updatePassword, getIdentity, updateIdentity,
    getTransactions } = require('../controllers/UserController.js')

const router = Router()
const auth = verify()
const nonAdmin = verify(['client', 'agent'])

router.get('/user', auth, getAccountData)
router.post('/user', auth,
    uploadFile().single('photo'), updateAccountData)

router.post('/user/change-password', auth, updatePassword)
router.get('/user/identity', nonAdmin, getIdentity)
router.post('/user/identity', nonAdmin,
    uploadFile().single('image'), updateIdentity)

router.get('/user/transactions', nonAdmin, getTransactions)

module.exports = router
