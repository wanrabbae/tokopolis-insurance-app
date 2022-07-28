<template>
    <div>
        <div class="account-pages my-5 pt-sm-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="text-center">
                    <router-link to="/" class="mb-5 d-block auth-logo">
                        <img
                        src="svg/logo-pico-purple.svg"
                        alt=""
                        height="60"
                        class="logo logo-dark"
                        />
                        <img
                        src="svg/logo-pico-white.svg"
                        alt=""
                        height="60"
                        class="logo logo-light"
                        />
                    </router-link>
                    </div>
                </div>
            </div>
            <div class="row align-items-center justify-content-center">
                <div class="col-md-8 col-lg-6 col-xl-5">
                    <div class="card">
                        <div class="card-body p-4">
                            <div class="text-center mt-2">
                                <h5 class="text-primary">Welcome Back !</h5>
                                <p class="text-muted">Sign in to continue to {{title}}</p>
                            </div>
                            <div class="p-2 mt-4">
                                <form @submit.prevent="doLogin">
                                    <div class="mb-3">
                                        <label for="email">Email</label>
                                        <input
                                            type="email"
                                            class="form-control"
                                            id="email"
                                            placeholder="Enter email"
                                            v-model="email"
                                        />
                                    </div>

                                    <div class="mb-3">
                                        <div class="float-end">
                                            <router-link to="#"
                                                class="text-muted">Forgot password?</router-link>
                                        </div>
                                        <label for="userpassword">Password</label>

                                        <input
                                            type="password"
                                            class="form-control"
                                            id="userpassword"
                                            placeholder="Enter password"
                                            v-model="password"
                                        />
                                    </div>

                                    <div class="form-check">
                                        <input
                                            type="checkbox"
                                            class="form-check-input"
                                            id="auth-remember-check"
                                        />
                                        <label class="form-check-label" for="auth-remember-check"
                                            >Remember me</label
                                        >
                                    </div>

                                    <div class="mt-3 text-end">
                                        <button
                                            class="btn btn-primary w-sm waves-effect waves-light"
                                            type="submit"
                                        >
                                            Log In
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div class="mt-5 text-center">
                    <p>
                        © {{ new Date().getFullYear() }} {{ title }}
                    </p>
                    </div>
                </div>
            </div>
            <!-- end row -->
        </div>
        <!-- end container -->
        </div>
    </div>
</template>

<script>
import atob from 'atob'

export default {
    layout: 'auth',
    middleware: 'guest',
    page: {
        title: 'Login Admin - Pico Insurtech',
        meta: [
            {
                name: "description",
                content: "description",
            },
        ],
    },
    mounted() {

    },
    data() {
        return {
            title: 'PIQO',
            email: '',
            password: '',
        };
    },
    methods: {
        async doLogin(e) {
            try {
				await this.$axios.post('/api/admin/login', {
					email: this.email,
					password: this.password
				}).then((response) => {
					const accessToken = response.data.data.token
					const payload = JSON.parse(atob(accessToken.split('.')[1]))

					this.$cookiz.set('token', accessToken)
					this.$store.commit('setData', { token: accessToken })

                    this.$router.go('/')
				})
            } catch (e) {

            }
        }
    }
};
</script>