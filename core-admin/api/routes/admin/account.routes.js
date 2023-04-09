const { Router } = require('express')
const verifyToken = require('../../middlewares/verifyRole')

const {
    list,
    create,
    account,
    updateData,
    updatePassword,
    adminUpdate,
    destroy,

    upgradeList,
    verifyUpgrade,

    leadersByDealerAndRole,
} = require("../../controllers/admin/AccountController");
const { uploadFile } = require("../../middlewares/uploadFile");

const router = Router()
const AuthRoleMiddleware = verifyToken('auth:role')

// Administrator
router.get('/admin/account/all', AuthRoleMiddleware, list)
router.get('/admin/account/list', AuthRoleMiddleware, list)
router.post('/admin/account', AuthRoleMiddleware, create)
router.put('/admin/account/:id', AuthRoleMiddleware, adminUpdate)
router.delete('/admin/account/:id', AuthRoleMiddleware, destroy)

// Staff
router.get('/admin/account', AuthRoleMiddleware, account)
router.put('/admin/account', AuthRoleMiddleware, updateData)
router.put('/admin/account/password/update', AuthRoleMiddleware, updatePassword)

router.get("/admin/account/upgrade/list", AuthRoleMiddleware, upgradeList);
router.put("/admin/account/:id/upgrade", AuthRoleMiddleware, verifyUpgrade);

router.get('/admin/account/item/leaders', AuthRoleMiddleware, leadersByDealerAndRole)

module.exports = router;
