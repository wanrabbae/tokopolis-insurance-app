const Joi = require("joi");

const { joiResponse, joiErrorMessages } = require("../utilities/validation");
const { extensionHelper } = require("../utilities/functions");

const calculate = (req) => {
    const schema = Joi.object({
        year: Joi.string()
            .min(4)
            .required()
            .label(req.polyglot.t("field.year")),
        brand: Joi.string().required().label(req.polyglot.t("field.brand")),
        model: Joi.string().required().label(req.polyglot.t("field.model")),
        sub_model: Joi.string()
            .required()
            .label(req.polyglot.t("field.sub_model")),
        price: Joi.number().required().label(req.polyglot.t("field.price")),
        plate: Joi.string().required().label(req.polyglot.t("field.plate")),
        protection: Joi.valid("comprehensive", "tlo")
            .required()
            .label(req.polyglot.t("field.protection")),
        use: Joi.valid("private", "commercial")
            .required()
            .label(req.polyglot.t("field.use")),
        acc: Joi.array().label(req.polyglot.t("field.accessories")),
        start_date: Joi.date()
            .required()
            .label(req.polyglot.t("field.start_date")),
    });

    return joiResponse(
        schema.validate(req.query, {
            allowUnknown: true,
            abortEarly: false,
            messages: joiErrorMessages(),
            errors: {
                language: req.locale.language,
            },
        })
    );
};

