const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')

const {
    all,
    list,
    create,
    update,
    destroy,
} = require("../../controllers/admin/UserController");

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')

router.get('/admin/user/all', AuthRoleMiddleware, all)
router.get('/admin/user/list', AuthRoleMiddleware, list)
router.post('/admin/user', AuthRoleMiddleware, create)
router.put('/admin/user/:id', AuthRoleMiddleware, update)
router.delete('/admin/user/:id', AuthRoleMiddleware, destroy)

module.exports = router;
