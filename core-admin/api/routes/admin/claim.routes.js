const { Router } = require("express");
const verify = require("../../middlewares/verifyToken");
const { uploadFile } = require("../../middlewares/uploadFile");

const {
    getAllClaimData,
    getDetailClaimProduct,
    updateStatusClaim,
} = require("../controllers/admin/ClaimController");

const router = Router();
const auth = verify();

router.get("/admin/claim/all", auth, getAllClaimData);
router.get("/admin/claim/:id", auth, getDetailClaimProduct);
router.post("/admin/claim/update-staging", auth, updateStatusClaim);

module.exports = router;
