import AccountService from "../../services/AccountService";
import RoleService from "../../services/RoleService";

const validation = require("../../validation/user.validation");
const { randomString } = require("../../utilities/functions");

const service = new AccountService();
const roleService = new RoleService();

const generateIdRoleManagement = async (payload) => {
    const role_id = payload.role_id;
    let unique_id =
        payload.region_id.toString() +
        payload.province_id.toString() +
        payload.city_id.toString();
    let other_id;

    const findRole = await roleService.getRoleById(role_id);
    const accounts = await service.getAllAccountWithRoleId(findRole.id);

    if (findRole.name == "Operator Manager") {
        // PULUHAN
        unique_id += "-01-01";
        other_id = "01";

        if (accounts.length > 0) {
            const arrayOfOtherId = [];
            accounts.map((account) => arrayOfOtherId.push(account.other_id));

            const arrayOfNumbers = arrayOfOtherId.map(Number);
            const largest = Math.max.apply(0, arrayOfNumbers);
            other_id = (largest + 1).toString().padStart(2, "0");
        }

        unique_id += `-${other_id}`;
    } else if (findRole.name == "Branch Head") {
        // RATUSAN
        unique_id += "-01-01-01";
        other_id = "001";

        if (accounts.length > 0) {
            const arrayOfOtherId = [];
            accounts.map((account) => arrayOfOtherId.push(account.other_id));

            const arrayOfNumbers = arrayOfOtherId.map(Number);
            const largest = Math.max.apply(0, arrayOfNumbers);
            other_id = (largest + 1).toString().padStart(3, "0");
        }

        unique_id += `-${other_id}`;
    } else if (findRole.name == "Supervisor") {
        // RATUSAN
        unique_id += "-01-01-01-001";
        other_id = "001";

        if (accounts.length > 0) {
            const arrayOfOtherId = [];
            accounts.map((account) => arrayOfOtherId.push(account.other_id));

            const arrayOfNumbers = arrayOfOtherId.map(Number);
            const largest = Math.max.apply(0, arrayOfNumbers);
            other_id = (largest + 1).toString().padStart(3, "0");
        }

        unique_id += `-${other_id}`;
    } else {
        // RIBUAN
        unique_id += "-01-01-01-001-001";
        other_id = "0001";

        if (accounts.length > 0) {
            const arrayOfOtherId = [];
            accounts.map((account) => arrayOfOtherId.push(account.other_id));

            const arrayOfNumbers = arrayOfOtherId.map(Number);
            const largest = Math.max.apply(0, arrayOfNumbers);
            other_id = (largest + 1).toString().padStart(4, "0");
        }

        unique_id += `-${other_id}`;
    }

    return { unique_id, other_id };
};

exports.create = async (req, res) => {
    const validate = validation.create(req);
    if (validate.error) return res.errorValidation(validate.details);

    const emailExist = await service.getAccountFromEmail(req.body.email);
    if (emailExist != null)
        return res.errorBadRequest(req.polyglot.t("error.email.exist"));

    const account = await service.createAccountAdmin(req);

    return res.jsonData(account);
};

exports.createDealerAccount = async (req, res) => {
    // const validate = validation.create(req);
    // if (validate.error) return res.errorValidation(validate.details);

    const emailExist = await service.getAccountFromEmail(req.body.email);
    if (emailExist != null)
        return res.errorBadRequest(req.polyglot.t("error.email.exist"));

    const { unique_id, other_id } = await generateIdRoleManagement(req.body);
    req.body.unique_id = unique_id;
    req.body.other_id = other_id;

    const account = await service.createAccountDealer(req);

    return res.jsonData(account);
};

exports.list = async (req, res, next) => {
    const query = req.query.query || null;

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
            host: req.fullhost,
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
