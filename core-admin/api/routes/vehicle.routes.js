const { Router } = require('express')

const { getVehicleData, getVehiclePrice,
    getLicensePlate } = require('../controllers/VehicleController.js')

const router = Router()

router.get('/vehicle', getVehicleData)
router.get('/vehicle/price', getVehiclePrice)
router.get('/vehicle/plates', getLicensePlate)

module.exports = router
