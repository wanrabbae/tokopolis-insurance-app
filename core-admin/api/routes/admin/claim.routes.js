const { Router } = require("express");
const verify = require("../../middlewares/verifyToken");
const verifyToken = require('../../middlewares/verifyRole');
const { uploadFile } = require("../../middlewares/uploadFile");

const {
    getAllClaimData,
    getDetailClaimProduct,
    updateStatusClaim,
    generateSend
} = require("../../controllers/admin/ClaimController");

const router = Router();
const auth = verify();
const AuthRoleMiddleware = verifyToken('auth:role')

router.get("/admin/claim/all", getAllClaimData);
router.get("/admin/claim/:id", AuthRoleMiddleware, getDetailClaimProduct);
router.put('/admin/claim/:transaction_id/generate-send', AuthRoleMiddleware, generateSend)
router.put("/admin/claim/:id/update-staging", AuthRoleMiddleware, updateStatusClaim);

module.exports = router;
