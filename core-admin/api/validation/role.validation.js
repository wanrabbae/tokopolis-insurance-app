const Joi = require('joi')

const { joiResponse, joiErrorMessages } = require('../utilities/validation')

const create = (req) => {

  const schema = Joi.object({
    alias: Joi.string()
      .required()
      .label(req.polyglot.t('field.alias')),
    endpoints: Joi.array().items(Joi.number())
      .required()
      .label(req.polyglot.t('field.endpoint.name')),
  })

  return joiResponse(schema.validate(req.body, {
    abortEarly: false,
    messages: joiErrorMessages(),
    errors: {
      language: req.locale.language
    }
  }))
}

const addEndpoint = (req) => {
  const schema = Joi.object({
    role_id: Joi.number()
      .required()
      .label(req.polyglot.t('field.role')),
    endpoint_id: Joi.number()
      .required()
      .label(req.polyglot.t('field.endpoint.name')),
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
  create, addEndpoint
}
