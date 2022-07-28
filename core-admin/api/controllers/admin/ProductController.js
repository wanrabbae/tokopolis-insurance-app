import ProductService from '../../services/ProductService'

const validation = require('../../validation/product.validation')

const service = new ProductService()

exports.list = async (req, res, next) => {
    const query = req.query.query || null

    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const count = await service.getCountByQuery(query)
    const list = await service.getProductAll(query, limit, offset)

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

exports.detail = async (req, res, next) => {
    const data = await service.getProduct(req.params.id)

    return res.jsonData(data)
}

exports.create = async (req, res, next) => {
    const validate = validation.create(req)
    if (validate.error) return res.errorValidation(validate.details)

    const product = await service.createProduct(req.body, req.files)

    return res.jsonData({ product_id: product.id })
}

exports.update = async (req, res, next) => {
    const validate = validation.update(req)
    if (validate.error) return res.errorValidation(validate.details)

    const product = await service.getProduct(req.params.id)
    if (product == null) return res.errorBadRequest(req.polyglot.t('error.product'))

    await service.updateProduct(product, req.body, req.files)

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.destroy = async (req, res, next) => {
    await service.deleteProduct(req.params.id)

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.createFeature = async (req, res, next) => {
    const validate = validation.createFeature(req)
    if (validate.error) return res.errorValidation(validate.details)

    await service.createFeature(req.body)

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.updateFeature = async (req, res, next) => {
    const validate = validation.updateFeature(req)
    if (validate.error) return res.errorValidation(validate.details)

    await service.updateFeature(req.params.id, req.body)

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.destroyFeature = async (req, res, next) => {
    await service.deleteFeature(req.params.id)

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.createExpansion = async (req, res, next) => {
    const validate = validation.createExpansion(req)
    if (validate.error) return res.errorValidation(validate.details)

    await service.createExpansion(req.body)

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.updateExpansion = async (req, res, next) => {
    const validate = validation.updateExpansion(req)
    if (validate.error) return res.errorValidation(validate.details)

    await service.updateExpansion(req.params.id, req.body)

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.destroyExpansion = async (req, res, next) => {
    await service.deleteExpansion(req.params.id)

    return res.jsonSuccess(req.polyglot.t('success.default'))
}