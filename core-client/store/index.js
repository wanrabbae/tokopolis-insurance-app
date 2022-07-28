import cookie from "cookie"


export const state = () => ({
	token: null,
	photo: null,
	product_id: null,
	transaction_Id : null,
	selected_id: []
})

export const mutations = {
	setData(state, data) {
		state.token = data.token
		state.photo = data.photo
	},
	setProductId(state, productId) {
		state.product_id = productId
	},
	setSelectedId(state, selectedId) {
		state.selected_id = selectedId
	},
	setTransactionId(state, transactionId) {
		state.transaction_id = transactionId
	}
}

export const actions = {
	// nuxtServerInit  dijalankan oleh Nuxt.js sebelum server-rendering setiap page
	nuxtServerInit({ commit }, {req, route, app, store}) {
		const cookies = cookie.parse(req.headers.cookie || "");
		const token = cookies.token
		const photo = cookies.photo

		commit('setData', { token, photo })
		app.$axios.setToken(token, "Bearer")
  }
};