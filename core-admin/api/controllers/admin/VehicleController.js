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

const excelEmpty = (text) => {
    if (text == '-' || text == 'N/A' ||
        text == '#N/A' || text == undefined) {
        return ''
    }

    return text
}

exports.importVehicle = async (req, res) => {
    const excel = uploadHandler(req.file.path, 'vehicle')
    if (!excel) return res.errorBadRequest()

    const result = xls.parse(`view/static/${excel.clearPath}`)
    if (!result) return res.errorBadRequest()

    const item = result[0].data

    var vehicleList = []

    for (let rowIndex = 2; rowIndex < item.length; rowIndex++) {
        const code = item[rowIndex][1]
        if (code == undefined) continue

        // index 0 - 12 save data to attribute
        var data = {
            brand: excelEmpty(item[rowIndex][0]),
            code: excelEmpty(code),
            capacity: excelEmpty(item[rowIndex][2]),
            model: excelEmpty(item[rowIndex][3]),
            sub_model: excelEmpty(item[rowIndex][4]),
            vehicle_type: excelEmpty(item[rowIndex][5]),
            vehicle_type_code: excelEmpty(item[rowIndex][6]),
            category: excelEmpty(item[rowIndex][7]),
            category_code: excelEmpty(item[rowIndex][8]),
            is_private: excelEmpty(item[rowIndex][9]),
            is_commercial: excelEmpty(item[rowIndex][10]),
            is_comprehensive: excelEmpty(item[rowIndex][11]),
            is_tlo: excelEmpty(item[rowIndex][12]),
            prices: []
        }

        // other, do year calculation
        for (let yearIndex = 13; yearIndex < item[rowIndex].length; yearIndex++) {
            const value = item[rowIndex][yearIndex]

            if (typeof value == 'number' && value !== 0) {
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