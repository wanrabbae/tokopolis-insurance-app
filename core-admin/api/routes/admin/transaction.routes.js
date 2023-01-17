const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')

<<<<<<< HEAD
const { list, detail, addReview, getTransactionFile } = require('../../controllers/admin/TransactionController')
=======
const { list, detail, addReview,
    getTransactionQuotation, getTransactionFile } = require('../../controllers/admin/TransactionController')
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')

router.get('/admin/transaction/list', AuthRoleMiddleware, list)
router.get('/admin/transaction/:id/detail', AuthRoleMiddleware, detail)
router.put('/admin/transaction/:id/review', AuthRoleMiddleware, addReview)
<<<<<<< HEAD
=======
router.get('/admin/transaction/:id/quotation', getTransactionQuotation)
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
router.get('/admin/transaction/:id/file', getTransactionFile)

module.exports = router
