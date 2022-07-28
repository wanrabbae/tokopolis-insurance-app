const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

import Mailer from '../utilities/mail'
import AccountRepository from '../repositories/AccountRepository'

const { getMoment, uploadHandler } = require('../utilities/functions')

const nuxtFolder = process.env.NUXT_STATIC_DIR

export default class AccountService {
    constructor() {
        this.repository = new AccountRepository()
    }

    getAccount(id) {
        return this.repository.getAccount(id)
    }

    getAccountData(id) {
        return this.repository.getAccountData(id)
    }

    getAccountDataNoPass(id) {
        return this.repository.getAccountDataNoPass(id)
    }

    getAccountFromEmail(email) {
        return this.repository.getAccountFromEmail(email)
    }

    getAccountDataFromEmail(email) {
        return this.repository.getAccountDataFromEmail(email)
    }

  async createAccountAdmin(payload) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(payload.password, salt)

    payload.password = hashedPassword

    return this.repository.createAccountAdmin(payload)
  }

    async createAccount(payload) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(payload.password, salt)

        payload.password = hashedPassword

        return this.repository.createAccountAdmin(payload)
    }

    updateAccount(id, payload) {
        return this.repository.updateAccount(id, payload)
    }

    async adminUpdate(id, payload){
      const salt = await bcrypt.genSalt(10)

      if(payload.password_new){
        const hashedPassword = await bcrypt.hash(payload.password_new, salt)
        payload.password = hashedPassword
      }

      return this.repository.adminUpdate(id, payload)
    }

    async updateAccountData(account, payload, file) {
        var oldPhoto = null

        payload.account_id = account.id

        // Reset Email Verified when email changed
        if (account.email != payload.email) {
            payload.email_verified_at = null
        }

        if (file) {
            const photo = uploadHandler(file.path, 'photos')
            payload.photo = photo.clearPath
        }

        const profile = await this.repository.getProfile(account.id)

        if (profile.photo != null) {
            oldPhoto = `${nuxtFolder}/${profile.photo}`
        }

        await this.repository.updateAccount(account.id, payload)
        await profile.update(payload)

        // remove existing image
        if (file && oldPhoto != null && fs.existsSync(oldPhoto)) {
            fs.unlinkSync(oldPhoto, { recursive: true })
        }

        return payload
    }

    getAuthToken(id, email, role, photo=null) {
        return jwt.sign({
            _id: id,
            email: email,
            role: role,
            photo: photo,
        }, process.env.TOKEN_SECRET, { expiresIn: '1d' })
    }

    getIdentity(account_id) {
        return this.repository.getIdentity(account_id)
    }

  async getCountByQuery(query) {
    if (query == null) {
      return await this.repository.getCountAll()
    }

    return this.repository.getCountByQuery(query)
  }

  async getAccountAll(query, limit, offset) {
    if (query == null) {
      return await this.repository.getAccountAll(limit, offset)
    }

    return await this.repository.getAccountAllWithFilter(query, limit, offset)
  }

    createIdentity(payload, file) {
        if (file) {
            const image = uploadHandler(file.path, 'identities')
            payload.image = image.clearPath
        }

        return this.repository.createIdentity(payload)
    }

    async updateIdentity(account_id, payload, file) {
        var oldImage = null

        if (file) {
            const image = uploadHandler(file.path, 'identities')
            payload.image = image.clearPath
        }

        const identity = await this.repository.getIdentity(account_id)

        if (identity.image != null) {
            oldImage = `${nuxtFolder}/${identity.image}`
        }

        // await this.repository.updateIdentity(account_id, payload)
        await identity.update(payload)

        // remove existing image
        if (file && oldImage != null && fs.existsSync(oldImage)) {
            fs.unlinkSync(oldImage, { recursive: true })
        }

        return payload
    }

    checkResetToken(token) {
        return this.repository.checkResetToken(token)
    }

    async createResetToken(account_id, token) {
        const data = await this.repository.checkResetTokenWithId(account_id)

        if (data != null) {
            return await data.update({ token: token })
        }

        return this.repository.createResetToken(account_id, token)
    }

    async resetPassword(account_id, password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        return this.repository.resetPassword(account_id, hashedPassword)
    }

    checkEmailToken(token) {
        return this.repository.checkEmailToken(token)
    }

    async createEmailToken(account_id, token) {
        const data = await this.repository.checkEmailTokenWithId(account_id)

        if (data != null) {
            return await data.update({ token: token })
        }

        return this.repository.createEmailToken(account_id, token)
    }

  deleteAccount(id) {
    return this.repository.deleteAccount(id)
  }

    confirmEmail(account_id) {
        return this.repository.confirmEmail(account_id)
    }

    sendEmailRegister(payload) {
        let mailer = new Mailer(payload.host)
        mailer.setUrl('/confirm-email')
        mailer.setTemplate('confirm-register')
        mailer.setTarget(payload.target)
        mailer.setMail(payload.title, {
            name: payload.data.name,
            token: payload.data.token,
        })
        mailer.send()
    }

    sendEmailLogin(payload) {
        const now = getMoment().format('D MMMM YYYY h:mm:ss')

        let mailer = new Mailer(payload.host)
        // mailer.setUrl('/path')
        mailer.setTemplate('login-detected')
        mailer.setTarget(payload.target)
        mailer.setMail(payload.title, {
            name: payload.data.name,
            os: payload.data.os,
            ip: payload.data.ip,
            date: now
        })
        mailer.send()
    }

    sendEmailReset(payload) {
        let mailer = new Mailer(payload.host)
        mailer.setUrl('/lupa-password')
        mailer.setTemplate('forget-password')
        mailer.setTarget(payload.target)
        mailer.setMail(payload.title, {
            name: payload.data.name,
            token: payload.data.token
        })
        mailer.send()
    }

    sendEmailProfile(payload) {
        let mailer = new Mailer(payload.host)
        mailer.setUrl('/confirm-email')
        mailer.setTemplate('confirm-email')
        mailer.setTarget(payload.target)
        mailer.setMail(payload.title, {
            name: payload.data.name,
            token: payload.data.token,
        })
        mailer.send()
    }
}
