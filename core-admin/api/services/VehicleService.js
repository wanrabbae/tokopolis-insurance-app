import VehicleRepository from '../repositories/VehicleRepository'

export default class VehicleService {
    constructor() {
        this.repository = new VehicleRepository()
    }

    vehicleBrands() {
        return this.repository.vehicleBrands()
    }

    vehicleTypes() {
        return this.repository.vehicleTypes()
    }

    vehicleCategories() {
        return this.repository.vehicleCategories()
    }

    getVehicleAll(filter, limit, offset) {
        return this.repository.getVehicleAll(filter, limit, offset)
    }

    getVehicleByCode(code) {
        return this.repository.getVehicleByCode(code)
    }

    getVehicleBrandList(year) {
        return this.repository.getVehicleBrandList(year)
    }

    getVehicleModelList(year, brand) {
        return this.repository.getVehicleModelList(year, brand)
    }

    getVehicleSubList(year, brand, model) {
        return this.repository.getVehicleSubList(year, brand, model)
    }

    async getVehiclePrice(year, brand, model, sub_model) {
        var returnValue = {}

        const data = await this.repository.getVehiclePrice(year, brand, model, sub_model)

        if (data.length > 0) {
            returnValue = data[0]

            returnValue.lowest_price = Math.ceil(returnValue.price * 0.85)
            returnValue.highest_price = Math.ceil(returnValue.price * 1.15)
        }

        return returnValue
    }

    getVehiclePriceList(id) {
        return this.repository.getVehiclePriceList(id)
    }

    getAccountVehicle(id) {
        return this.repository.getAccountVehicle(id)
    }

    getCountByQuery(filter) {
        return this.repository.getCountByQuery(filter)
    }

    createVehicle(payload) {
        return this.repository.createVehicle(payload)
    }

    createVehiclePrices(payload) {
        return this.repository.createVehiclePrices(payload)
    }

    async saveAccountVehicle(account_id, vehicle_id, payload) {
        const data = await this.repository.searchAccountVehicle(account_id,
            vehicle_id, payload)

        if (data.length > 0) return data[0].id

        const newData = await this.repository.saveAccountVehicle(account_id,
            vehicle_id, payload)

        return newData[0]
    }

    removeVehiclePrices(vehicle_id) {
        return this.repository.removeVehiclePrices(vehicle_id)
    }

    getAccessoriesJson(payloads) {
        const accessories = []

        for (const acc of payloads != null ? payloads : []) {
            const data = acc.split(',')

            if (data.length < 3 || data.includes('')) {
                return []
            }

            accessories.push({
                brand: data[0],
                type: data[1],
                price: Number(data[2]),
            })
        }

        return accessories
    }

    getAccessoriesTotalPrice(accessories) {
        return accessories.reduce((prev, current) => prev + current.price, 0)
    }

    getPlateList() {
        return this.repository.getPlateList()
    }

    getPlateData(plate) {
        return this.repository.getPlateData(plate)
    }
}