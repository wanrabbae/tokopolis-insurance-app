const csv = require('csv-parser')
const fs = require('fs')

import VehicleService from '../../services/VehicleService'

const service = new VehicleService()

exports.vehicleCSV = async (req, res) => {
    return res.jsonData()
}

exports.vehicleBrands = async (req, res) => {
    const data = await service.vehicleBrands()

    return res.jsonData(data)
}

exports.vehicleTypes = async (req, res) => {
    const data = await service.vehicleTypes()

    return res.jsonData(data)
}