const bcrypt = require("bcrypt")

import AccountService from "../../services/AccountService";

const validation = require("../../validation/user.validation");
const { randomString } = require("../../utilities/functions");
const { generateIdRoleManagementWithUniqueId } = require("../../utilities/generateId.js");

const service = new AccountService();

exports.create = async (req, res) => {
    const validate = validation.create(req)
    if (validate.error) return res.errorValidation(validate.details)

    const emailCount = await service.getCountFromEmails(req.body.data.map((item) => item.email))
    if (emailCount > 0) return res.errorBadRequest(req.polyglot.t("error.email.exist"))

    const roleID = {
        'manager': 2,
        'branch': 3,
        'supervisor': 4,
        'agent': 5,
    }

    const leadAccount = await service.getAccount(req.body.leader_id)
    if (leadAccount && req.body.role != leadAccount.role_id + 1)
        return res.errorBadRequest("Code not valid!")

    const salt = await bcrypt.genSalt(10)

    var uniqueId = await generateIdRoleManagementWithUniqueId({
        role_id: req.body.role,
        unique_id: leadAccount ? leadAccount.unique_id : req.body.dealer_id,
    })

    const newUniqueID = uniqueId.unique_id.split('-').slice(0, -1).join('-')

    const payloads = req.body.data.map((item) => {
        const hashedPassword = bcrypt.hashSync(item.password, salt)

        item.password = hashedPassword
        item.role_id = req.body.role
        item.parent_id = leadAccount ? leadAccount.id : null
        item.dealer_id = req.body.dealer_id

        item.unique_id = `${newUniqueID}-${uniqueId.other_id}`
        item.other_id = uniqueId.other_id

        // manual incrementing other_id
        uniqueId.other_id = (parseInt(uniqueId.other_id) + 1)
            .toString()
            .padStart(uniqueId.other_id.length, "0")

        return item
    })

    const account = await service.createBulkAccount(payloads)

    return res.jsonData(account)
}

exports.list = async (req, res, next) => {
    const query = req.query.query || '';

    const current = Number(req.query.current) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (current - 1) * limit;

    const count = await service.getCountByQuery(query);
    const list = await service.getAccountAll(query, limit, offset);

    return res.jsonData({
        pagination: {
            total: count,
            per_page: limit,
            current_page: current,
            last_page: Math.ceil(count / limit),
        },
        list: list,
    });
};

exports.account = async (req, res) => {
    const account = await service.getAccount(req.account._id);

    return res.jsonData(account);
};

exports.updateData = async (req, res) => {
    const validate = validation.update(req);
    if (validate.error) return res.errorValidation(validate.details);

    const endpoint = await service.getAccount(req.account._id);
    if (endpoint == null)
        return res.errorBadRequest(req.polyglot.t("error.auth"));

    await service.updateAccount(account.id, req.body);

    if (account.email != req.body.email) {
        const confirmToken = await service.createEmailToken(
            account.id,
            randomString(40)
        );

        service.sendEmailProfile({
            host: process.env.REDIRECT_CLIENT || req.fullhost,
            target: account.email,
            title: req.polyglot.t("mail.email"),
            data: {
                name: account.firstname,
                token: confirmToken.token,
            },
        });
    }

    return res.jsonSuccess(req.polyglot.t("success.default"));
};

exports.adminUpdate = async (req, res) => {
    const validate = validation.adminUpdate(req);
    if (validate.error) return res.errorValidation(validate.details);

    const account = await service.getAccount(req.params.id);
    if (account == null)
        return res.errorBadRequest(req.polyglot.t("error.auth"));

    await service.adminUpdate(account.id, req.body);

    return res.jsonSuccess(req.polyglot.t("success.default"));
};

exports.updatePassword = async (req, res) => {
    const validate = validation.updatePassword(req);
    if (validate.error) return res.errorValidation(validate.details);

    const account = await service.getAccount(req.account._id);

    const validPass = await bcrypt.compare(req.body.password, account.password);
    if (!validPass)
        return res.errorBadRequest(req.polyglot.t("error.password"));

    await service.resetPassword(account.id, req.body.password_new);

    return res.jsonSuccess(req.polyglot.t("success.default"));
};

exports.destroy = async (req, res, next) => {
    await service.deleteAccount(req.params.id);

    return res.jsonSuccess(req.polyglot.t("success.default"));
};

exports.upgradeList = async (req, res, next) => {
    const leader_id = req.account._id

    const filter = {
        fullname: req.query.fullname || '',
        email: req.query.email || '',
    }

    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const count = await service.getUpgradeRequestCount(leader_id, filter)
    const list = await service.getUpgradeRequestAll(leader_id, filter, limit, offset)

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

exports.verifyUpgrade = async (req, res) => {
    const upgrade = await service.getUpgradeRequestDetail(req.params.id)
    if (!upgrade) return res.errorNotFound("Upgrade request not found")

    console.log(upgrade.leader_id)

    const leadAccount = await service.getAccount(upgrade.leader_id)
    if (!leadAccount) return res.errorBadRequest("Code not valid!")

    const uniqueId = await generateIdRoleManagementWithUniqueId({
        role_id: leadAccount.role_id + 1,
        unique_id: leadAccount.unique_id,
    })

    if (req.body.status == "approve") {
        await service.updateAccount(upgrade.subordinate_id, {
            role_id: leadAccount.role_id + 1,
            unique_id: uniqueId.unique_id,
            other_id: uniqueId.other_id,
        })
    }

    upgrade.update({
        status: req.body.status == "approve" ? "approved" : "rejected",
        updated_at: new Date(),
    })

    return res.jsonSuccess("Upgrade success")
}

exports.leadersByDealerAndRole = async (req, res, next) => {
    if (req.account.role_id < req.query.role) return res.errorBadRequest("Role not valid!")

    const leaderID = [{
        'branch': 2,
        'supervisor': 3,
        'agent': 4,
    }]

    if (req.query.role < 2 && req.query.role > 4) return res.jsonData([])

    const list = await service.getAccountDataWithDealerAndRoleId(req.query.dealer_id, req.query.role)

    return res.jsonData(list)
};