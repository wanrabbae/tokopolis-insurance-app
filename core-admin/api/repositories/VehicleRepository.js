const { QueryTypes } = require('sequelize')

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

    async getVehicle(id) {
        return await Vehicle.findByPk(id)
    }

    async getVehicleBrandList(year) {
        return await sequelize.query(this.vehicleQuery('vehicle.brand', `WHERE price.year = '${year}'`),
            { type: QueryTypes.SELECT })
    }

    async getVehicleModelList(year, brand) {
        return await sequelize.query(this.vehicleQuery('vehicle.model', `WHERE price.year = '${year}' ` +
            `AND vehicle.brand = '${brand}'`), { type: QueryTypes.SELECT })
    }

    async getVehicleSubList(year, brand, model) {
        return await sequelize.query(this.vehicleQuery('vehicle.sub_model', `WHERE price.year = '${year}' ` +
            `AND vehicle.brand = '${brand}' AND vehicle.model = '${model}'`),
            { type: QueryTypes.SELECT })
    }

    async getVehiclePrice(year, brand, model, sub_model) {
        return await sequelize.query("SELECT vehicle.id, vehicle.brand, vehicle.code, vehicle.capacity, " +
            "vehicle.model, vehicle.sub_model, vehicle.category_code, price.year, price.price, " +
            "vehicle.is_comprehensive, vehicle.is_tlo FROM vehicle_prices AS price " +
            `JOIN vehicles AS vehicle ON price.vehicle_id = vehicle.id WHERE price.year = '${year}' ` +
            `AND vehicle.brand = '${brand}' AND vehicle.model = '${model}' ` +
            `AND vehicle.sub_model = '${sub_model}'`,
            { type: QueryTypes.SELECT })
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

    async saveAccountVehicle(account_id, vehicle_id, payload) {
        return await sequelize.query(`INSERT INTO account_vehicles (account_id, vehicle_id, year, ` +
            `plate, plate_detail, vehicle_color, machine_number, skeleton_number, price, accessories) ` +
            `VALUES (${account_id},${vehicle_id},'${payload.year}','${payload.plate}','${payload.plate_detail}',` +
            `'${payload.vehicle_color}','${payload.machine_number}','${payload.skeleton_number}',` +
            `${payload.price},'${payload.accessories}')`,
            { type: QueryTypes.INSERT })
            // .catch((err) => { console.log(">> Error: ", err) })
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