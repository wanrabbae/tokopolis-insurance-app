import AddressService from '../services/AddressService'

const { titleCase } = require('../utilities/functions')

const service = new AddressService()

exports.provinces = async (req, res) => {
    const data = await service.getProvinces()
    if (data == null) return res.errorBadRequest(req.polyglot.t('error.address.province'))

    return res.jsonData(data.map(item => {
        item.name = titleCase(item.name)

        return item
    }))
}

exports.regencies = async (req, res) => {
    const data = await service.getRegencies(req.query.province_id)
    if (data == null) return res.errorBadRequest(req.polyglot.t('error.address.regency'))

    return res.jsonData(data.map(item => {
        item.name = titleCase(item.name)

        return item
    }))
}

exports.districts = async (req, res) => {
    const data = await service.getDistricts(req.query.regency_id)
    if (data == null) return res.errorBadRequest(req.polyglot.t('error.address.district'))

    return res.jsonData(data.map(item => {
        item.name = titleCase(item.name)

        return item
    }))
}

exports.villages = async (req, res) => {
    const data = await service.getVillages(req.query.district_id)
    if (data == null) return res.errorBadRequest(req.polyglot.t('error.address.village'))

    return res.jsonData(data.map(item => {
        item.name = titleCase(item.name)

        return item
    }))
}