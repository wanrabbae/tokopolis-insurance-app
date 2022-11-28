import e from 'express'
import RoleService from '../services/RoleService'

const roleService = new RoleService()
const jwt = require('jsonwebtoken')

module.exports = verify


function verify(roles = []) {
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'number') {
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
                const originEndpoint = String(req.baseUrl + req.path)
                const endpoint = originEndpoint.replace(/[0-9]/g, "?")
                const method = req.method
                
                const verified = jwt.verify(token[1], process.env.TOKEN_SECRET)
                req.account = verified

                if (roles.length) {
                    if (!roles.includes(req.account.role)) {
                        return res.errorUnauthorized(req.polyglot.t('error.token.role'))
                    }
                    
                    const endpoints = await roleService.getAllEndpointExist(req.account.role, endpoint, method)
                    if (endpoints.length == 0) {
                        return res.errorUnauthorized(req.polyglot.t('error.token.role'))
                    }
                }
                return next()
            } catch (err) {
                return res.errorUnauthorized(req.polyglot.t('error.token'))
            }
        }
    ]
}

