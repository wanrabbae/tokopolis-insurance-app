const { Router } = require('express')
const verify = require('../middlewares/verifyToken')
const verifyToken = require('../middlewares/verifyRole')
const { uploadFile } = require('../middlewares/uploadFile')

const {
    getAccountData,
    updateAccountData,
    updatePassword,
    getIdentity,
    updateIdentity,
    getBank,
    updateBank,
    getTransactions,
    verifySupervisor,
} = require("../controllers/UserController.js");

const router = Router()
const auth = verify()
const AuthRoleMiddleware = verifyToken('auth:role')

router.get("/user", auth, getAccountData);
router.post("/user", auth, uploadFile().single("photo"), updateAccountData);

router.post('/user/change-password', auth, updatePassword)
router.get('/user/identity', auth, getIdentity)
router.post('/user/identity', auth,
    uploadFile().single('image'), updateIdentity)
router.get('/user/bank', auth, getBank)
router.post('/user/bank', auth, updateBank)

router.get('/user/transactions', auth, getTransactions)

router.post("/user/verify-upgrade", auth, verifySupervisor);

module.exports = router;
