const { Router } = require('express')

const { provinces, regencies,
    districts, villages } = require('../controllers/AddressController.js')

const router = Router()

router.get('/address/provinces', provinces)
router.get('/address/regencies', regencies)
router.get('/address/districts', districts)
router.get('/address/villages', villages)

module.exports = router
