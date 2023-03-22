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

    getAllData() {
        return this.repository.getAll();
    }

    getClaimProducts(req) {
        return this.repository.getClaimProductsData(req);
    }

    getDetailData(id) {
        return this.repository.getDetailData(id);
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

    updateStatusData(payload) {
        return this.repository.updateStatus(payload);
    }

    sendEmailRequestClaimSuccess(payload) {
        let mailer = new Mailer(payload.host);
        // mailer.setUrl('/path')
        mailer.setType("request-claim-success");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: payload.data.name,
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
