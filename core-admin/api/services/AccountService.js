const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

import Mailer from "../utilities/mail";
import AccountRepository from "../repositories/AccountRepository";

const { getMoment, uploadHandler } = require("../utilities/functions");

const nuxtFolder = process.env.NUXT_STATIC_DIR;

export default class AccountService {
    constructor() {
        this.repository = new AccountRepository();
    }

    getAccount(id) {
        return this.repository.getAccount(id);
    }

    getAccount2(id) {
        return this.repository.getAccount2(id);
    }

    getAccountData(id) {
        return this.repository.getAccountData(id);
    }

    getAccountDataNoPass(id) {
        return this.repository.getAccountDataNoPass(id);
    }

    getAccountFromEmail(email) {
        return this.repository.getAccountFromEmail(email);
    }

    getAccountDataFromEmail(email) {
        return this.repository.getAccountDataFromEmail(email);
    }

    getAccountSimple(id) {
        return this.repository.getAccountSimple(id)
    }

    getAccountPhoto(account_id) {
        return this.repository.getAccountPhoto(account_id)
    }

    getLastAccountFromPrefixID(unique_id) {
        return this.repository.getLastAccountFromPrefixID(unique_id)
    }

    async getAllAccountFromPrefixID(account_id) {
        const findAccount = await this.repository.getAccountSimple(account_id);
        return this.repository.getAllAccountFromPrefixID(findAccount.unique_id)
    }

    getAllAccountWithRoleId(role_id) {
        return this.repository.getAccountDataWithRoleId(role_id);
    }

    getAccountWithUniqueId(id) {
        return this.repository.getAccountUniqueId(id);
    }

    getCountFromEmails(emails) {
        return this.repository.getCountFromEmails(emails);
    }

    createBulkAccount(payloads) {
        return this.repository.createBulkAccount(payloads);
    }

    async createAccountAdmin(data) {
        const payload = data.body

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(payload.password, salt)

        payload.password = hashedPassword
        payload.role_id = data.account.role + 1
        payload.parent_id = data.account._id

        return this.repository.createAccountAdmin(payload)
    }

    async createAccountDealer(data) {
        const payload = data.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(payload.password, salt);

        payload.password = hashedPassword;

        return this.repository.createAccountDealer(payload);
    }

    async createAccount(payload) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(payload.password, salt);

        payload.password = hashedPassword;
        payload.role_id = 0;

