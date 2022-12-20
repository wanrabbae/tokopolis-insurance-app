const { Router } = require("express");
const verify = require("../middlewares/verifyToken");
const { uploadFile } = require("../middlewares/uploadFile");

const {
    getClaimProduct,
    getDetailClaimProduct,
    claimProduct,
} = require("../controllers/ClaimController");

const router = Router();
const auth = verify();

router.get("/claim", auth, getClaimProduct);
router.get("/claim/:id", auth, getDetailClaimProduct);
router.post(
    "/claim",
    auth,
    uploadFile({
        fileSize: 5,
    }).fields([
        { name: "identity_card" },
        { name: "driver_license" },
        { name: "stnk" },
        { name: "other_document" },
        { name: "damage1" },
        { name: "damage2" },
        { name: "damage3" },
        { name: "damage4" },
    ]),
    claimProduct
);

module.exports = router;
