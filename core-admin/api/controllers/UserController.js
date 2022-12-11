const bcrypt = require("bcrypt");

import AccountService from "../services/AccountService";
import TransactionService from "../services/TransactionService";

const validation = require("../validation/user.validation");

const service = new AccountService();
const transactionService = new TransactionService();

exports.getAccountData = async (req, res) => {
    const account = await service.getAccountDataNoPass(req.account._id);

    return res.jsonData(account);
};

exports.updateAccountData = async (req, res) => {
    const validate = validation.update(req);
    if (validate.error) return res.errorValidation(validate.details);

    const account = await service.getAccount(req.account._id);
    if (account == null)
        return res.errorBadRequest(req.polyglot.t("error.auth"));

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
        type: account.role == "client" ? "ktp" : "npwp",
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

exports.getTransactions = async (req, res) => {
    const transactions = await transactionService.getTransactionByAccountId(
        req.account._id
    );

    return res.jsonData(transactions);
};

exports.verifySupervisor = async (req, res, next) => {
    const spvAccount = await service.getAccount(req.body.id_supervisor);
    service.sendEmailVerifySuperVisor({
        host: req.fullhost,
        target: spvAccount.email,
        title: req.polyglot.t("mail.verify_spv"),
        data: {
            name: req.body.name,
            token: confirmToken.token,
        },
    });

    return res.jsonSuccess(req.polyglot.t("success.default"));
};
