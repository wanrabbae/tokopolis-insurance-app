const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

import AccountService from '../services/AccountService'

const validation = require('../validation/auth.validation')
const { randomString } = require('../utilities/functions')

import role from '../../../constants/roles'

const service = new AccountService()

exports.register = async (req, res) => {
    const validate = validation.register(req)
    if (validate.error) return res.errorValidation(validate.details)

    const emailExist = await service.getAccountFromEmail(req.body.email)
    if (emailExist != null) return res.errorBadRequest(req.polyglot.t('error.email.exist'))

    const account = await service.createAccount(req.body)
    const confirmToken = await service.createEmailToken(account.id, randomString(40))

    service.sendEmailRegister({
        host: process.env.REDIRECT_CLIENT || req.fullhost,
        target: account.email,
        title: req.polyglot.t('mail.register'),
        data: {
            name: account.firstname,
            token: btoa(confirmToken.token)
        }
    })

    const token = service.getAuthToken(account.id, account.email,
        account.fullname, account.role_id)

    return res.jsonData({
        account: {
            fullname: account.fullname,
            email: account.email
        },
        token: token
    })
}

exports.login = async (req, res) => {
    const validate = validation.login(req)
    if (validate.error) return res.errorValidation(validate.details)

    const account = await service.getAccountDataFromEmail(req.body.email)
    if (!account || account.role_id == role.ROLE_ADMIN) return res.errorBadRequest(req.polyglot.t('error.auth'))

    const validPass = await bcrypt.compare(req.body.password, account.password)
    if (!validPass) return res.errorBadRequest(req.polyglot.t('error.password'))

    service.sendEmailLogin({
        host: process.env.REDIRECT_CLIENT || req.fullhost,
        target: account.email,
        title: req.polyglot.t('mail.login'),
        data: {
            name: account.firstname,
            os: req.useragent.os,
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        }
    })

    const token = service.getAuthToken(account.id, account.email,
        account.fullname, account.role_id, account.profile?.photo)

    return res.header('Authorization', `Bearer ${token}`).jsonData({
        'token': token
    })
}

exports.forgetPassword = async (req, res) => {
    const validate = validation.forget(req)
    if (validate.error) return res.errorValidation(validate.details)

    const account = await service.getAccountFromEmail(req.body.email)
    if (account == null) return res.errorBadRequest(req.polyglot.t('error.auth'))

    const token = randomString(40)
    await service.createResetToken(account.id, token)

    service.sendEmailReset({
        host: process.env.REDIRECT_CLIENT || req.fullhost,
        target: account.email,
        title: req.polyglot.t('mail.forget_password'),
        data: {
            name: account.firstname,
            token: token,
        }
    })

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.validateForgetToken = async (req, res) => {
    const resetData = await service.checkResetToken(req.params.token)
    if (resetData == null) return res.errorBadRequest(req.polyglot.t('error.token'))

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.changeForgetPassword = async (req, res) => {
    const validate = validation.changeForget(req)
    if (validate.error) return res.errorValidation(validate.details)

    const resetData = await service.checkResetToken(req.body.token)
    if (resetData == null) return res.errorBadRequest(req.polyglot.t('error.token'))

    await service.resetPassword(resetData.account_id, req.body.password)
    resetData.destroy()

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.confirmEmail = async (req, res) => {
    if (req.params.token === undefined && req.params.token === null) return res.errorBadRequest(req.polyglot.t('error.token'))

    const confirmData = await service.checkEmailToken(req.params.token);
    if (confirmData == null) return res.errorBadRequest(req.polyglot.t('error.token'))

    await service.confirmEmail(confirmData.account_id)
    confirmData.destroy()

    return res.jsonSuccess(req.polyglot.t('success.default'))
}