const create = (req) => {
    const imageExt = extensionHelper(["png", "jpg", "jpeg"]);
    const pdfExt = extensionHelper(["pdf"]);

    const schema = Joi.object({
        name: Joi.string().required().label(req.polyglot.t("field.name")),
        type: Joi.valid("comprehensive", "tlo")
            .required()
            .label(req.polyglot.t("field.protection")),
        description: Joi.string()
            .required()
            .label(req.polyglot.t("field.description")),
        image: Joi.string()
            .required()
            .regex(RegExp(imageExt.regex))
            .label(req.polyglot.t("field.image")),
            email: Joi.array().items(Joi.string().min(6).required().email())
            .required()
            .label(req.polyglot.t("field.email")),
        commission: Joi.number().label(
            req.polyglot.t("field.product.commission")
        ),
        extra_point: Joi.number().label(
            req.polyglot.t("field.product.extra_point")
        ),
        admin_fee: Joi.number().label(
            req.polyglot.t("field.product.admin_fee")
        ),
        stamp_fee: Joi.number().label(
            req.polyglot.t("field.product.stamp_fee")
        ),
        vehicle_max_year: Joi.number().label(
            req.polyglot.t("field.product.vehicle_max_year")
        ),
        supported_brands: Joi.string().label(req.polyglot.t("field.product.supported_brands")),
        tnc: Joi.string().required().label(req.polyglot.t("field.product.tnc")),
        claim: Joi.string()
            .required()
            .label(req.polyglot.t("field.product.claim")),
        company: Joi.string()
            .required()
            .label(req.polyglot.t("field.product.company")),
        brochure_file: Joi.string()
            .regex(RegExp(pdfExt.regex))
            .label(req.polyglot.t("field.product.brochure")),
        workshop_file: Joi.string()
            .regex(RegExp(pdfExt.regex))
            .label(req.polyglot.t("field.product.workshop")),
        workshop_count: Joi.number().label(
            req.polyglot.t("field.product.workshop_count")
        ),
        extra_point: Joi.number().label(
            req.polyglot.t("field.product.extra_point")
        ),
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
    const imageExt = extensionHelper(["png", "jpg", "jpeg"]);
    const pdfExt = extensionHelper(["pdf"]);

    const schema = Joi.object({
        name: Joi.string().required().label(req.polyglot.t("field.name")),
        type: Joi.valid("comprehensive", "tlo")
            .required()
            .label(req.polyglot.t("field.protection")),
        description: Joi.string()
            .required()
            .label(req.polyglot.t("field.description")),
        image: Joi.string()
            .regex(RegExp(imageExt.regex))
            .label(req.polyglot.t("field.image")),
        email: Joi.array().items(Joi.string().min(6).required().email())
            .required()
            .label(req.polyglot.t("field.email")),
        commission: Joi.number().label(
            req.polyglot.t("field.product.commission")
        ),
        extra_point: Joi.number().label(
            req.polyglot.t("field.product.extra_point")
        ),
        admin_fee: Joi.number().label(
            req.polyglot.t("field.product.admin_fee")
        ),
        stamp_fee: Joi.number().label(
            req.polyglot.t("field.product.stamp_fee")
        ),
        vehicle_max_year: Joi.number().label(
            req.polyglot.t("field.product.vehicle_max_year")
        ),
        supported_brands: Joi.string().label(req.polyglot.t("field.product.supported_brands")),
        tnc: Joi.string().required().label(req.polyglot.t("field.product.tnc")),
        claim: Joi.string()
            .required()
            .label(req.polyglot.t("field.product.claim")),
        company: Joi.string()
            .required()
            .label(req.polyglot.t("field.product.company")),
        brochure_file: Joi.string()
            .regex(RegExp(pdfExt.regex))
            .label(req.polyglot.t("field.product.brochure")),
        workshop_file: Joi.string()
            .regex(RegExp(pdfExt.regex))
            .label(req.polyglot.t("field.product.workshop")),
        workshop_count: Joi.number().label(
            req.polyglot.t("field.product.workshop_count")
        ),
        extra_point: Joi.number().label(
            req.polyglot.t("field.product.extra_point")
        ),
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

const createFeature = (req) => {
    const schema = Joi.object({
        product_id: Joi.number()
            .required()
            .label(req.polyglot.t("field.product.id")),
        name: Joi.string().required().label(req.polyglot.t("field.name")),
        type: Joi.valid(
            "era",
            "ambulance",
            "call_center",
            "tow",
            "replace_vehicle",
            "taxi_fare",
            "nfo",
            "repair_warranty",
            "mobile_app",
            "to_workshop",
            "other"
        )
            .required()
            .label(req.polyglot.t("field.type")),
        short_description: Joi.string()
            .allow(null)
            .label(req.polyglot.t("field.short_description")),
        description: Joi.string()
            .required()
            .label(req.polyglot.t("field.description")),
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

const updateFeature = (req) => {
    const schema = Joi.object({
        name: Joi.string().required().label(req.polyglot.t("field.name")),
        type: Joi.valid(
            "era",
            "ambulance",
            "call_center",
            "tow",
            "replace_vehicle",
            "taxi_fare",
            "nfo",
            "repair_warranty",
            "mobile_app",
            "to_workshop",
            "other"
        )
            .required()
            .label(req.polyglot.t("field.type")),
        short_description: Joi.string()
            .allow(null)
            .label(req.polyglot.t("field.short_description")),
        description: Joi.string()
            .required()
            .label(req.polyglot.t("field.description")),
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

const createExpansion = (req) => {
    const schema = Joi.object({
        product_id: Joi.number()
            .required()
            .label(req.polyglot.t("field.product.id")),
        label: Joi.string().required().label(req.polyglot.t("field.label")),
        rate: Joi.number().required().label(req.polyglot.t("field.rate")),
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

const updateExpansion = (req) => {
    const schema = Joi.object({
        label: Joi.string().required().label(req.polyglot.t("field.label")),
        rate: Joi.number().required().label(req.polyglot.t("field.rate")),
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

const detail = (req) => {
    const schema = Joi.object({
        id: Joi.number().required().label(req.polyglot.t("field.product.id")),
    });

    return joiResponse(
        schema.validate(req.query, {
            abortEarly: false,
            messages: joiErrorMessages(),
            errors: {
                language: req.locale.language,
            },
        })
    );
};

const compare = (req) => {
    const schema = Joi.object({
        product1: Joi.number()
            .required()
            .label(req.polyglot.t("field.product.id")),
        product2: Joi.number()
            .required()
            .label(req.polyglot.t("field.product.id")),
        product3: Joi.number().label(req.polyglot.t("field.product.id")),
    });

    return joiResponse(
        schema.validate(req.query, {
            allowUnknown: true,
            abortEarly: false,
            messages: joiErrorMessages(),
            errors: {
                language: req.locale.language,
            },
        })
    );
};

const expand = (req) => {
    const schema = Joi.object({
        id: Joi.number().required().label(req.polyglot.t("field.product.id")),
    });

    return joiResponse(
        schema.validate(req.query, {
            abortEarly: false,
            messages: joiErrorMessages(),
            errors: {
                language: req.locale.language,
            },
        })
    );
};

module.exports = {
    calculate,
    create,
    update,
    createFeature,
    updateFeature,
    createExpansion,
    updateExpansion,
    detail,
    compare,
    expand,
};
