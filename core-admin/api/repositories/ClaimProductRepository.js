const moment = require("moment");
const { Op } = require("sequelize");

const { Account, ClaimProduct, Product } = require("../models");

export default class ClaimProductRepository {
    constructor() {}

    async getAll() {
        return await ClaimProduct.findAll({
            include: {
                model: Account,
                as: "account",
                attributes: ["id", "fullname", "email"],
            },
        });
    }

    async getClaimProductsData(req) {
        return await ClaimProduct.findAll({
            where: {
                account_id: req.account._id,
            },
            include: [
                {
                    model: Account,
                    as: "account",
                    attributes: ["id", "fullname", "email"],
                },
                {
                    model: Product,
                    as: "product",
                    attributes: ["id", "name", "type", "image"],
                },
            ],
        });
    }

    async getDetailData(id) {
        return await ClaimProduct.findOne({
            where: {
                id: id,
            },
            include: {
                model: Account,
                as: "account",
                attributes: ["id", "fullname", "email"],
            },
        });
    }

    async createClaimProductData(payload) {
        return await ClaimProduct.create(payload);
    }

    async updateStatus(payload) {
        return await ClaimProduct.update(
            { status: payload.status },
            { where: { id: payload.id } }
        );
    }
}
