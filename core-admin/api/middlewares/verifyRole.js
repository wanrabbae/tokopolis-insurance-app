import RoleService from '../services/RoleService'

const roleService = new RoleService()
const jwt = require('jsonwebtoken')

module.exports = verify

function verify(role = '') {
    return [
        async (req, res, next) => {
            const header = req.header('Authorization')

            if (!header) {
                return res.errorUnauthorized(req.polyglot.t('error.token.null'))
            }

            const token = header.split(' ')

            try {
                const originEndpoint = String(req.baseUrl + req.path)
                const endpoint = originEndpoint
                    .replace(/([A-Z][A-Z][A-Z]-\d+-+\d+-\d)\w+/g, "?") // Tokopolis ID (TKP, CLM)
                    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, "?") // uuid
                    .replace(/[-0-9]+/g, "?")
                const method = req.method

                const verified = jwt.verify(token[1], process.env.TOKEN_SECRET)
                req.account = verified

                if (typeof role === 'string' && role == 'auth:role') {
                    const endpoints = await roleService.getAllEndpointExist(req.account.role, endpoint, method)
                    if (endpoints.length == 0) {
                        return res.errorForbidden(req.polyglot.t('error.token.role'))
                    }
                }

                return next()
            } catch (err) {
                return res.errorUnauthorized(req.polyglot.t('error.token'))
            }
        }
    ]
}
