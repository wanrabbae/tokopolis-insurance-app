const Joi = require('joi')

const { joiResponse, joiErrorMessages } = require('../utilities/validation')

const register = (req) => {
    const schema = Joi.object({
        fullname: Joi.string()
            .required()
            .label(req.polyglot.t('field.fullname')),
        email: Joi.string()
            .min(6)
            .required()
            .email()
            .label(req.polyglot.t('field.email')),
        phone: Joi.number()
            .required()
            .label(req.polyglot.t('field.phone')),
        password: Joi.string()
            .min(6)
            .required()
            .label(req.polyglot.t('field.password')),
        password_confirmation: Joi.any()
            .valid(Joi.ref('password'))
            .required()
            .label(req.polyglot.t('field.password_confirmation')),
    })

    return joiResponse(schema.validate(req.body, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const login = (req) => {
    const schema = Joi.object ({
        email: Joi.string()
            .min(6)
            .required()
            .email()
            .label(req.polyglot.t('field.email')),
        password: Joi.string()
            .min(6)
            .required()
            .label(req.polyglot.t('field.password'))
    })

    return joiResponse(schema.validate(req.body, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const guest = (req) => {
    const schema = Joi.object ({
        fullname: Joi.string()
            .required()
            .label(req.polyglot.t('field.fullname')),
        email: Joi.string()
            .min(6)
            .required()
            .email()
            .label(req.polyglot.t('field.email')),
        phone: Joi.number()
            .required()
            .label(req.polyglot.t('field.phone')),
    })

    return joiResponse(schema.validate(req.body, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const forget = (req) => {
    const schema = Joi.object ({
        email: Joi.string()
            .min(6)
            .required()
            .email()
            .label(req.polyglot.t('field.email')),
    })

    return joiResponse(schema.validate(req.body, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const changeForget = (req) => {
    const schema = Joi.object ({
        token: Joi.string()
            .min(40)
            .required()
            .label(req.polyglot.t('field.token')),
        password: Joi.string()
            .min(8)
            .required()
            .label(req.polyglot.t('field.password')),
        password_confirmation: Joi.any()
            .valid(Joi.ref('password'))
            .required()
            .label(req.polyglot.t('field.password_confirmation')),
    })

    return joiResponse(schema.validate(req.body, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const confirmEmail = (req) => {
    const schema = Joi.object ({
        token: Joi.string()
            .min(40)
            .required()
            .label(req.polyglot.t('field.token')),
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
    register, login, guest, forget,
    changeForget, confirmEmail
}