import NotificationService from "../services/NotificationService.js";

const validation = require("../validation/user.validation");
const { randomString } = require("../utilities/functions");

const service = new NotificationService();

exports.getNotif = async (req, res) => {
    try {
        const notifications = await service.getNotifications(req);
        return res.jsonData(notifications);
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

exports.readStatus = async (req, res) => {
    try {
        await service.readStatus(req.body.id);
        return res.jsonSuccess(req.polyglot.t("success.default"));
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

exports.sendNotif = async (req, res) => {
    try {
        await service.createNotification(req);
        return res.jsonSuccess(req.polyglot.t("success.default"));
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};
