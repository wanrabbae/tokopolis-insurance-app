const { Router } = require('express')
const verify = require('../../middlewares/verifyToken')
const { uploadFile } = require('../../middlewares/uploadFile')

const { vehicleCSV, vehicleBrands,
    vehicleTypes } = require('../../controllers/admin/VehicleController')

const router = Router()
const admin = verify('admin')

router.post('/admin/vehicle/csv', admin,
    uploadFile({ fileSize: 50 }).fields([
        { name: 'csv_file' }
    ]), vehicleCSV)
router.get('/admin/vehicle/item/brands', admin, vehicleBrands)
router.get('/admin/vehicle/item/types', admin, vehicleTypes)

module.exports = router
