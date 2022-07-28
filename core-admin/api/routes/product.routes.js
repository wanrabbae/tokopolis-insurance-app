const { Router } = require('express')
const verify = require('../middlewares/verifyGuest')

const { productCalculation, getProductData,
    getProductDetail, postProductData, compareProduct,
    riskExpansion } = require('../controllers/ProductController.js')

const router = Router()
const guest = verify()

router.get('/product', guest, productCalculation, getProductData)
router.post('/product', guest, postProductData)
router.get('/product/detail', guest, productCalculation, getProductDetail)
router.get('/product/compare', guest, productCalculation, compareProduct)
router.get('/product/expansions', guest, riskExpansion)

module.exports = router
