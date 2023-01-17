import Vue from 'vue'

export default function (ctx) {
    // dijalankan sebelum axios request
    if (ctx.store.state.token !== '') {
        ctx.$axios.setToken(`Bearer ${ctx.store.state.token}`)
    }

    ctx.$axios.onError((error) => {
        Vue.notify({
            group: 'error',
            type: 'error vue-notif-custom',
            title: 'Error',
            text: error.response?.data?.message || 'Terjadi Kesalahan',
        })

        switch (error.response.status) {
            case 401:
                ctx.$logoutClient()
                break
        }
    })
}
