const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')
const { uploadFile } = require('../../middlewares/uploadFile')

const { list, importVehicle, getPriceList, vehicleBrands,
    vehicleTypes, vehicleCategories } = require('../../controllers/admin/VehicleController')

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')

router.get('/admin/vehicle/list',AuthRoleMiddleware, list)
router.post('/admin/vehicle/import',AuthRoleMiddleware,
    uploadFile({ allowExt: ['.xlsx', '.xls'], fileSize: 5 }).single('vehicle_file'),
    importVehicle)
router.get('/admin/vehicle/prices',AuthRoleMiddleware, getPriceList)
router.get('/admin/vehicle/item/brands',AuthRoleMiddleware, vehicleBrands)
router.get('/admin/vehicle/item/types',AuthRoleMiddleware, vehicleTypes)
router.get('/admin/vehicle/item/categories',AuthRoleMiddleware, vehicleCategories)

module.exports = router
