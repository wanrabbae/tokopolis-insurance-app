const { Router } = require('express')
const verify = require('../middlewares/verifyToken')
const verifyToken = require('../middlewares/verifyRole')
const { uploadFile } = require('../middlewares/uploadFile')

const {
    getAccountData,
    getAccountSimple,
    getAccountPhoto,
    updateAccountData,
    updatePassword,
    getIdentity,
    updateIdentity,
    getBank,
    updateBank,
    getTransactions,
    getUpgrade,
    requestUpgrade,
} = require("../controllers/UserController.js");

const router = Router()
const auth = verify()
const AuthRoleMiddleware = verifyToken('auth:role')

router.get("/user", auth, getAccountData);
router.get("/user/simple", auth, getAccountSimple)
router.get("/user/photo", auth, getAccountPhoto)

router.post("/user", auth, uploadFile().single("photo"), updateAccountData);

router.post('/user/change-password', auth, updatePassword)
router.get('/user/identity', auth, getIdentity)
router.post('/user/identity', auth,
    uploadFile().single('image'), updateIdentity)
router.get('/user/bank', auth, getBank)
router.post('/user/bank', auth, updateBank)

router.get('/user/transactions', auth, getTransactions)

router.get("/user/upgrade", auth, getUpgrade)
router.post("/user/upgrade", auth, requestUpgrade)

module.exports = router;
