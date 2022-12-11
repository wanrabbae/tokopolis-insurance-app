const { Router } = require("express");
const verifyToken = require("../../middlewares/verifyRole");

const {
    list,
    create,
    createDealerAccount,
    account,
    updateData,
    updatePassword,
    adminUpdate,
    destroy,
} = require("../../controllers/admin/AccountController");
const { uploadFile } = require("../../middlewares/uploadFile");

const router = Router();
const AuthRoleMiddleware = verifyToken("auth:role");

// Administrator
router.get("/admin/account/list", AuthRoleMiddleware, list);
router.post("/admin/account", AuthRoleMiddleware, create);
router.put("/admin/account/:id", AuthRoleMiddleware, adminUpdate);
router.delete("/admin/account/:id", AuthRoleMiddleware, destroy);

// Staff
router.get("/admin/account", AuthRoleMiddleware, account);
router.put("/admin/account", AuthRoleMiddleware, updateData);
router.put("/admin/account/password", AuthRoleMiddleware, updatePassword);

// Dealer Account
router.post("/admin/account/dealer", AuthRoleMiddleware, createDealerAccount);

module.exports = router;
