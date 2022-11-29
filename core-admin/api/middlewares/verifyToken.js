const jwt = require('jsonwebtoken')

module.exports = verify


function verify(roles = []) {
    return [
        async (req, res, next) => {
            const header = req.header('Authorization')
            if (!header) {
                return res.errorUnauthorized(req.polyglot.t('error.token.null'))
            }
            try {
                const token = header.split(' ')
                const verified = jwt.verify(token[1], process.env.TOKEN_SECRET)
                req.account = verified

                return next()
            } catch (err) {
                return res.errorUnauthorized(req.polyglot.t('error.token'))
            }
        }
    ]
}

