const { Router } = require("express");
const verify = require("../middlewares/verifyToken");
const verifyToken = require("../middlewares/verifyRole");
const { uploadFile } = require("../middlewares/uploadFile");

const {
    getAccountData,
    updateAccountData,
    updatePassword,
    getIdentity,
    updateIdentity,
    getTransactions,
    verifySupervisor,
} = require("../controllers/UserController.js");

const router = Router();
const auth = verify();
const AuthRoleMiddleware = verifyToken("auth:role");

router.get("/user", auth, getAccountData);
router.post("/user", auth, uploadFile().single("photo"), updateAccountData);

router.post("/user/change-password", auth, updatePassword);
router.get("/user/identity", AuthRoleMiddleware, getIdentity);
router.post(
    "/user/identity",
    AuthRoleMiddleware,
    uploadFile().single("image"),
    updateIdentity
);

router.get("/user/transactions", AuthRoleMiddleware, getTransactions);

router.post("/user/verify-upgrade", auth, verifySupervisor);

module.exports = router;
