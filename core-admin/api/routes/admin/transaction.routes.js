const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')
const { uploadFile } = require('../../middlewares/uploadFile')

const { list, detail, addReview,
    getTransactionQuotation, getTransactionFile, getXlsxAllTransaction, feedbackAgent, history, listUnder, getComissionHistoryUnder, getPointHistoryUnder, uploadEpolicy, getComissionTotalUnder } = require('../../controllers/admin/TransactionController')

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')
router.get('/admin/transaction/list', AuthRoleMiddleware, list)
router.get('/admin/transaction/listUnder', AuthRoleMiddleware, listUnder)
router.get('/admin/transaction/history', AuthRoleMiddleware, history)
router.get('/admin/transaction/:id/detail', AuthRoleMiddleware, detail)
router.put('/admin/transaction/:id/review', AuthRoleMiddleware, addReview)
router.put('/admin/transaction/:id', AuthRoleMiddleware, addReview)
router.get('/admin/transaction/:id/quotation', getTransactionQuotation)
router.get('/admin/transaction/:id/file', getTransactionFile)
router.post('/admin/transaction/:id/feedback', feedbackAgent)
router.post('/admin/transaction/generate', getXlsxAllTransaction)

router.post('/admin/transaction/epolicy', AuthRoleMiddleware, uploadFile({
    allowExt: ['.zip', '.pdf', '.xlsx', '.docx', '.doc'],
    fileSize: 5
}).fields([
    { name: 'epolicy' }, { name: 'nota' },
    { name: 'policy' }, { name: 'lainnya' },
]), uploadEpolicy)

router.get('/comissions/underAgents', AuthRoleMiddleware, getComissionTotalUnder) // Total Komisi pada dashboard
router.get('/admin/comissions/history/under', AuthRoleMiddleware, getComissionHistoryUnder)
router.get('/admin/point/history/under', AuthRoleMiddleware, getPointHistoryUnder)

module.exports = router
