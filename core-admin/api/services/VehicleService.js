const csv = require('csv-parser')
const fs = require('fs')

import VehicleRepository from '../repositories/VehicleRepository'

export default class VehicleService {
    constructor() {
        this.repository = new VehicleRepository()
    }

    importData(file) {
        Object.keys(file).forEach(key => {
            const csv = uploadHandler(file[key][0].path, 'vehicle')
            documents[key] = csv.clearPath
        })

        // fs.createReadStream('data.csv')
        //     .pipe(csv())
        //     .on('data', (row) => {
        //         console.log(row);
        //     })
        //     .on('end', () => {
        //         console.log('CSV file successfully processed');
        //     })
    }

    vehicleBrands() {
        return this.repository.vehicleBrands()
    }

    vehicleTypes() {
        return this.repository.vehicleTypes()
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

    getAccountVehicle(id) {
        return this.repository.getAccountVehicle(id)
    }

    async saveAccountVehicle(account_id, vehicle_id, payload) {
        const data = await this.repository.searchAccountVehicle(account_id,
            vehicle_id, payload)

        if (data.length > 0) return data[0].id

        const newData = await this.repository.saveAccountVehicle(account_id,
            vehicle_id, payload)

        return newData[0]
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