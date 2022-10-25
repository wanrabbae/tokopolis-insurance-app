const xls = require('node-xlsx')
const fs = require('fs')

import VehicleService from '../../services/VehicleService'

const { uploadHandler } = require('../../utilities/functions')

const service = new VehicleService()

exports.list = async (req, res, next) => {
    const filter = {
        brand: req.query.brand || '',
        vehicle_type: req.query.vehicle_type || '',
        category: req.query.category || '',
    }

    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const count = await service.getCountByQuery(filter)
    const list = await service.getVehicleAll(filter, limit, offset)

    return res.jsonData({
        pagination: {
            total: count,
            per_page: limit,
            current_page: current,
            last_page: Math.ceil(count / limit),
        },
        list: list
    })
}

exports.importVehicle = async (req, res) => {
    const excel = uploadHandler(req.file.path, 'vehicle')
    if (!excel) return res.errorBadRequest()

    const result = xls.parse(`view/static/${excel.clearPath}`)
    if (!result) return res.errorBadRequest()

    const item = result[0].data

    var vehicleList = []

    for (let rowIndex = 2; rowIndex < item.length; rowIndex++) {
        // index 0 - 12 save data to attribute
        var data = {
            brand: item[rowIndex][0],
            code: item[rowIndex][1],
            capacity: item[rowIndex][2],
            model: item[rowIndex][3],
            sub_model: item[rowIndex][4],
            vehicle_type: item[rowIndex][5],
            vehicle_type_code: item[rowIndex][6],
            category: item[rowIndex][7],
            category_code: item[rowIndex][8],
            is_private: item[rowIndex][9],
            is_commercial: item[rowIndex][10],
            is_comprehensive: item[rowIndex][11],
            is_tlo: item[rowIndex][12],
            prices: []
        }

        // other, do year calculation
        for (let yearIndex = 13; yearIndex < item[rowIndex].length; yearIndex++) {
            const value = item[rowIndex][yearIndex]

            if (typeof value == 'number') {
                data.prices.push({
                    year: item[0][yearIndex],
                    value: value,
                })
            }
        }

        vehicleList.push(data)
    }

    // populate db
    vehicleList.forEach(async (element) => {
        if (element.code != undefined) {
            const getData = await service.getVehicleByCode(element.code)

            if (getData == null) {
                service.createVehicle(element)
                    .then(result => {
                        const prices = element.prices.map(item => {
                            return {
                                vehicle_id: result.id,
                                year: item.year,
                                price: item.value
                            }
                        })

                        service.createVehiclePrices(prices)
                    })
            } else {
                getData.update(element)
                service.removeVehiclePrices(getData.id)
                    .then(() => {
                        const prices = element.prices.map(item => {
                            return {
                                vehicle_id: getData.id,
                                year: item.year,
                                price: item.value
                            }
                        })

                        service.createVehiclePrices(prices)
                    })
            }
        }
    })

    return res.jsonSuccess()
}

exports.getPriceList = async (req, res, next) => {
    const data = await service.getVehiclePriceList(req.query.vehicle_id)

    return res.jsonData(data)
}

exports.vehicleBrands = async (req, res) => {
    const data = await service.vehicleBrands()

    return res.jsonData(data)
}

exports.vehicleTypes = async (req, res) => {
    const data = await service.vehicleTypes()

    return res.jsonData(data)
}

exports.vehicleCategories = async (req, res) => {
    const data = await service.vehicleCategories()

    return res.jsonData(data)
}