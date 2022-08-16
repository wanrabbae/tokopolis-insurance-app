const Joi = require('joi')

const { joiResponse, joiErrorMessages } = require('../utilities/validation')
const { extensionHelper } = require('../utilities/functions')

const post = (req) => {
    const schema = Joi.object({
        condition: Joi.valid('new', 'old')
            .required()
            .label(req.polyglot.t('field.transaction.condition')),
        fullname: Joi.string()
            .required()
            .label(req.polyglot.t('field.transaction.fullname')),
        phone: Joi.string()
            .min(11)
            .max(13)
            .pattern(/^[0-9]+$/)
            .label(req.polyglot.t('field.transaction.phone')),
        email: Joi.string()
            .email()
            .label(req.polyglot.t('field.transaction.email')),
        plate_detail: Joi.string()
            .required()
            .label(req.polyglot.t('field.plate_detail')),
        vehicle_color: Joi.string()
            .required()
            .label(req.polyglot.t('field.color')),
        machine_number: Joi.string()
            .required()
            .label(req.polyglot.t('field.machine_number')),
        skeleton_number: Joi.string()
            .required()
            .label(req.polyglot.t('field.skeleton_number')),
    })

    return joiResponse(schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const fileNew = (req) => {
    const extensions = extensionHelper(['png', 'jpg', 'jpeg'])

    const schema = Joi.object({
        condition: Joi.valid('new', 'old')
            .required()
            .label(req.polyglot.t('field.transaction.condition')),
        bastk: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.bastk')),
        identity_card: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.identity')),
        fullname: Joi.string()
            .required()
            .label(req.polyglot.t('field.transaction.fullname')),
        phone: Joi.string()
            .min(11)
            .max(13)
            .pattern(/^[0-9]+$/)
            .label(req.polyglot.t('field.transaction.phone')),
        email: Joi.string()
            .email()
            .label(req.polyglot.t('field.transaction.email')),
        plate_detail: Joi.string()
            .required()
            .label(req.polyglot.t('field.plate_detail')),
        vehicle_color: Joi.string()
            .required()
            .label(req.polyglot.t('field.color')),
        machine_number: Joi.string()
            .required()
            .label(req.polyglot.t('field.machine_number')),
        skeleton_number: Joi.string()
            .required()
            .label(req.polyglot.t('field.skeleton_number')),
    })

    return joiResponse(schema.validate(req.body, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const fileOld = (req) => {
    const extensions = extensionHelper(['png', 'jpg', 'jpeg'])

    const schema = Joi.object({
        condition: Joi.valid('new', 'old')
            .required()
            .label(req.polyglot.t('field.transaction.condition')),
        stnk: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.stnk')),
        front_side: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.front')),
        back_side: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.back')),
        left_side: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.left')),
        right_side: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.right')),
        dashboard: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.dashboard')),
        optional1: Joi.string()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.optional')),
        optional2: Joi.string()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.optional')),
        optional3: Joi.string()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.optional')),
        optional4: Joi.string()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t('field.transaction.optional')),
        fullname: Joi.string()
            .required()
            .label(req.polyglot.t('field.transaction.fullname')),
        phone: Joi.string()
            .min(11)
            .max(13)
            .pattern(/^[0-9]+$/)
            .label(req.polyglot.t('field.transaction.phone')),
        email: Joi.string()
            .email()
            .label(req.polyglot.t('field.transaction.email')),
        plate_detail: Joi.string()
            .required()
            .label(req.polyglot.t('field.plate_detail')),
        vehicle_color: Joi.string()
            .required()
            .label(req.polyglot.t('field.color')),
        machine_number: Joi.string()
            .required()
            .label(req.polyglot.t('field.machine_number')),
        skeleton_number: Joi.string()
            .required()
            .label(req.polyglot.t('field.skeleton_number')),
    })

    return joiResponse(schema.validate(req.body, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const review = (req) => {
    const schema = Joi.object({
        transaction_id: Joi.number()
            .required()
            .label(req.polyglot.t('field.transaction.id')),
    })

    return joiResponse(schema.validate(req.query, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const account = (req) => {
    const schema = Joi.object({
        fullname: Joi.string()
            .label(req.polyglot.t('field.fullname')),
        email: Joi.string()
            .min(6)
            .email()
            .label(req.polyglot.t('field.email')),
        phone: Joi.number()
            .label(req.polyglot.t('field.phone')),
    })

    return joiResponse(schema.validate(req.body, {
        allowUnknown: true,
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const getPaymentFee = (req) => {
    const schema = Joi.object({
        platform: Joi.valid('bca', 'bni', 'bri',
            'bsi', 'bjb', 'mandiri', 'permata', 'gopay', 'qris',
            'ovo', 'dana', 'shopeepay', 'linkaja')
            .required()
            .label(req.polyglot.t('field.payment.platform')),
        total: Joi.number()
            .required()
            .label(req.polyglot.t('field.total')),
    })

    return joiResponse(schema.validate(req.query, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const getPaymentDetail = (req) => {
    const schema = Joi.object({
        transaction_id: Joi.number()
            .required()
            .label(req.polyglot.t('field.transaction.id')),
    })

    return joiResponse(schema.validate(req.query, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const createPayment = (req) => {
    const schema = Joi.object({
        transaction_id: Joi.number()
            .required()
            .label(req.polyglot.t('field.transaction.id')),
        platform: Joi.valid('bca', 'bni', 'bri',
            'bsi', 'bjb', 'mandiri', 'permata', 'gopay', 'qris',
            'ovo', 'dana', 'shopeepay', 'linkaja')
            .required()
            .label(req.polyglot.t('field.payment.platform')),
    })

    return joiResponse(schema.validate(req.body, {
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const midtrans = (req) => {
    const schema = Joi.object({
        transaction_id: Joi.string()
            .required()
            .label(req.polyglot.t('field.transaction.id')),
        transaction_status: Joi.string()
            .required()
            .label(req.polyglot.t('field.transaction.status')),
    })

    return joiResponse(schema.validate(req.body, {
        allowUnknown: true,
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

const xendit = (req) => {
    const schema = Joi.object({
        data: Joi.object().keys({
            id: Joi.string()
                .required()
                .label(req.polyglot.t('field.transaction.id')),
            status: Joi.string()
                .required()
                .label(req.polyglot.t('field.transaction.status')),
        }),
    })

    return joiResponse(schema.validate(req.body, {
        allowUnknown: true,
        abortEarly: false,
        messages: joiErrorMessages(),
        errors: {
            language: req.locale.language
        }
    }))
}

module.exports = {
    post, fileNew, fileOld, review, account, getPaymentFee,
    getPaymentDetail, createPayment, midtrans, xendit
}
