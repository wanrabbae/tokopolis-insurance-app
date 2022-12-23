const fs = require("fs");
const jwt = require("jsonwebtoken");

import Mailer from "../utilities/mail.js";
import NotificationRepository from "../repositories/NotificationRepository.js";

const { getMoment, uploadHandler } = require("../utilities/functions");

const nuxtFolder = process.env.NUXT_STATIC_DIR;

export default class NotificationService {
    constructor() {
        this.repository = new NotificationRepository();
    }

    getNotifications(req) {
        return this.repository.getNotificationsData(req);
    }

    readStatus(id) {
        return this.repository.readedStatus(id);
    }

    createNotification(payload) {
        const data = {
            title: payload.body.title,
            message: payload.body.message,
            link: payload.body.link,
            user_id: payload.body.user_id,
            sender_user_id: payload.account._id,
        };
        return this.repository.createNotificationData(data);
    }

    sendNotification(data) {
        return this.repository.createNotificationData(data);
    }
}
