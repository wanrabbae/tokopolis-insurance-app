const moment = require("moment");
const { Op } = require("sequelize");

const { Account, Profile, Identity, Bank,
    AccountToken, Role, RoleUpgrade, Dealer, User } = require("../models");

export default class AccountRepository {
    constructor() { }

    async getAccountAll(limit, offset) {
        return await Account.findAll({
            include: [{
                model: Role,
                as: "roles",
            }, {
                model: Dealer,
                as: "dealers",
            }],
            limit: limit,
            offset: offset,
        });
    }

    async getAccountAllWithFilter(query, limit, offset) {
        return await Account.findAll({
            where: {
                [Op.or]: [
                    { fullname: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                ],
            },
            include: [
                {
                    model: Role,
                    as: "roles",
                }, {
                    model: Dealer,
                    as: "dealers",
                }
            ],
            limit: limit,
            offset: offset,
        });
    }

    async getAccount(id) {
        return await Account.findByPk(id);
    }

    async getAccount2(id) {
        return await Account.findByPk(id);
    }

    async getAccountUniqueId(id) {
        return await Account.findOne({
            where: {
                unique_id: id,
            },
        });
    }

    async getAllAccountFromPrefixID(unique_id) {
        return await Account.findAll({
            where: {
                unique_id: { [Op.like]: `${unique_id}-%` },
            },
            order: [
                ['id', 'DESC']
            ],
            attributes: ["id", "role_id", "other_id", "unique_id"],
            raw: true,
            nest: true,
        });
    }

    async getAccountData(id) {
        return await Account.findByPk(id, {
            include: [
                { model: Profile, as: "profile" },
                { model: Role, as: "roles" },
            ],
        });
    }

    async getAccountDataNoPass(id) {
        return await Account.scope("withoutPass").findByPk(id, {
            include: [
                { model: Profile, as: "profile" },
                { model: Role, as: "roles" },
            ],
        });
    }

    async getAccountDataWithRoleId(role_id) {
        return await Account.findAll({
            where: {
                role_id: role_id,
            },
            attributes: ["id", "role_id", "other_id", "unique_id"],
        });
    }

    async getLastAccountFromPrefixID(unique_id) {
        return await Account.findOne({
            where: {
                unique_id: { [Op.like]: `${unique_id}-%` },
            },
            order: [
                ['id', 'DESC']
            ],
            attributes: ["id", "role_id", "other_id", "unique_id"],
        });
    }

    async getAccountDataWithDealerAndRoleId(dealer_id, role_id) {
        return await Account.findAll({
            where: {
                dealer_id: dealer_id,
                role_id: role_id,
            },
            attributes: ["id", "fullname"],
        });
    }

    async getAccountFromEmail(email) {
        return await Account.findOne({ where: { email: email } });
    }

    async getAccountDataFromEmail(email) {
        return await Account.findOne({
            where: { email: email },
            include: [{ model: Profile, as: "profile" }],
        });
    }

    async getAccountSimple(id) {
        return await Account.findByPk(id, {
            attributes: ['fullname', 'email', 'unique_id']
        });
    }

    async getAccountPhoto(account_id) {
        return await Profile.findOne({
            where: {
                account_id: account_id,
            },
            attributes: ['photo']
        });
    }

    async createBulkAccount(payloads) {
        return await Account.bulkCreate(payloads)
    }

    async createAccountDealer(payload) {
        return await Account.create({
            fullname: payload.fullname,
            email: payload.email,
            password: payload.password,
            role_id: payload.role_id,
            unique_id: payload.unique_id,
            other_id: payload.other_id,
        });
    }

    async createAccountDealer(payload) {
        return await Account.create({
            fullname: payload.fullname,
            email: payload.email,
            password: payload.password,
            role: "admin",
            role_id: payload.role_id,
            unique_id: payload.unique_id,
            other_id: payload.other_id,
        });
    }

    async createAccount(payload) {
        const account = await Account.create({
            fullname: payload.fullname,
            email: payload.email,
            password: payload.password,
            role_id: payload.role_id
        });

        await Profile.create({
            account_id: account.id,
            phone: payload.phone,
        });

        return account;
    }

    async updateAccount(id, payload) {
        return await Account.update(payload, {
            where: { id: id },
        });
    }

    async getCountFromEmails(emails) {
        return await Account.count({ where: { email: emails } })
    }

    async getCountAll() {
        return await Account.count();
    }

    async getCountByQuery(query) {
        return await Account.count({
            where: {
                [Op.or]: [
                    { fullname: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                ],
            },
        });
    }

    async adminUpdate(id, payload) {
        return await Account.update(payload, {
            where: { id: id },
        });
    }

    async getIdentity(account_id) {
        return await Identity.scope("defaultScope").findOne({
            where: { account_id: account_id },
        });
    }

    async getIdentityType(account_id, type) {
        return await Identity.scope("defaultScope").findOne({
            where: { account_id: account_id, type: type },
        });
    }

    async getIdentityList(limit, offset) {
        return await Identity.findAll({
            include: {
                model: Account,
                attributes: ['id', 'fullname', 'email']
            },
            limit: limit,
            offset: offset,
        });
    }

    async getIdentityListWithFilter(query, limit, offset) {
        return await Identity.findAll({
            where: {
                account_id: {
                    [Op.like]: `%${query.account_id || ''}%`
                }
            },
            include: {
                model: Account,
                attributes: ['id', 'fullname', 'email'],
                where: {
                    [Op.or]: [
                        { fullname: { [Op.like]: `%${query.account_name || ''}%` } },
                    ],
                },
            },
            limit: limit,
            offset: offset,
        });
    }

    async getIdentityCountAll() {
        return await Identity.count();
    }

    async getIdentityCountByQuery(query) {
        return await Identity.count({
            where: {
                account_id: {
                    [Op.like]: `%${query.account_id || ''}%`
                }
            },
            include: {
                model: Account,
                where: {
                    [Op.or]: [
                        { fullname: { [Op.like]: `%${query.account_name || ''}%` } },
                    ],
                },
            }
        });
    }

    async verifyIdentity(id, type) {
        return await Identity.update({ verified_at: new Date() }, { where: { account_id: id, type } });
    }

    async createIdentity(payload) {
        return await Identity.create(payload);
    }

    async getBank(account_id) {
        return await Bank.findOne({
            where: { account_id: account_id },
        });
    }

    async getBankList(limit, offset) {
        return await Bank.findAll({
            include: {
                model: Account,
                attributes: ['id', 'fullname', 'email']
            },
            limit: limit,
            offset: offset,
        });
    }

    async getBankListWithFilter(query, limit, offset) {
        return await Bank.findAll({
            where: {
                account_id: {
                    [Op.like]: `%${query.account_id || ''}%`
                }
            },
            include: {
                model: Account,
                attributes: ['id', 'fullname', 'email'],
                where: {
                    [Op.or]: [
                        { fullname: { [Op.like]: `%${query.account_name || ''}%` } },
                    ],
                },
            },
            limit: limit,
            offset: offset,
        });
    }

    async getBankCountAll() {
        return await Bank.count();
    }
    // asdasd
    async getBankCountByQuery(query) {
        return await Bank.count({
            where: {
                account_id: {
                    [Op.like]: `%${query.account_id || ''}%`
                }
            },
            include: {
                model: Account,
                where: {
                    [Op.or]: [
                        { fullname: { [Op.like]: `%${query.account_name || ''}%` } },
                    ],
                },
            }
        });
    }

    async createBank(payload) {
        return await Bank.create(payload);
    }

    async updateBank(account_id, payload) {
        return await Bank.update(payload, {
            where: { account_id: account_id },
        });
    }

    async verifyBank(id) {
        return await Bank.update({ verified_at: new Date() }, {
            where: { account_id: id },
        });
    }

    async getProfile(account_id) {
        return await Profile.findByPk(account_id);
    }

    async checkResetToken(token) {
        return await AccountToken.findOne({
            where: {
                token: token,
                type: "password",
                updated_at: {
                    [Op.gt]: moment().subtract(1, "hours").toDate(),
                },
            },
        });
    }

    async checkResetTokenWithId(account_id) {
        return await AccountToken.findOne({
            where: {
                account_id: account_id,
                type: "password",
            },
        });
    }

    async createResetToken(account_id, token) {
        return await AccountToken.create({
            account_id: account_id,
            token: token,
            type: "password",
        });
    }

    async resetPassword(account_id, password) {
        return await Account.update(
            {
                password: password,
            },
            { where: { id: account_id } }
        );
    }

    async checkEmailToken(token) {
        return await AccountToken.findOne({
            where: {
                token: token,
                type: "email",
            },
        });
    }

    async checkEmailTokenWithId(account_id) {
        return await AccountToken.findOne({
            where: {
                account_id: account_id,
                type: "email",
            },
        });
    }

    async createEmailToken(account_id, token) {
        return await AccountToken.create({
            account_id: account_id,
            token: token,
            type: "email",
        });
    }

    async confirmEmail(account_id) {
        return await Account.update(
            {
                email_verified_at: moment(),
            },
            { where: { id: account_id } }
        );
    }

    async deleteAccount(id) {
        return await Account.destroy({
            where: { id: id },
        });
    }

    async getUpgradeRequestAll(leader_id, filter, limit, offset) {
        return await RoleUpgrade.findAll({
            where: {
                leader_id: leader_id,
                status: "waiting",
                '$subordinate_upgrades.fullname$': { [Op.like]: `%${filter.fullname}%` },
                '$subordinate_upgrades.email$': { [Op.like]: `%${filter.email}%` },
            },
            include: [
                { model: Account, as: "subordinate_upgrades" },
            ],
            limit: limit,
            offset: offset,
        })
    }

    async getUpgradeRequestCount(leader_id, filter) {
        return await RoleUpgrade.count({
            where: {
                leader_id: leader_id,
                status: "waiting",
                '$subordinate_upgrades.fullname$': { [Op.like]: `%${filter.fullname}%` },
                '$subordinate_upgrades.email$': { [Op.like]: `%${filter.email}%` },
            },
            include: [
                { model: Account, as: "subordinate_upgrades" },
            ],
        });
    }

    async getUpgradeRequestDetail(id) {
        return await RoleUpgrade.findByPk(id)
    }

    async getUpgradeRequestByAccount(account_id) {
        return await RoleUpgrade.findOne({
            where: {
                subordinate_id: account_id,
                status: "waiting",
            }
        })
    }

    async createUpgradeRequest(payload) {
        return await RoleUpgrade.create({
            leader_id: payload.leader_id,
            subordinate_id: payload.subordinate_id,
        })
    }

    async getDealerAll() {
        return await Dealer.findAll()
    }

    async getDealerAllWithFilter(query, limit, offset) {
        return await Dealer.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                ],
            },
            limit: limit,
            offset: offset,
        })
    }

    async getDealerCountByQuery(query) {
        return await Dealer.count({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                ],
            },
        });
    }

    async getDealer(id) {
        return await Dealer.findByPk(id)
    }

    async createDealer(payload) {
        return await Dealer.create({
            id: payload.id,
            other_id: payload.other_id,
            name: payload.name,
        })
    }

    async updateDealer(id, payload) {
        return await Dealer.update(payload, {
            where: { id: id },
        });
    }

    async deleteDealer(id) {
        return await Dealer.destroy({
            where: { id: id },
        });
    }

    async getUserAll() {
        return await User.findAll({
            include: [
                {
                    model: Role,
                    as: "role"
                },
                {
                    model: Dealer,
                    as: "dealer"
                }
            ]
        })
    }

    async getUserAllWithFilter(query, limit, offset) {
        return await User.findAll({
            include: [
                {
                    model: Role,
                    as: "role"
                },
                {
                    model: Dealer,
                    as: "dealer"
                }
            ],
            limit: limit,
            offset: offset,
        })
    }

    async getUserCountByQuery(query) {
        return await User.count({
        });
    }

    async getUser(id) {
        return await User.findByPk(id, {
            include: [
                {
                    model: Role,
                    as: "role"
                },
                {
                    model: Dealer,
                    as: "dealer"
                }
            ]
        })
    }

    async createUser(payload) {
        return await User.create({
            dealer_id: payload.dealer_id,
            role_id: payload.role_id,
        })
    }

    async updateUser(id, payload) {
        return await User.update(payload, {
            where: { id: id },
        });
    }

    async deleteUser(id) {
        return await User.destroy({
            where: { id: id },
        });
    }
}
