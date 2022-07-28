import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
    createPersistedState({
        key: 'client',
        paths: ['product_id','selected_id','transaction_id']
    })(store)
}