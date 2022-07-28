const jwt = require('jsonwebtoken')

module.exports = verify

function verify(roles = []) {
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles]
    }

    return [
        async (req, res, next) => {
            const header = req.header('Authorization')

            if (!header) {
                return res.errorUnauthorized(req.polyglot.t('error.token.null'))
            }

            const token = header.split(' ')

            try {
                const verified = jwt.verify(token[1], process.env.TOKEN_SECRET)
                req.account = verified

                if (roles.length && !roles.includes(req.account.role)) {
                    return res.errorUnauthorized(req.polyglot.t('error.token.role'))
                }

                return next()
            } catch (err) {
                return res.errorUnauthorized(req.polyglot.t('error.token'))
            }
        }
    ]
}