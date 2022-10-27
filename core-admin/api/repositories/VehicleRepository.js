const { Op, QueryTypes } = require('sequelize')

const { sequelize, Vehicle,
    VehiclePrice, AccountVehicle,
    LicensePlate } = require('../models')

export default class VehicleRepository {
    constructor() {
        this.vehicleQuery = (select, optional) => {
            return `SELECT DISTINCT ${select} FROM vehicle_prices AS price ` +
            `JOIN vehicles AS vehicle ON price.vehicle_id = vehicle.id ${optional}`
        }
    }

    async vehicleBrands() {
        return await Vehicle.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('brand')) ,'brand']
            ]
        })
    }

    async vehicleTypes() {
        return await Vehicle.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('vehicle_type')) ,'vehicle_type']
            ]
        })
    }

    async vehicleCategories() {
        return await Vehicle.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('category')) ,'category']
            ]
        })
    }

    async getVehicleAll(filter, limit, offset) {
        return await Vehicle.findAll({
            where: {
                brand: { [Op.like]: `%${filter.brand}%` },
                vehicle_type: { [Op.like]: `%${filter.vehicle_type}%` },
                category: { [Op.like]: `%${filter.category}%` },
            },
            limit: limit,
            offset: offset,
        })
    }

    async getVehicle(id) {
        return await Vehicle.findByPk(id)
    }

    async getVehicleByCode(code) {
        return await Vehicle.findOne({
            where: {
                code: code
            }
        })
    }

    async getVehicleBrandList(year) {
        return await sequelize.query(this.vehicleQuery('vehicle.brand', `WHERE price.year = '${year}' ` +
            `ORDER BY vehicle.brand ASC`),
            { type: QueryTypes.SELECT })
    }

    async getVehicleModelList(year, brand) {
        return await sequelize.query(this.vehicleQuery('vehicle.model', `WHERE price.year = '${year}' ` +
            `AND vehicle.brand = '${brand}' ORDER BY vehicle.model ASC`), { type: QueryTypes.SELECT })
    }

    async getVehicleSubList(year, brand, model) {
        return await sequelize.query(this.vehicleQuery('vehicle.sub_model', `WHERE price.year = '${year}' ` +
            `AND vehicle.brand = '${brand}' AND vehicle.model = '${model}' ORDER BY vehicle.sub_model ASC`),
            { type: QueryTypes.SELECT })
    }

    async getVehiclePrice(year, brand, model, sub_model) {
        return await sequelize.query("SELECT vehicle.id, vehicle.brand, vehicle.code, vehicle.capacity, " +
            "vehicle.model, vehicle.sub_model, vehicle.category_code, price.year, price.price, " +
            "vehicle.is_private, vehicle.is_commercial, vehicle.is_comprehensive, vehicle.is_tlo " +
            "FROM vehicle_prices AS price " +
            `JOIN vehicles AS vehicle ON price.vehicle_id = vehicle.id WHERE price.year = '${year}' ` +
            `AND vehicle.brand = '${brand}' AND vehicle.model = '${model}' ` +
            `AND vehicle.sub_model = '${sub_model}'`,
            { type: QueryTypes.SELECT })
    }

    async getVehiclePriceList(id) {
        return await VehiclePrice.findAll({
            where: {
                vehicle_id: id
            }
        })
    }

    async getAccountVehicle(id) {
        return await sequelize.query("SELECT vehicle.id, vehicle.brand, vehicle.model, " +
            "vehicle.sub_model, data.year, data.plate, data.plate_detail, data.vehicle_color, " +
            "data.machine_number, data.skeleton_number, data.price FROM account_vehicles AS data " +
            `JOIN vehicles AS vehicle ON data.vehicle_id = vehicle.id WHERE data.id = '${id}'`,
            { type: QueryTypes.SELECT })
    }

    async searchAccountVehicle(account_id, vehicle_id, payload) {
        return await sequelize.query("SELECT id FROM account_vehicles " +
            `WHERE account_id = '${account_id}' AND vehicle_id = '${vehicle_id}' ` +
            `AND (vehicle_color = '${payload.vehicle_color}' ` +
            `OR machine_number = '${payload.machine_number}' ` +
            `OR skeleton_number = '${payload.skeleton_number}')`,
            { type: QueryTypes.SELECT })
    }

    async getCountByQuery(filter) {
        return await Vehicle.count({
            where: {
                brand: { [Op.like]: `%${filter.brand}%` },
                vehicle_type: { [Op.like]: `%${filter.vehicle_type}%` },
                category: { [Op.like]: `%${filter.category}%` },
            },
        })
    }

    async createVehicle(payload) {
        return await Vehicle.create(payload)
    }

    async createVehiclePrices(payload) {
        return await VehiclePrice.bulkCreate(payload)
    }

    async saveAccountVehicle(account_id, vehicle_id, payload) {
        return await sequelize.query(`INSERT INTO account_vehicles (account_id, vehicle_id, year, ` +
            `plate, plate_detail, vehicle_color, machine_number, skeleton_number, price, accessories) ` +
            `VALUES (${account_id},${vehicle_id},'${payload.year}','${payload.plate}','${payload.plate_detail}',` +
            `'${payload.vehicle_color}','${payload.machine_number}','${payload.skeleton_number}',` +
            `${payload.price},'${payload.accessories}')`,
            { type: QueryTypes.INSERT })
            // .catch((err) => { console.log(">> Error: ", err) })
    }

    async removeVehiclePrices(vehicle_id) {
        return await VehiclePrice.destroy({
            where: {
                vehicle_id: vehicle_id
            }
        })
    }

    async getPlateList() {
        return await LicensePlate.findAll()
    }

    async getPlateData(plate) {
        return await LicensePlate.findOne({
            where: { code: plate }
        })
    }
}