import AccountService from "../../services/AccountService"

const validation = require("../../validation/user.validation")
const { randomString } = require("../../utilities/functions")
const { generateDealerID } = require("../../utilities/generateId.js")

const service = new AccountService()

exports.create = async (req, res) => {
    // const validate = validation.create(req)
    // if (validate.error) return res.errorValidation(validate.details)

    const generatedID = await generateDealerID(req.body.location)

    const account = await service.createDealer({
        id: generatedID.unique_id,
        other_id: generatedID.other_id,
        name: req.body.name,
    })

    return res.jsonData(account)
}

exports.all = async (req, res, next) => {
    const data = await service.getDealerAll()

    return res.jsonData(data)
}

exports.list = async (req, res, next) => {
    const query = req.query.query || ''

    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const count = await service.getDealerCountByQuery(query)
    const list = await service.getDealerAllWithFilter(query, limit, offset)

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

exports.dealer = async (req, res) => {
    const dealer = await service.getDealer(req.params.id)

    return res.jsonData(dealer)
}

exports.update = async (req, res) => {
    // const validate = validation.update(req)
    // if (validate.error) return res.errorValidation(validate.details)

    const dealer = await service.getDealer(req.params.id)
    if (dealer == null) return res.errorBadRequest(req.polyglot.t("error.auth"))

    await service.updateDealer(dealer.id, req.body)

    return res.jsonSuccess(req.polyglot.t("success.default"))
}

exports.destroy = async (req, res, next) => {
    await service.deleteDealer(req.params.id)

    return res.jsonSuccess(req.polyglot.t("success.default"))
}