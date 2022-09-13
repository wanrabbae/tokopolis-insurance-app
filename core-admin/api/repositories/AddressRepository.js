const { Op } = require('sequelize')

const { AddressProvince, AddressRegency,
    AddressDistrict, AddressVillage } = require('../models')

export default class AddressRepository {
    constructor() {}

    async getProvinces() {
        return await AddressProvince.findAll()
    }

    async getRegencies(province_id) {
        return await AddressRegency.findAll({
            where: {
                province_id: province_id
            }
        })
    }

    async getDistricts(regency_id) {
        return await AddressDistrict.findAll({
            where: {
                regency_id: regency_id
            }
        })
    }

    async getVillages(district_id) {
        return await AddressVillage.findAll({
            where: {
                district_id: district_id
            }
        })
    }
}