        return this.repository.createAccount(payload);
    }

    updateAccount(id, payload) {
        return this.repository.updateAccount(id, payload);
    }

    async adminUpdate(id, payload) {
        const salt = await bcrypt.genSalt(10);

        if (payload.password_new) {
            const hashedPassword = await bcrypt.hash(
                payload.password_new,
                salt
            );
            payload.password = hashedPassword;
        }

        return this.repository.adminUpdate(id, payload);
    }

    async updateAccountData(account, payload, file) {
        var oldPhoto = null;

        payload.account_id = account.id;

        // Reset Email Verified when email changed
        if (account.email != payload.email) {
            payload.email_verified_at = null;
        }

        if (file) {
            const photo = uploadHandler(file.path, "photos");
            payload.photo = photo.clearPath;
        }

        const profile = await this.repository.getProfile(account.id);

        if (profile.photo != null) {
            oldPhoto = `${nuxtFolder}/${profile.photo}`;
        }
        console.log(payload);
        // for role upgrade
        if (payload.unique_id) {
            payload.role = "agent";
            payload.role_id = 5;
            payload.other_id = payload.unique_id.split("-").slice(-1).pop();
        }

        await this.repository.updateAccount(account.id, payload);
        await profile.update(payload);

        // remove existing image
        if (file && oldPhoto != null && fs.existsSync(oldPhoto)) {
            fs.unlinkSync(oldPhoto, { recursive: true });
        }

        return payload;
    }

    getAuthToken(id, email, role, photo = null) {
        return jwt.sign(
            {
                _id: id,
                email: email,
                role: role,
                photo: photo,
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" }
        );
    }

    getIdentity(account_id) {
        return this.repository.getIdentity(account_id);
    }

    async getIdentityList(query, limit, offset) {
        if (query == null) {
            return await this.repository.getIdentityList(limit, offset);
        }

        return await this.repository.getIdentityListWithFilter(
            query,
            limit,
            offset
        );
    }

    getIdentityListCount(query) {
        if (query == null) {
            return this.repository.getIdentityCountAll();
        }

        return this.repository.getIdentityCountByQuery(query);
    }

    verifyIdentity(id) {
        return this.repository.verifyIdentity(id);
    }

    async getCountByQuery(query) {
        if (query == null) {
            return await this.repository.getCountAll();
        }

        return this.repository.getCountByQuery(query);
    }

    async getAccountAll(query, limit, offset) {
        if (query == null) {
            return await this.repository.getAccountAll(limit, offset);
        }

        return await this.repository.getAccountAllWithFilter(
            query,
            limit,
            offset
        );
    }

    createIdentity(payload, file) {
        if (file) {
            const image = uploadHandler(file.path, "identities");
            payload.image = image.clearPath;
        }

        return this.repository.createIdentity(payload);
    }

    async updateIdentity(account_id, payload, file) {
        var oldImage = null;

        if (file) {
            const image = uploadHandler(file.path, "identities");
            payload.image = image.clearPath;
        }

        const identity = await this.repository.getIdentity(account_id);

        if (identity.image != null) {
            oldImage = `${nuxtFolder}/${identity.image}`;
        }

        // await this.repository.updateIdentity(account_id, payload)
        await identity.update(payload);

        // remove existing image
        if (file && oldImage != null && fs.existsSync(oldImage)) {
            fs.unlinkSync(oldImage, { recursive: true });
        }

        return payload;
    }

    getBank(account_id) {
        return this.repository.getBank(account_id);
    }

    async getBankList(query, limit, offset) {
        if (query == null) {
            return await this.repository.getBankList(limit, offset);
        }

        return await this.repository.getBankListWithFilter(
            query,
            limit,
            offset
        );
    }

    getBankListCount(query) {
        if (query == null) {
            return this.repository.getBankCountAll();
        }

        return this.repository.getBankCountByQuery(query);
    }

    createBank(payload) {
        return this.repository.createBank(payload);
    }

    updateBank(account_id, payload) {
        return this.repository.updateBank(account_id, payload);
    }

    verifyBank(id) {
        return this.repository.verifyBank(id);
    }

    checkResetToken(token) {
        return this.repository.checkResetToken(token);
    }

    async createResetToken(account_id, token) {
        const data = await this.repository.checkResetTokenWithId(account_id);

        if (data != null) {
            return await data.update({
                token: token,
                updated_at: new Date()
            });
        }

        return this.repository.createResetToken(account_id, token);
    }

    async resetPassword(account_id, password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return this.repository.resetPassword(account_id, hashedPassword);
    }

    checkEmailToken(token) {
        return this.repository.checkEmailToken(token);
    }

    async createEmailToken(account_id, token) {
        const data = await this.repository.checkEmailTokenWithId(account_id);

        if (data != null) {
            return await data.update({
                token: token,
                updated_at: new Date()
            });
        }

        return this.repository.createEmailToken(account_id, token);
    }

    deleteAccount(id) {
        return this.repository.deleteAccount(id);
    }

    confirmEmail(account_id) {
        return this.repository.confirmEmail(account_id);
    }

    getUpgradeRequestAll(leader_id, filter, limit, offset) {
        return this.repository.getUpgradeRequestAll(leader_id, filter, limit, offset)
    }

    getUpgradeRequestCount(leader_id, filter) {
        return this.repository.getUpgradeRequestCount(leader_id, filter)
    }

    getUpgradeRequestDetail(id) {
        return this.repository.getUpgradeRequestDetail(id)
    }

    getUpgradeRequestByAccount(account_id) {
        return this.repository.getUpgradeRequestByAccount(account_id)
    }

    createUpgradeRequest(payload) {
        return this.repository.createUpgradeRequest(payload)
    }

    getDealerAll() {
        return this.repository.getDealerAll()
    }

    getDealerAllWithFilter(query, limit, offset) {
        return this.repository.getDealerAllWithFilter(query, limit, offset)
    }

    getAccountDataWithDealerAndRoleId(dealer_id, role_id) {
        return this.repository.getAccountDataWithDealerAndRoleId(dealer_id, role_id);
    }

    async getDealerCountByQuery(query) {
        return this.repository.getDealerCountByQuery(query);
    }

    getDealer(id) {
        return this.repository.getDealer(id)
    }

    createDealer(payload) {
        return this.repository.createDealer(payload)
    }

    updateDealer(id, payload) {
        return this.repository.updateDealer(id, payload)
    }

    deleteDealer(id) {
        return this.repository.deleteDealer(id);
    }

    getUserAll() {
        return this.repository.getUserAll()
    }

    getUserAllWithFilter(query, limit, offset) {
        return this.repository.getUserAllWithFilter(query, limit, offset)
    }

    async getUserCountByQuery(query) {
        return this.repository.getUserCountByQuery(query);
    }

    getUser(id) {
        return this.repository.getUser(id)
    }

    createUser(payload) {
        return this.repository.createUser(payload)
    }

    updateUser(id, payload) {
        return this.repository.updateUser(id, payload)
    }

    deleteUser(id) {
        return this.repository.deleteUser(id);
    }

    sendEmailRegister(payload) {
        let mailer = new Mailer(payload.host);
        mailer.setUrl("/confirm-email");
        mailer.setType("confirm-register");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: payload.data.name,
            token: payload.data.token,
        });
        mailer.send();
    }

    sendEmailLogin(payload) {
        const now = getMoment().format("D MMMM YYYY h:mm:ss");

        let mailer = new Mailer(payload.host);
        // mailer.setUrl('/path')
        mailer.setType("login-detected");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: payload.data.name,
            os: payload.data.os,
            ip: payload.data.ip,
            date: now,
        });
        mailer.send();
    }

    sendEmailReset(payload) {
        let mailer = new Mailer(payload.host);
        mailer.setUrl("/lupa-password");
        mailer.setType("forget-password");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: payload.data.name,
            token: payload.data.token,
        });
        mailer.send();
    }

    sendEmailProfile(payload) {
        let mailer = new Mailer(payload.host);
        mailer.setUrl("/confirm-email");
        mailer.setType("confirm-email");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: payload.data.name,
            token: payload.data.token,
        });
        mailer.send();
    }

    sendEmailVerifySuperVisor(payload) {
        let mailer = new Mailer(payload.host);
        mailer.setUrl("/confirm-spv");
        mailer.setType("confirm-spv");
        mailer.setTarget(payload.target);
        mailer.setMail(payload.title, {
            name: `${payload.data.name} want to confirm that you is him supervisor`,
        });
        mailer.send();
    }
}
