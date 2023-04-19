const Joi = require('joi')

const { joiResponse, joiErrorMessages } = require('../utilities/validation')

const create = (req) => {
    const schema = Joi.object({
        key: Joi.string()
            .required()
            .label(req.polyglot.t('field.config.key')),
        value: Joi.string()
            .required()
            .label(req.polyglot.t('field.config.value')),
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
        key: Joi.string()
            .required()
            .label(req.polyglot.t('field.config.key')),
        value: Joi.string()
            .required()
            .label(req.polyglot.t('field.config.value')),
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
