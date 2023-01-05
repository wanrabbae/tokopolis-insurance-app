export default function (ctx) {
    // dijalankan sebelum axios request
    if (ctx.store.state.token !== '') {
        ctx.$axios.setToken(`Bearer ${ctx.store.state.token}`)
    }

    ctx.$axios.onError((error) => {
        console.log(error)

        switch (error.response.status) {
            case 401:
                ctx.$logoutClient()
                break
        }
    })
}
