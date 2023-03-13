import AccountService from "../../services/AccountService"

const validation = require("../../validation/user.validation")


const service = new AccountService()

exports.create = async (req, res) => {
    // const validate = validation.create(req)
    // if (validate.error) return res.errorValidation(validate.details)

    const account = await service.createUser({
        dealer_id: req.body.dealer_id,
        role_id: req.body.role_id,
    })

    return res.jsonData(account)
}

exports.all = async (req, res, next) => {
    const data = await service.getUserAll()

    return res.jsonData(data)
}

exports.list = async (req, res, next) => {
    const query = req.query.query || ''

    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const count = await service.getUserCountByQuery(query)
    const list = await service.getUserAllWithFilter(query, limit, offset)

    return res.jsonData({
        pagination: {
            total: count,
            per_page: limit,
            current_page: current,
            last_page: Math.ceil(count / limit),
        },
        list: list,
    })
}

exports.user = async (req, res) => {
    const User = await service.getUser(req.params.id)

    return res.jsonData(User)
}

exports.update = async (req, res) => {
    // const validate = validation.update(req)
    // if (validate.error) return res.errorValidation(validate.details)

    const User = await service.getUser(req.params.id)
    if (User == null) return res.errorBadRequest(req.polyglot.t("error.auth"))

    await service.updateUser(User.id, req.body)

    return res.jsonSuccess(req.polyglot.t("success.default"))
}

exports.destroy = async (req, res, next) => {
    await service.deleteUser(req.params.id)

    return res.jsonSuccess(req.polyglot.t("success.default"))
}