export default function ({ $axios, $auth, redirect, store }) {
    // dijalankan oleh sebelum axios request
    if (store.state.token != '')
        $axios.setToken(`Bearer ${store.state.token}`)
}