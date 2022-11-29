const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')
const { uploadFile } = require('../../middlewares/uploadFile')

const { list, detail, create, update,
    destroy, createFeature,
    updateFeature, destroyFeature,
    createExpansion, updateExpansion,
    destroyExpansion, productNames } = require('../../controllers/admin/ProductController')

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')

router.get('/admin/product', AuthRoleMiddleware, list)
router.get('/admin/product/:id', AuthRoleMiddleware, detail)
router.post('/admin/product', AuthRoleMiddleware,
    uploadFile({ allowExt: ['.png', '.jpg', '.jpeg', '.pdf'],
    fileSize: 5 }).fields([
        { name: 'image' }, { name: 'brochure_file' },
        { name: 'workshop_file' },
    ]), create)
router.put('/admin/product/:id', AuthRoleMiddleware,
    uploadFile({ allowExt: ['.png', '.jpg', '.jpeg', '.pdf'],
    fileSize: 5 }).fields([
        { name: 'image' }, { name: 'brochure_file' },
        { name: 'workshop_file' },
    ]), update)
router.delete('/admin/product/:id', AuthRoleMiddleware, destroy)

router.post('/admin/product/feature', AuthRoleMiddleware, createFeature)
router.put('/admin/product/feature/:id', AuthRoleMiddleware, updateFeature)
router.delete('/admin/product/feature/:id', AuthRoleMiddleware, destroyFeature)

router.post('/admin/product/expansion', AuthRoleMiddleware, createExpansion)
router.put('/admin/product/expansion/:id', AuthRoleMiddleware, updateExpansion)
router.delete('/admin/product/expansion/:id', AuthRoleMiddleware, destroyExpansion)

router.get('/admin/product/item/names', AuthRoleMiddleware, productNames)

module.exports = router
