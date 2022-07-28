// Inject global method in Vue, context and store
export default ({ app }, inject) => {
    inject('formCheck', (form, exclude = []) => {
        const data = {}

        for (const [key, value] of Object.entries(form)) {
            if (exclude.includes(key)) continue

            if (value == "")
                data[key] = null
            else
                data[key] = value
        }

        return data
    })

    inject('logoutAccount', async () => {
        await app.$cookiz.removeAll()
        await app.store.dispatch('resetData', app)

        app.router.go('login')
    })
}