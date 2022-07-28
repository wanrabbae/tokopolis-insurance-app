export default function ({ store, redirect }) {
    if (store.state.token == null) {
        return redirect('/login')
    }
}