import VehicleService from '../services/VehicleService'

const validation = require('../validation/vehicle.validation')

const service = new VehicleService()

exports.getVehicleData = async (req, res) => {
    var param = req.query
    if (param == null) return res.errorBadRequest(req.polyglot.t('error.parameter'))

    var returnValue = {}

    if (param.year != null && param.brand == null) {
        var data = await service.getVehicleBrandList(param.year)

        returnValue = data.map(item => { return item.brand })
    }
    else if (param.brand != null && param.model == null) {
        var data = await service.getVehicleModelList(param.year,
            param.brand)

        returnValue = data.map(item => { return item.model })
    }
    else if (param.model != null) {
        var data = await service.getVehicleSubList(param.year,
            param.brand, param.model)

        returnValue = data.map(item => { return item.sub_model })
    }

    return res.jsonData(returnValue)
}

exports.getVehiclePrice = async (req, res) => {
    const validate = validation.price(req)
    if (validate.error) return res.errorValidation(validate.details)

    var param = req.query
    var data = await service.getVehiclePrice(param.year, param.brand,
        param.model, param.sub_model)

    return res.jsonData(data)
}

exports.getLicensePlate = async (req, res) => {
    const plates = await service.getPlateList()

    return res.jsonData(plates)
}