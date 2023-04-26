const { QueryTypes, Op } = require("sequelize");

const { sequelize, Config } = require("../models");

export default class ConfigRepository {
    constructor() { }

    async getConfigs(limit, offset) {
        return await Config.findAll({
            limit,
            offset
        })
    }

    async getCount() {
        return await Config.count()
    }

    async getConfigByKey(key) {
        return await Config.findOne({ where: { key: key } })
    }

    async createKey(payload) {
        return await Config.create(payload)
    }

    async updateKey(id, payload) {
        return await Config.update(payload, {
            where: { id: id }
        })
    }

    async deleteKey(id) {
        return await Config.destroy({
            where: { id: id }
        })
    }
}