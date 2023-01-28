const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')

const {
    all,
    list,
    create,
    update,
    destroy,
} = require("../../controllers/admin/DealerController");

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')

router.get('/admin/dealer/all', AuthRoleMiddleware, all)
router.get('/admin/dealer/list', AuthRoleMiddleware,list)
router.post('/admin/dealer', AuthRoleMiddleware, create)
router.put('/admin/dealer/:id', AuthRoleMiddleware, update)
router.delete('/admin/dealer/:id', AuthRoleMiddleware, destroy)

module.exports = router;
