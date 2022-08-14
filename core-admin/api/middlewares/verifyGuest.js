const jwt = require('jsonwebtoken')

module.exports = verify

function verify() {
    return [
        async (req, res, next) => {
            try {
                const header = req.header('Authorization')
                const token = header.split(' ')

                const verified = jwt.verify(token[1], process.env.TOKEN_SECRET)
                req.account = verified
            } catch (err) {}

            return next()
        }
    ]
}