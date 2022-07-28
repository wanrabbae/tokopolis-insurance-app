import AccountService from '../../services/AccountService'

const validation = require('../../validation/user.validation')
const { getHost, randomString } = require('../../utilities/functions')

const service = new AccountService()

exports.create = async (req, res) => {
  const validate = validation.create(req)
  if (validate.error) return res.errorValidation(validate.details)

  const emailExist = await service.getAccountFromEmail(req.body.email)
  if (emailExist != null) return res.errorBadRequest(req.polyglot.t('error.email.exist'))

  const account = await service.createAccountAdmin(req.body)

  return res.jsonData(account)
}

exports.list = async (req, res, next) => {
  const query = req.query.query || null

  const current = Number(req.query.current) || 1
  const limit = Number(req.query.limit) || 10
  const offset = (current - 1) * limit

  const count = await service.getCountByQuery(query)
  const list = await service.getAccountAll(query, limit, offset)

  return res.jsonData({
    pagination: {
      total: count,
      per_page: limit,
      current_page: current,
      last_page: Math.ceil(count / limit),
    },
    list: list
  })
}

exports.account = async (req, res) => {
    const account = await service.getAccount(req.account._id)

    return res.jsonData(account)
}

exports.updateData = async (req, res) => {
    const validate = validation.update(req)
    if (validate.error) return res.errorValidation(validate.details)

    const endpoint = await service.getAccount(req.account._id)
    if (endpoint == null) return res.errorBadRequest(req.polyglot.t('error.auth'))

    await service.updateAccount(account.id, req.body)

    if (account.email != req.body.email) {
        const confirmToken = await service.createEmailToken(account.id,
            randomString(40))

        service.sendEmailProfile({
            host: getHost(req),
            target: account.email,
            title: req.polyglot.t('mail.email'),
            data: {
                name: account.firstname,
                token: confirmToken.token
            }
        })
    }

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.adminUpdate = async (req, res) => {
  const validate = validation.adminUpdate(req)
  if (validate.error) return res.errorValidation(validate.details)

  const account = await service.getAccount(req.params.id)
  if (account == null) return res.errorBadRequest(req.polyglot.t('error.auth'))

  await service.adminUpdate(account.id, req.body)

  return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.updatePassword = async (req, res) => {
    const validate = validation.updatePassword(req)
    if (validate.error) return res.errorValidation(validate.details)

    const account = await service.getAccount(req.account._id)

    const validPass = await bcrypt.compare(req.body.password, account.password)
    if(!validPass) return res.errorBadRequest(req.polyglot.t('error.password'))

    await service.resetPassword(account.id, req.body.password_new)

    return res.jsonSuccess(req.polyglot.t('success.default'))
}

exports.destroy = async (req, res, next) => {
  await service.deleteAccount(req.params.id)

  return res.jsonSuccess(req.polyglot.t('success.default'))
}

