import Swal from "sweetalert2"

export default async function (ctx) {
    // run nuxtClientInit in nuxt store when ssr mode is false
    await ctx.store.dispatch('nuxtClientInit', ctx)

    ctx.$axios.onError(async (error) => {
        switch (error.response.status) {
            case 400:
                if (error.response.data.data != null) {
                    Swal.fire({
                        title: 'Error',
                        text: error.response.data.data[0].message,
                        icon: 'error',
                    })
                }
                else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Something Wrong!',
                        icon: 'error',
                    })
                }

                return Promise.reject(error)

            case 401:
                // ctx.$logoutAccount()
                break
        }
    })
}