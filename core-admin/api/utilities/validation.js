const { en_US_strings } = require('../i18n/en_US')
const { id_ID_strings } = require('../i18n/id_ID')

function joiResponse(joi, value)
{
    var error = joi.error != null
    var details = []

    if (error) {
        joi.error.details.forEach(element => {
            details.push({
                message: element.message.replace(/[^a-z0-9_\s]/gi, ''),
                key: element.context.key,
                value: element.context.value
            })
        })
    }

    return {
        error: error,
        details: details
    }
}

function joiErrorMessages()
{
    return {
        en: en_US_strings.validation,
        id: id_ID_strings.validation,
    }
}

module.exports = {
    joiResponse, joiErrorMessages
}