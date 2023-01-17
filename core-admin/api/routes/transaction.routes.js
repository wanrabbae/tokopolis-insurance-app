const { Router } = require("express");
const verify = require("../middlewares/verifyToken");
const { uploadFile } = require("../middlewares/uploadFile");

const { getAll, transaction, detail, postTransaction, postOffer,
    postTemporary, review, doPayment, getPaymentFee,
<<<<<<< HEAD
    getPaymentDetail, webhookMidtrans, webhookXendit, 
=======
    getPaymentDetail, webhookMidtrans, webhookXendit,
    getTransactionTotal,
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
    getComission, getComissionHistory, getPoint, getPointHistory
} = require('../controllers/TransactionController')

const router = Router();
const auth = verify();

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

<<<<<<< HEAD
=======
router.get('/transaction/total', auth, getTransactionTotal)

>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
router.get('/comissions', auth, getComission)
router.get('/comissions/history', auth, getComissionHistory)

router.get('/point', auth, getPoint)
router.get('/point/history', auth, getPointHistory)

module.exports = router
