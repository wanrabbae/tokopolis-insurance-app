const moment = require("moment");
const { Op } = require("sequelize");

const { Account, Notification, Profile } = require("../models");

export default class NotificationRepository {
    constructor() {}

    async getNotificationsData(req) {
        return await Notification.findAll({
            where: {
                user_id: req.account._id,
            },
            include: {
                model: Account,
                as: "account",
                attributes: ["id", "fullname", "email"],
                include: {
                    model: Profile,
                    as: "profile",
                    attributes: ["account_id", "photo", "phone", "birth_date"],
                },
            },
        });
    }

    async createNotificationData(payload) {
        return await Notification.create(payload);
    }

    async readedStatus(id) {
        return await Notification.update({ is_seen: 1 }, { where: { id: id } });
    }
}
