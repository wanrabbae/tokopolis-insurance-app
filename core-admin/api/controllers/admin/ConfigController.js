import ConfigService from '../../services/ConfigService'

const service = new ConfigService()
const validation = require('../../validation/config.validation')

exports.create = async (req, res) => {
    const validate = validation.create(req)
    if (validate.error) return res.errorValidation(validate.details)

    const config = await service.createConfig({
        key: req.body.key,
        value: req.body.value
    })

    return res.jsonData(config)
}

exports.all = async (req, res, next) => {
    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const count = await service.getCount()
    const data = await service.getConfigs(limit, offset)

    return res.jsonData({
        pagination: {
            total: count,
            per_page: limit,
            current_page: current,
            last_page: Math.ceil(count / limit),
        },
        list: data
    })
}

exports.update = async (req, res) => {
    const validate = validation.update(req)
    if (validate.error) return res.errorValidation(validate.details)

    await service.update(req.params.id, req.body)

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.destroy = async (req, res) => {
    await service.destroy(req.params.id)
    console.log(req.params.id);
    return res.jsonSuccess(req.polyglot.t('success.default'))
}

