const { Router } = require("express");
const verify = require("../middlewares/verifyToken");
const verifyToken = require('../middlewares/verifyRole')
const { uploadFile } = require("../middlewares/uploadFile");

const { getAll, transaction, detail, postTransaction, postOffer,
    postTemporary, review, doPayment, getPaymentFee,
    getPaymentDetail, webhookMidtrans, webhookXendit,
    getTransactionTotal,
    getComission, getComissionHistory, getPoint, getPointHistory,
    simulatePay, comissionWithdraw, pointWithdraw, getPointBalanceAgents
} = require('../controllers/TransactionController')

const router = Router();
const auth = verify();
const AuthRoleMiddleware = verifyToken('auth:role')

router.get("/transaction/all", auth, getAll);
router.get("/transaction", auth, transaction);
router.get("/transaction/:id/detail", auth, detail)
router.post(
    "/transaction",
    auth,
    uploadFile({ fileSize: 5 }).fields([
        { name: 'bastk' }, { name: 'identity_card' },

        { name: 'stnk' }, { name: 'front_side' }, { name: 'back_side' },
        { name: 'left_side' }, { name: 'right_side' }, { name: 'dashboard' },
        { name: 'optional1' }, { name: 'optional2' }, { name: 'optional3' },
        { name: 'optional4' },
    ]), postTransaction)
router.post('/transaction/offer', auth, postOffer)
router.post('/transaction/temp', auth, postTemporary)
router.get('/transaction/review', auth, review)
router.get('/transaction/fee/payment', auth, getPaymentFee)
router.get('/transaction/payment', auth, getPaymentDetail)
router.post('/transaction/payment', auth, doPayment)

router.post('/transaction/midtrans', webhookMidtrans)
router.post('/transaction/xendit', webhookXendit)

router.get('/transaction/total', auth, getTransactionTotal)

router.get('/comissions', AuthRoleMiddleware, getComission)
router.get('/comissions/history', AuthRoleMiddleware, getComissionHistory)
router.post('/comissions/withdraw', AuthRoleMiddleware, comissionWithdraw)

router.get('/point', auth, getPoint)
router.get('/point/under-agents', auth, getPointBalanceAgents)
router.get('/point/history', auth, getPointHistory)
router.post('/point/withdraw', auth, pointWithdraw)

router.post('/simulate/pay', simulatePay)

module.exports = router
