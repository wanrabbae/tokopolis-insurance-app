const fs = require("fs");
const jwt = require("jsonwebtoken");

import Mailer from "../utilities/mail";
import ClaimProductRepository from "../repositories/ClaimProductRepository.js";

const { getMoment, uploadHandler } = require("../utilities/functions");

const nuxtFolder = process.env.NUXT_STATIC_DIR;

export default class ClaimProductService {
    constructor() {
        this.repository = new ClaimProductRepository();
    }

    getAllData(filter, limit, offset) {
        return this.repository.getAll(filter, limit, offset);
    }

    getClaimCount(filter) {
        return this.repository.getClaimCount(filter);
    }

    getClaimCount(filter) {
        return this.repository.getClaimCount(filter);
    }

    getClaimProducts(req) {
        return this.repository.getClaimProductsData(req);
    }

    getDetailData(id) {
        return this.repository.getDetailData(id);
    }

    getClaimForXlsx() {
        return this.repository.getClaimForXlsx();
    }

    getDetailDataWithTrxId(id) {
        return this.repository.getDetailDataWithTransactionId(id);
    }

    createClaimProduct(payload, files) {
        payload.documents = {};

        Object.keys(files).forEach((key) => {
            const image = uploadHandler(files[key][0].path, "claim");
            payload.documents[key] = image.clearPath;
        });

        return this.repository.createClaimProductData(payload);
    }

    updateStatusData(id, status) {
        return this.repository.updateStatus(id, status);
    }

    sendEmailRequestClaimSuccess(payload) {
        let mailer = new Mailer(payload.host);
        // mailer.setUrl('/path')
        mailer.setType("request-claim-success");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: payload.data.name,
            reporter_fullname: payload.data.reporter_fullname,
            holder_fullname: payload.data.holder_fullname,
            incident_time: payload.data.incident_time
        });
        mailer.send();
    }

    sendEmailClaimFile(payload) {
        let mailer = new Mailer(payload.host);
        mailer.setType("claim-file-sent");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: payload.data.name,
            product: payload.data.product,
            url: payload.data.url,
        });
        mailer.send();
    }

}
