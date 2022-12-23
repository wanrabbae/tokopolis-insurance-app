const { Router } = require("express");
const verify = require("../middlewares/verifyToken");
const {
    getNotif,
    readStatus,
    sendNotif,
} = require("../controllers/NotificationController.js");

const router = Router();
const auth = verify();

router.get("/notification", auth, getNotif);
router.put("/notification/read", auth, readStatus);
router.post("/notification", auth, sendNotif);

module.exports = router;
