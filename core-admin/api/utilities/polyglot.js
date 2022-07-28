const Polyglot = require('node-polyglot')

const { en_US_strings } = require('../i18n/en_US')
const { id_ID_strings } = require('../i18n/id_ID')

module.exports = (req, res, next) => {
    // Get the locale from express-locale
    const locale = req.locale.language

    // Start Polyglot and add it to the req
    req.polyglot = new Polyglot()

    // Decide which phrases for polyglot will be used
    switch (locale) {
        case 'en':
            req.polyglot.extend(en_US_strings.message);
            break;

        default:
            req.polyglot.extend(id_ID_strings.message);
            break;
    }

    next()
}