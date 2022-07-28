import EndpointService from '../../services/EndpointService'

const validation = require('../../validation/endpoint.validation')

const service = new EndpointService()

exports.create = async (req, res) => {
  const validate = validation.create(req)
  if (validate.error) return res.errorValidation(validate.details)

  const routeExist = await service.getRouteName(req.body)
  if (routeExist) return res.errorBadRequest(req.polyglot.t('error.route.exist'))

  const endpoint = await service.createEndpoint(req.body)

  return res.jsonData(endpoint)
}

exports.all = async (req, res, next) => {
  const data = await service.getAll()
  return res.jsonData(data)
}

exports.list = async (req, res, next) => {
  const query = req.query.query || null

  const current = Number(req.query.current) || 1
  const limit = Number(req.query.limit) || 10
  const offset = (current - 1) * limit

  const count = await service.getCountByQuery(query)
  const list = await service.getEndpointAll(query, limit, offset)

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

exports.update = async (req, res) => {
  console.log(req.method)
  console.log(req.url)
  console.log(req.url.split('/'))

  const validate = validation.create(req)
  if (validate.error) return res.errorValidation(validate.details)

  const endpoint = await service.getEndpoint(req.params.id)
  if (endpoint == null) return res.errorBadRequest(req.polyglot.t('error.endpoint.notfound'))

  if(endpoint.name != req.body.name) {
    const routeExist = await service.getRouteName(req.body.name)
    if (routeExist != null) return res.errorBadRequest(req.polyglot.t('error.route.exist'))
  }

  await service.update(endpoint.id, req.body)

  return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.destroy = async (req, res) => {
  await service.deleteEndpoint(req.params.id)
  return res.jsonSuccess(req.polyglot.t('success.default'))
}

