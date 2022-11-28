const { Router } = require('express')
const verify = require('../../middlewares/verifyToken')
const { uploadFile } = require('../../middlewares/uploadFile')

const { list, detail, create, update,
    destroy, createFeature,
    updateFeature, destroyFeature,
    createExpansion, updateExpansion,
    destroyExpansion, productNames } = require('../../controllers/admin/ProductController')

const router = Router()
const admin = verify(1)

router.get('/admin/product', admin, list)
router.get('/admin/product/:id', admin, detail)
router.post('/admin/product', admin,
    uploadFile({ allowExt: ['.png', '.jpg', '.jpeg', '.pdf'],
    fileSize: 5 }).fields([
        { name: 'image' }, { name: 'brochure_file' },
        { name: 'workshop_file' },
    ]), create)
router.put('/admin/product/:id', admin,
    uploadFile({ allowExt: ['.png', '.jpg', '.jpeg', '.pdf'],
    fileSize: 5 }).fields([
        { name: 'image' }, { name: 'brochure_file' },
        { name: 'workshop_file' },
    ]), update)
router.delete('/admin/product/:id', admin, destroy)

router.post('/admin/product/feature', admin, createFeature)
router.put('/admin/product/feature/:id', admin, updateFeature)
router.delete('/admin/product/feature/:id', admin, destroyFeature)

router.post('/admin/product/expansion', admin, createExpansion)
router.put('/admin/product/expansion/:id', admin, updateExpansion)
router.delete('/admin/product/expansion/:id', admin, destroyExpansion)

router.get('/admin/product/item/names', admin, productNames)

module.exports = router
