const { Router } = require('express')
const verify = require('../../middlewares/verifyToken')
const { uploadFile } = require('../../middlewares/uploadFile')

const { list, importVehicle, getPriceList, vehicleBrands,
    vehicleTypes, vehicleCategories } = require('../../controllers/admin/VehicleController')

const router = Router()
const admin = verify('admin')

router.get('/admin/vehicle/list', admin, list)
router.post('/admin/vehicle/import', admin,
    uploadFile({ allowExt: ['.xlsx', '.xls'], fileSize: 5 }).single('vehicle_file'),
    importVehicle)
router.get('/admin/vehicle/prices', admin, getPriceList)
router.get('/admin/vehicle/item/brands', admin, vehicleBrands)
router.get('/admin/vehicle/item/types', admin, vehicleTypes)
router.get('/admin/vehicle/item/categories', admin, vehicleCategories)

module.exports = router
