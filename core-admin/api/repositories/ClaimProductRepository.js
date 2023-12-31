const { Op, QueryTypes } = require("sequelize");
const moment = require("moment");

const { Account, ClaimProduct, Product, Transaction, Profile, Vehicle, sequelize } = require("../models");

export default class ClaimProductRepository {
    constructor() { }

    async getAll(filter, limit, offset) {
        return await sequelize.query(`
            SELECT claim_products.id, claim_products.transaction_id, claim_products.plate_number, claim_products.reporter_fullname, claim_products.holder_fullname, claim_products.incident_time, claim_products.location, claim_products.status, account.fullname as account_name FROM claim_products LEFT JOIN accounts as account ON account.id = claim_products.account_id JOIN products as product ON product.id = claim_products.product_id 
            WHERE claim_products.transaction_id LIKE '%${filter.id}%' 
            AND claim_products.id LIKE '%${filter.id_claim}%' 
            AND claim_products.holder_fullname LIKE '%${filter.holder_name}%' 
            ORDER BY claim_products.created_at ASC ` +
            (limit != undefined && offset != undefined ? `LIMIT ${limit} OFFSET ${offset}` : ''),
            { type: QueryTypes.SELECT });
    }

    async getClaimCount(filter) {
        return await sequelize.query(`SELECT COUNT(*) as total FROM claim_products LEFT JOIN accounts as account ON account.id = claim_products.account_id JOIN products as product ON product.id = claim_products.product_id 
        WHERE claim_products.transaction_id LIKE '%${filter.id}%' 
        AND claim_products.id LIKE '%${filter.id_claim}%' 
        AND claim_products.holder_fullname LIKE '%${filter.holder_name}%'`);
    }

    async getClaimProductsData(req, limit, offset) {
        return await ClaimProduct.findAll({
            where: {
                account_id: req.account._id,
            },
            order: [['id', 'DESC']],
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
            limit: limit,
            offset: offset
        });
    }

    async getClaimProductsCountData(account_id) {
        return await ClaimProduct.count({
            where: {
                account_id: account_id,
            },
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
                    include: {
                        model: Profile,
                        as: 'profile'
                    }
                },
                {
                    model: Product,
                    as: "product",
                    attributes: ["id", "name", "type", "image"],
                },
                {
                    model: Transaction,
                    as: "transaction",
                    attributes: ["id", "agent_id", "vehicle_data"],
                    include: {
                        model: Vehicle
                    }
                },
            ],
        });
    }

    async getClaimForXlsx() {
        return await ClaimProduct.findAll({});
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

    async updateStatus(id, status) {
        let updateDate = '';

        switch (status) {
            case 'surveyed':
                updateDate = `, surveyed_at='${moment().format('YYYY-MM-DD HH:mm:ss')}'`
                break;
            case 'accepted':
                updateDate = `, accepted_at='${moment().format('YYYY-MM-DD HH:mm:ss')}'`
                break;
            case 'declined':
                updateDate = `, declined_at='${moment().format('YYYY-MM-DD HH:mm:ss')}'`
                break;
            case 'fixed':
                updateDate = `, fixed_at='${moment().format('YYYY-MM-DD HH:mm:ss')}'`
                break;
            case 'ready':
                updateDate = `, ready_at='${moment().format('YYYY-MM-DD HH:mm:ss')}'`
                break;
            case 'done':
                updateDate = `, done_at='${moment().format('YYYY-MM-DD HH:mm:ss')}'`
                break;

            default:
                break;
        }

        return await sequelize.query(`
        UPDATE claim_products SET status='${status}'` + updateDate + ` WHERE id='${id}'`
        )
    }
}
