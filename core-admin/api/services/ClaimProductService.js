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

    createClaimProduct(payload, files) {
        const documents = {};

        Object.keys(files).forEach((key) => {
            const image = uploadHandler(files[key][0].path, "claim");
            documents[key] = image.clearPath;
        });

        const data = {
            account_id: payload.account._id,
            transaction_id: payload.body.transaction_id,
            product_id: payload.query.product_id,
            no_polis: payload.body.no_polis,
            incident_time: payload.body.incident_time,
            location: payload.body.location,
            chronology: payload.body.chronology,
            documents: documents,
        };

        return this.repository.createClaimProductData(data);
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
}