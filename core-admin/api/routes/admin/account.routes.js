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

    bankRequestLists,
    verifyBankRequest,

    identityRequestLists,
    verifyIdentityRequest
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

// Bank Verify Request
router.get("/admin/account/banks/list", AuthRoleMiddleware, bankRequestLists);
router.put("/admin/account/banks/:account_id", AuthRoleMiddleware, verifyBankRequest);

// Identity Verify Request
router.get("/admin/account/identity/list", AuthRoleMiddleware, identityRequestLists);
router.put("/admin/account/identity/:account_id/:type", AuthRoleMiddleware, verifyIdentityRequest);

module.exports = router;
