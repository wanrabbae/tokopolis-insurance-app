const Joi = require('joi')

const { joiResponse, joiErrorMessages } = require('../utilities/validation')

const create = (req) => {
  const schema = Joi.array().items({
    name: Joi.string()
      .required()
      .label(req.polyglot.t('field.endpoint.name')),
    route: Joi.string()
      .required()
      .label(req.polyglot.t('field.endpoint.route')),
    method: Joi.valid('GET', 'POST', 'PUT', 'PATCH', 'DELETE')
      .required()
      .label(req.polyglot.t('field.endpoint.method')),
  })

  return joiResponse(schema.validate(req.body, {
    abortEarly: false,
    messages: joiErrorMessages(),
    errors: {
      language: req.locale.language
    }
  }))
}

const update = (req) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .label(req.polyglot.t('field.endpoint.name')),
    route: Joi.string()
      .required()
      .label(req.polyglot.t('field.endpoint.route')),
    method: Joi.valid('GET', 'POST', 'PUT', 'PATCH', 'DELETE')
      .required()
      .label(req.polyglot.t('field.endpoint.method')),
  })

  return joiResponse(schema.validate(req.body, {
    abortEarly: false,
    messages: joiErrorMessages(),
    errors: {
      language: req.locale.language
    }
  }))
}

module.exports = {
  create, update
}
