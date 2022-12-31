const Joi = require("joi");

const { joiResponse, joiErrorMessages } = require("../utilities/validation");
const { extensionHelper } = require("../utilities/functions");

const claimProduct = (req) => {
    const extensions = extensionHelper(["png", "jpg", "jpeg"]);
    const schema = Joi.object({
        transaction_id: Joi.string()
            .required()
            .label(req.polyglot.t("field.claim.transaction.id")),
        reporter_fullname: Joi.string()
            .required()
            .label(req.polyglot.t("field.claim.fullname")),
        holder_fullname: Joi.string()
            .required()
            .label(req.polyglot.t("field.claim.fullname")),
        plate_number: Joi.string()
            .required()
            .label(req.polyglot.t("field.claim.plate_number")),
        incident_time: Joi.date()
            .required()
            .label(req.polyglot.t("field.claim.incident_time")),
        location: Joi.string()
            .required()
            .label(req.polyglot.t("field.claim.location")),
        chronology: Joi.string()
            .required()
            .label(req.polyglot.t("field.claim.chronology")),
        identity_card: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t("field.claim.identity")),
        stnk: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t("field.claim.stnk")),
        sim: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t("field.claim.sim")),
        document_optional: Joi.string()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t("field.claim.document_optional")),
        damage1: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t("field.claim.damage1")),
        damage2: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t("field.claim.damage2")),
        damage3: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t("field.claim.damage3")),
        damage4: Joi.string()
            .required()
            .regex(RegExp(extensions.regex))
            .label(req.polyglot.t("field.claim.damage4")),
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

const updateStaging = (req) => {
    const schema = Joi.object({
        status: Joi.valid(
            "surveyed",
            "accepted",
            "declined",
            "fixed",
            "ready",
            "done"
        ).label(req.polyglot.t("field.claim.status")),
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
    claimProduct,
    updateStaging,
};
