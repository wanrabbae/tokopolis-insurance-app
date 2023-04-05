const { Op, QueryTypes } = require("sequelize");
const moment = require("moment");

const { Account, ClaimProduct, Product, sequelize } = require("../models");

export default class ClaimProductRepository {
    constructor() { }

    async getAll(filter, limit, offset) {
        return await sequelize.query(`
            SELECT * FROM claim_products LEFT JOIN accounts as account ON account.id = claim_products.account_id ORDER BY claim_products.created_at ASC ` +
            (limit != undefined && offset != undefined ? `LIMIT ${limit} OFFSET ${offset}` : ''),
            { type: QueryTypes.SELECT });
    }

    async getClaimCount() {
        return await sequelize.query("SELECT COUNT(*) FROM claim_products");
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

    async getDetailDataWithTransactionId(id) {
        return await ClaimProduct.findOne({
            where: {
                transaction_id: id,
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
                    attributes: ["id", "name", "type", "image", "email"],
                },
            ],
        });
    }

    async createClaimProductData(payload) {
        return await ClaimProduct.create(payload);
    }

    async updateStatus(payload) {
        return await ClaimProduct.update(
            { status: payload.body.status },
            { where: { id: payload.params.id } }
        );
    }
}
