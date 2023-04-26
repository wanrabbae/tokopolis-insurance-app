const { Router } = require("express");
const verify = require("../../middlewares/verifyToken");
const verifyToken = require('../../middlewares/verifyRole');
const { uploadFile } = require("../../middlewares/uploadFile");

const {
    getAllClaimData,
    getDetailClaimProduct,
    updateStatusClaim,
    generateSend,
    getClaimFileXlsx
} = require("../../controllers/admin/ClaimController");

const router = Router();
const auth = verify();
const AuthRoleMiddleware = verifyToken('auth:role')

router.get("/admin/claim/all", AuthRoleMiddleware, getAllClaimData);
router.post("/admin/claim/download", AuthRoleMiddleware, getClaimFileXlsx);
router.get("/admin/claim/:id", AuthRoleMiddleware, getDetailClaimProduct);
router.put('/admin/claim/:transaction_id/generate-send', generateSend)
router.put("/admin/claim/:id/updateStaging", AuthRoleMiddleware, updateStatusClaim);

module.exports = router;
