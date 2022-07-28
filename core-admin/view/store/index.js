export const state = () => ({
	token: null,
})

export const mutations = {
	setData(state, data) {
        state.token = data.token
	},
}

export const actions = {
    nuxtClientInit({ commit }, {route, app, store}) {
		const token = app.$cookiz.get('token')

		commit('setData', { token: token })
		app.$axios.setToken(token, 'Bearer')
    },
	resetData({ commit }) {
		commit('setData', { token: null })
	}
};