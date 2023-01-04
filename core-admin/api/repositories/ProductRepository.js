const { Op } = require('sequelize')

const { Product, ProductFeature,
    ProductExpansion } = require('../models')

export default class ProductRepository {
    constructor() {}

    async productNames() {
        return await Product.findAll({
            attributes: ['name']
        })
    }

    async getProductAll(filter, limit, offset) {
        return await Product.findAll({
            where: {
                name: { [Op.like]: `%${filter.name}%` },
                type: { [Op.like]: `%${filter.type}%` },
            },
            limit: limit,
            offset: offset,
        })
    }

    async getProductList(payload, limit, offset) {
        return await Product.findAll({
            where: {
                type: payload.protection,
                supported_brands: {
                    [Op.or]: {
                        [Op.like]: `%${payload.brand}%`,
                        [Op.is]: null
                    }
                },
                vehicle_max_year: {
                    [Op.or]: {
                        [Op.gte]: payload.vehicle_age,
                        [Op.is]: null
                    }
                },
            },
            limit: limit,
            offset: offset,
            include: {
                model: ProductFeature,
                as: 'features',
                foreignKey: 'product_id',
            },
        })
    }

    async getProductsComparation(ids) {
        return await Product.findAll({
            where: { id: ids },
            attributes: ['id', 'name', 'image'],
            include: {
                model: ProductFeature,
                as: 'features',
                foreignKey: 'product_id',
            },
        })
    }

    async getCountByVehicle(payload) {
        return await Product.count({
            where: {
                type: payload.protection,
                supported_brands: {
                    [Op.or]: {
                        [Op.like]: `%${payload.brand}%`,
                        [Op.is]: null
                    }
                },
                vehicle_max_year: {
                    [Op.or]: {
                        [Op.gte]: payload.vehicle_age,
                        [Op.is]: null
                    }
                },
            }
        })
    }

    async getCountByQuery(filter) {
        return await Product.count({
            where: {
                name: { [Op.like]: `%${filter.name}%` },
                type: { [Op.like]: `%${filter.type}%` },
            },
        })
    }

    async getProduct(id) {
        return await Product.findByPk(id, {
            include: [{
                model: ProductFeature,
                as: 'features',
                foreignKey: 'product_id',
            }, {
                model: ProductExpansion,
                as: 'expansions',
                foreignKey: 'product_id',
            }],
        })
    }

    async getExpansionList(product_id) {
        return await ProductExpansion.findAll({
            where: { product_id: product_id },
            raw: true
        })
    }

    async createProduct(payload) {
        return await Product.create(payload)
    }

    async updateProduct(id, payload) {
        return await Product.update(payload, {
            where: { id: id }
        })
    }

    async deleteProduct(id) {
        return await Product.destroy({
            where: { id: id }
        })
    }

    async createFeature(payload) {
        return await ProductFeature.create({
            product_id: payload.product_id,
            name: payload.name,
            type: payload.type,
            short_description: payload.short_description,
            description: payload.description,
        })
    }

    async updateFeature(id, payload) {
        return await ProductFeature.update({
            name: payload.name,
            type: payload.type,
            short_description: payload.short_description,
            description: payload.description,
        }, { where: { id: id } })
    }

    async deleteFeature(id) {
        return await ProductFeature.destroy({
            where: { id: id }
        })
    }

    async createExpansion(payload) {
        return await ProductExpansion.create({
            product_id: payload.product_id,
            name: payload.name,
            label: payload.label,
            rate: payload.rate,
        })
    }

    async updateExpansion(id, payload) {
        return await ProductExpansion.update({
            name: payload.name,
            label: payload.label,
            rate: payload.rate,
        }, { where: { id: id } })
    }

    async deleteExpansion(id) {
        return await ProductExpansion.destroy({
            where: { id: id }
        })
    }
}