<template>

    <div>

        <h2>Daftar Akun</h2>
        
        <b-alert :show="showAlert" variant="danger" class="alert mb-3">

            <b-list-group class="alert danger">

                <b-list-group-item v-for="error in errors" :key="error.message" class="list-item-alert-danger">• {{error.message}}</b-list-group-item>
            
            </b-list-group>
        
        </b-alert>

        <b-form role="form" method="post" @submit.prevent="register">

            <BaseInput
                v-model="fullname"
                name="Nama Lengkap"
                placeholder="Nama Lengkap"
                :rules="{required: true, fullname: true}"
            />

            <BaseInput
                v-model="email"
                name="Email"
                placeholder="Email"
                :rules="{required: true, email: true}"
            />

            <BaseInput
                v-model="phone"
                type="number"
                name="Nomor Telepon"
                placeholder="Nomor Telepon"
                :rules="{required: true, phone: true}"
            />

            <BaseInput
                v-model="password"
                type="password"
                name="Kata Sandi"
                placeholder="Kata Sandi"
                :rules="{required: true, min: 8}"
            />

            <BaseInput
                v-model="confirm_password"
                type="password"
                name="Konfirmasi Kata Sandi"
                placeholder="Konfirmasi Kata Sandi"
                :rules="{required: true, min: 8}"
            />

            <b-form-checkbox v-model="eula" class="mb-3">
                Saya setuju dengan <a href='#'>Kebijakan Pengguna</a>
            </b-form-checkbox>

            <BaseButton native-type="submit" class="mb-3" :disabled='!eula' block>
                Daftar
            </BaseButton>

            <div class="text-center">
                Sudah Memiliki Akun? <a href="/login">Masuk</a>   
            </div>

        </b-form>

    </div>

</template>

<script>
import cookie from 'js-cookie'
import BaseInput from '../components/Inputs/BaseInput'
import BaseButton from '../components/BaseButton'

export default {
    components: { BaseInput, BaseButton },
    layout: 'auth',
    middleware:'guest',
    data () {
        return {
            fullname: '',
            email: '',
            phone: '',
            password: '',
            confirm_password: '',
            showAlert:false,
            eula:false,
            errors: []
        }
    },
    head() {
        return {
            title: 'Register - Pico Insurtech',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Deskripsi Halaman'
                }
            ]
        };
    },
    computed : {
        isDisabled(){
            return !this.eula;
        }
    },
    methods: {
        async register() {
            try {
                await this.$axios.post('api/register', {
                    fullname: this.fullname,
                    email: this.email,
                    phone : this.phone,
                    password: this.password,
                    password_confirmation : this.confirm_password
                }).then((response) => {
                    if (response.status === 200 && response.data.data.token!=null) {
                        const accessToken = response.data.data.token
                        const expired = 1
                        cookie.set('token', accessToken, { expires: expired })
                        this.$store.commit('setToken',accessToken)
                        this.$router.go('/');
                        
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

