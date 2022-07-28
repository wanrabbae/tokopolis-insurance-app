const Joi = require('joi')

const { joiResponse, joiErrorMessages } = require('../utilities/validation')

const price = (req) => {
    const schema = Joi.object({
        year: Joi.string()
            .min(4)
            .required()
            .label(req.polyglot.t('field.year')),
        brand: Joi.string()
            .required()
            .label(req.polyglot.t('field.brand')),
        model: Joi.string()
            .required()
            .label(req.polyglot.t('field.model')),
        sub_model: Joi.string()
            .required()
            .label(req.polyglot.t('field.sub_model'))
    })

    return joiResponse(schema.validate(req.query, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

module.exports = {
    price
}