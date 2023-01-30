const Joi = require("joi");

const { joiResponse, joiErrorMessages } = require("../utilities/validation");
const { extensionHelper } = require("../utilities/functions");

const create = (req) => {
    const schema = Joi.object({
        dealer_id: Joi.string()
            .required()
            .label(req.polyglot.t("field.dealer_id")),
        role: Joi.string()
            .required()
            .label(req.polyglot.t("field.role")),
        leader_id: Joi.number()
            .allow(null)
            .label(req.polyglot.t("field.leader_id")),
        data: Joi.array().items(
            Joi.object({
                fullname: Joi.string()
                    .required()
                    .label(req.polyglot.t("field.fullname")),
                email: Joi.string()
                    .required()
                    .label(req.polyglot.t("field.email")),
                password: Joi.string()
                    .required()
                    .label(req.polyglot.t("field.password")),
                })
            )
            .required()
    });

    return joiResponse(
        schema.validate(req.body, {
            abortEarly: false,
            messages: joiErrorMessages(),
            errors: {
                language: req.locale.language,
            },
        })
    );
};

const update = (req) => {
    const extensions = extensionHelper(["png", "jpg", "jpeg"]);

    const schema = Joi.object({
        fullname: Joi.string()
            .required()
            .label(req.polyglot.t("field.fullname")),
        email: Joi.string()
            .min(6)
            .email()
            .required()
            .label(req.polyglot.t("field.email")),
        photo: Joi.string()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t("field.photo")),
        gender: Joi.valid("male", "female").label(
            req.polyglot.t("field.gender")
        ),
        birth_date: Joi.date().label(req.polyglot.t("field.birth_date")),
        address: Joi.string().label(req.polyglot.t("field.address")),
        phone: Joi.number().label(req.polyglot.t("field.phone")),
        city: Joi.string().label(req.polyglot.t("field.city")),
        province: Joi.string().label(req.polyglot.t("field.province")),
        unique_id: Joi.string().label(req.polyglot.t("field.unique_id")),
    });

    return joiResponse(
        schema.validate(req.body, {
            abortEarly: false,
            messages: joiErrorMessages(),
            errors: {
                language: req.locale.language,
            },
        })
    );
};

const updateAccount = (req) => {
    const schema = Joi.object({
        fullname: Joi.string()
            .required()
            .label(req.polyglot.t("field.fullname")),
        email: Joi.string()
            .min(6)
            .email()
            .required()
            .label(req.polyglot.t("field.email")),
    });

    return joiResponse(
        schema.validate(req.body, {
            abortEarly: false,
            messages: joiErrorMessages(),
            errors: {
                language: req.locale.language,
            },
        })
    );
};

const adminUpdate = (req) => {
    const schema = Joi.object({
        fullname: Joi.string()
            .required()
            .label(req.polyglot.t("field.fullname")),
        email: Joi.string()
            .min(6)
            .email()
            .required()
            .label(req.polyglot.t("field.email")),
        password_new: Joi.string()
            .min(8)
            .label(req.polyglot.t("field.password_new")),
        password_confirmation: Joi.any()
            .valid(Joi.ref("password_new"))
            .label(req.polyglot.t("field.password_confirmation")),
        role: Joi.valid("admin", "client", "insurance", "agent")
            .required()
            .label(req.polyglot.t("field.role")),
    });

    return joiResponse(
        schema.validate(req.body, {
            abortEarly: false,
            messages: joiErrorMessages(),
            errors: {
                language: req.locale.language,
            },
        })
    );
};

const updatePassword = (req) => {
    const schema = Joi.object({
        password: Joi.string()
            .min(8)
            .required()
            .label(req.polyglot.t("field.password")),
        password_new: Joi.string()
            .min(8)
            .required()
            .label(req.polyglot.t("field.password_new")),
        password_confirmation: Joi.any()
            .valid(Joi.ref("password_new"))
            .required()
            .label(req.polyglot.t("field.password_confirmation")),
    });

    return joiResponse(
        schema.validate(req.body, {
            abortEarly: false,
            messages: joiErrorMessages(),
            errors: {
                language: req.locale.language,
            },
        })
    );
};

const identity = (req) => {
    const extensions = extensionHelper(["png", "jpg", "jpeg"]);

    const schema = Joi.object({
        type: Joi.valid("ktp", "npwp", "passport")
            .required()
            .label(req.polyglot.t("field.identity_type")),
        identity_number: Joi.string()
            .required()
            .label(req.polyglot.t("field.identity_number")),
        image: Joi.string()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t("field.image")),
    });

    return joiResponse(
        schema.validate(req.body, {
            abortEarly: false,
            messages: joiErrorMessages(),
            errors: {
                language: req.locale.language,
            },
        })
    );
};

const bank = (req) => {
    const schema = Joi.object({
        type: Joi.valid('bca', 'bni', 'bri', 'mandiri', 'btn', 'cimb')
            .required()
            .label(req.polyglot.t("field.bank_type")),
        account_number: Joi.string()
            .required()
            .label(req.polyglot.t("field.account_number")),
        fullname: Joi.string()
            .required()
            .label(req.polyglot.t("field.fullname")),
    });

    return joiResponse(
        schema.validate(req.body, {
            abortEarly: false,
            messages: joiErrorMessages(),
            errors: {
                language: req.locale.language,
            },
        })
    );
};

module.exports = {
    create,
    update,
    updateAccount,
    adminUpdate,
    updatePassword,
    identity,
    bank,
};
