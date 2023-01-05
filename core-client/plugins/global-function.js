import cookie from 'js-cookie'

// Inject global method in Vue
export default ({ app }, inject) => {
    inject('logoutClient', async () => {
        await cookie.remove('token')
        await cookie.remove('photo')

        await app.store.commit('setData', { token: null, photo: null })

        app.router.push('/login')
    })
}
