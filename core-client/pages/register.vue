<template>

    <div>

        <h2>Daftar Akun</h2>

        <b-alert :show="showAlert" variant="danger" class="alert mb-3">

            <b-list-group class="alert text-white">

                <b-list-group-item v-for="error in errors" :key="error.message" class="list-item-alert-danger">• {{error.message}}</b-list-group-item>

            </b-list-group>

        </b-alert>

        <validation-observer v-slot="{ handleSubmit, invalid }">

            <b-form role="form" method="post" @submit.prevent="handleSubmit(register)">

                <BaseInput
                    v-if="model.policy_number"
                    v-model="model.policy_number"
                    name="Nomor Polis"
                    placeholder="Nomor Polis"
                    readonly
                />

                <BaseInput
                    v-model="model.fullname"
                    name="Nama Lengkap"
                    placeholder="Nama Lengkap"
                    rules="required"
                />

                <BaseInput
                    v-model="model.email"
                    name="Email"
                    placeholder="Email"
                    rules="required|email"
                />

                <BaseInput
                    v-model="model.phone"
                    type="number"
                    name="Nomor Telepon"
                    placeholder="Nomor Telepon"
                    rules="required"
                    prefix-text="+62"
                />

                <BaseInput
                    v-model="model.password"
                    type="password"
                    name="Kata Sandi"
                    placeholder="Kata Sandi"
                    rules="required|min:8"
                />

                <BaseInput
                    v-model="model.confirm_password"
                    type="password"
                    name="Konfirmasi Kata Sandi"
                    placeholder="Konfirmasi Kata Sandi"
                    rules="required|confirmed:Kata Sandi"
                />

                 <validation-provider
                    tag="div"
                    :rules="{ required: { allowFalse: false } }"
                    name="Kebijakan Pengguna"
                    class="custom-control custom-checkbox mb-3"
                >

                    <input
                        id="eula"
                        v-model="model.eula"
                        type="checkbox"
                        class="custom-control-input"
                    >

                    <label for="eula" class="custom-control-label">
                        Saya setuju dengan <a href='#'>Kebijakan Pengguna</a>
                    </label>

                </validation-provider>

                <BaseButton native-type="submit" class="mb-3" :disabled='invalid' block>
                    Daftar
                </BaseButton>

                <div class="text-center">
                    Sudah Memiliki Akun? <a href="/login">Masuk</a>
                </div>

            </b-form>

        </validation-observer>

    </div>

</template>

<script>
import cookie from 'js-cookie'
import BaseInput from '../components/Inputs/BaseInput'
import BaseButton from '../components/BaseButton'

export default {
    components: {
        BaseInput,
        BaseButton
    },
    layout: 'auth',
    middleware:'guest',
    data () {
        return {
            title: 'Register',
            model: {
                policy_number: null,
                fullname: null,
                email: null,
                phone: null,
                password: null,
                confirm_password: null,
                eula: false,
            },
            showAlert:false,
            errors: []
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    created() {
        if(this.$route.query.no_polis) {
            this.model.policy_number = this.$route.query.no_polis
        }
    },
    methods: {
        async register() {
            try {
                await this.$axios.post('api/register', {
                    fullname: this.model.fullname,
                    email: this.model.email,
                    phone : "+62" + this.model.phone,
                    password: this.model.password,
                    password_confirmation : this.model.confirm_password
                }).then((response) => {
                    if (response.status === 200 && response.data.data.token!=null) {
                        const accessToken = response.data.data.token
                        const expired = 1

                        cookie.set('token', accessToken, { expires: expired })
                        this.$router.go('/')
                    }
                })

            } catch (e) {
                if (e.response.data.message == null) {
                    this.errors = e.response.data.data
                }
                else {
                    this.errors=[]
                    this.errors.push({
                        message: e.response.data.message
                    })
                }

                this.showAlert=true
            }
        }

    }
}
</script>

