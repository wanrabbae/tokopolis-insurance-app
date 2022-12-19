const fs = require("fs");
const jwt = require("jsonwebtoken");

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

    createClaimProduct(payload) {
        return this.repository.createClaimProductData(payload);
    }

    updateStatusData(payload) {
        return this.repository.updateStatus(payload);
    }
}
