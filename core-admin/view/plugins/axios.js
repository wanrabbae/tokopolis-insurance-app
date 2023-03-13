import Vue from 'vue'

export default async function (ctx) {
    // run nuxtClientInit in nuxt store when ssr mode is false
    await ctx.store.dispatch('nuxtClientInit', ctx)

    ctx.$axios.onError(async (error) => {
        Vue.notify({
            group: 'notif',
            type: 'error vue-notif-custom',
            title: 'Error',
            text: error.response?.data?.message || 'Terjadi Kesalahan',
        })

        switch (error.response.status) {
            case 401:
                ctx.$logoutAccount()
                break
        }

        return new Promise(() => { })
    })
}