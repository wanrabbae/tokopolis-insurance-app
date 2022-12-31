const bcrypt = require("bcrypt");

import AccountService from "../services/AccountService";
import TransactionService from "../services/TransactionService";
import NotificationService from "../services/NotificationService";
import { generateIdRoleManagementWithUniqueId } from "../utilities/generateId.js";

const validation = require("../validation/user.validation");

const service = new AccountService();
const transactionService = new TransactionService();
const notificationService = new NotificationService();

exports.getAccountData = async (req, res) => {
    const account = await service.getAccountDataNoPass(req.account._id);

    return res.jsonData(account);
};

exports.getAccountSimple = async (req, res) => {
    const account = await service.getAccountSimple(req.account._id)

    return res.jsonData(account)
}

exports.getAccountPhoto = async (req, res) => {
    const account = await service.getAccountPhoto(req.account._id)

    return res.jsonData(account)
}

exports.updateAccountData = async (req, res) => {
    const validate = validation.update(req);
    if (validate.error) return res.errorValidation(validate.details);

    const account = await service.getAccount(req.account._id);
    if (account == null)
        return res.errorBadRequest(req.polyglot.t("error.auth"));

    if (req.body.unique_id) {
        const checkUniqueId = await service.getAccountWithUniqueId(
            req.body.unique_id
        );
        if (checkUniqueId)
            return res.errorBadRequest(
                "Code unique id already used, please verify again for upgrade"
            );
    }

    const update = await service.updateAccountData(account, req.body, req.file);

    if (account.email != req.body.email) {
        const confirmToken = await service.createEmailToken(
            account.id,
            randomString(40)
        );

        service.sendEmailProfile({
            host: req.fullhost,
            target: account.email,
            title: req.polyglot.t("mail.email"),
            data: {
                name: account.firstname,
                token: confirmToken.token,
            },
        });
    }

    if (req.file) {
        return res.jsonData({ photo: update.photo });
    }

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

exports.getIdentity = async (req, res) => {
    const identity = await service.getIdentity(req.account._id);

    return res.jsonData(identity);
};

exports.updateIdentity = async (req, res) => {
    const validate = validation.identity(req);
    if (validate.error) return res.errorValidation(validate.details);

    const account = await service.getAccount(req.account._id);
    if (account == null)
        return res.errorBadRequest(req.polyglot.t("error.auth"));

    let ktpRegex =
        /^((1[1-9])|(21)|([37][1-6])|(5[1-4])|(6[1-5])|([8-9][1-2]))[0-9]{2}[0-9]{2}(([0-6][0-9])|(7[0-1]))((0[1-9])|(1[0-2]))([0-9]{2})[0-9]{4}$/;
    let npwpRegex =
        /^[0][1-9][.]([\d]{3})[.]([\d]{3})[.][\d][-]([\d]{3})[.]([\d]{3})$/g;

    if (
        (account.role == "client" &&
            !ktpRegex.test(req.body.identity_number)) ||
        (account.role == "agent" && !npwpRegex.test(req.body.identity_number))
    ) {
        return res.errorBadRequest(req.polyglot.t("error.identity"));
    }

    const fields = {
        account_id: account.id,
        identity_number: req.body.identity_number,
        type: req.body.type,
        verified_at: null,
    };

    const identity = await service.getIdentity(account.id);

    if (identity != null) {
        await service.updateIdentity(account.id, fields, req.file);
    } else {
        await service.createIdentity(fields, req.file);
    }

    return res.jsonSuccess(req.polyglot.t("success.default"));
};

exports.getBank = async (req, res) => {
    const bank = await service.getBank(req.account._id);

    return res.jsonData(bank);
};

exports.updateBank = async (req, res) => {
    const validate = validation.bank(req);
    if (validate.error) return res.errorValidation(validate.details);

    const account = await service.getAccount(req.account._id);
    if (account == null)
        return res.errorBadRequest(req.polyglot.t("error.auth"));

    const fields = {
        account_id: account.id,
        type: req.body.type,
        account_number: req.body.account_number,
        fullname: req.body.fullname,
        verified_at: null,
    };

    const bank = await service.getBank(account.id);

    if (bank != null) {
        await service.updateBank(account.id, fields);
    } else {
        await service.createBank(fields);
    }

    return res.jsonSuccess(req.polyglot.t("success.default"));
};

exports.getTransactions = async (req, res) => {
    const transactions = await transactionService.getTransactionByAccountId(
        req.account._id
    );

    return res.jsonData(transactions);
};

exports.getUpgrade = async (req, res) => {
    const upgrade = await service.getUpgradeRequestByAccount(req.account._id)

    return res.jsonData(upgrade)
}

exports.requestUpgrade = async (req, res) => {
    const upgrade = await service.getUpgradeRequestByAccount(req.account._id);
    if (upgrade) return res.errorBadRequest("You already request upgrade")

    const leadAccount = await service.getAccountWithUniqueId(req.body.leader_id);
    if (!leadAccount || (leadAccount && leadAccount.role_id == 5))
        return res.errorNotFound("Code not valid!")

    if (req.account.role != null) return res.errorBadRequest("You already have role")

    // let data = {
    //     host: req.fullhost,
    //     target: leadAccount.email,
    //     title: "User role upgrade",
    //     data: {
    //         name: req.account.email,
    //     },
    // };

    // const sendEmail = service.sendEmailVerifySuperVisor(data);

    // const sendNotif = notificationService.sendNotification({
    //     title: "User role upgrade confirmation",
    //     message: "There's user want to upgrade his role",
    //     link: "/confirm-spv",
    //     user_id: leadAccount.id,
    //     sender_user_id: req.account._id,
    // });

    // will be delete soon
    const uniqueId = await generateIdRoleManagementWithUniqueId({
        role_id: leadAccount.role_id + 1,
        unique_id: leadAccount.unique_id.split("-")[0],
    });

    await service.createUpgradeRequest({
        leader_id: leadAccount.id,
        subordinate_id: req.account._id,
    })

    return res.jsonData({
        message:
            "Verification success, please wait until supervisor accepted",
        unique_id: uniqueId.unique_id,
    });
};