const { Router } = require('express')
const verify = require('../middlewares/verifyToken')
const verifyGuest = require('../middlewares/verifyGuest')

const { productCalculation, getProductData,
    getProductDetail, postProductData, compareProduct,
    riskExpansion } = require('../controllers/ProductController.js')

const router = Router()
const auth = verify()
const guest = verifyGuest()

router.get('/product', guest, productCalculation, getProductData)
router.post('/product', auth, postProductData)
router.get('/product/detail', auth, productCalculation, getProductDetail)
router.get('/product/compare', auth, productCalculation, compareProduct)
router.get('/product/expansions', auth, riskExpansion)

module.exports = router
