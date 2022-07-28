<template>
    
    <div>
        
        <h2>Buat Password Baru</h2>
        
        <b-alert :show="showAlertError" variant="danger" class="mb-3">

            <b-list-group class="alert text-white">
                
                <b-list-group-item v-for="notification in notifications" :key="notification.message" class="list-item-alert-danger">• {{notification.message}}</b-list-group-item>
            
            </b-list-group>
        
        </b-alert>

        <b-form v-show="showForm" method="post" @submit.prevent="resetPassword">
            
            <BaseInput
                v-model="password"
                type="password"
                name="Password Baru"
                placeholder="Password Baru"
                :rules="{required: true, min: 8}"
            />

            <BaseInput
                v-model="password_confirmation"
                type="password"
                name="Konfirmasi Password Baru"
                placeholder="Konfirmasi Password Baru"
                :rules="{required: true, min: 8}"
            />

            <BaseButton native-type="submit" block>
                Reset Password
            </BaseButton>

        </b-form>

        <BaseButton v-show="showButton" tag="a" href="/lupa-password" block>
            Kembali
        </BaseButton>

    </div>

</template>

<script>
import BaseInput from '../../components/Inputs/BaseInput'

export default {
    components: { 
        BaseInput 
    },
    layout: 'auth',
    middleware:'guest',
    data () {
        return {
            password: '',
            password_confirmation:'',
            showAlertError:false,
            showForm:false,
            showButton:false,
            notifications:[],
            token:''
            
        }
    },
    head() {
            return {
                title: 'Reset Password - Pico Insurtech',
                meta: [
                    {
                        hid: 'description',
                        name: 'description',
                        content: 'Deskripsi Halaman'
                    }
                ]
            };
        },
    mounted() {
        this.checkToken()

    },

    methods: {
        async checkToken() {
            try {
                await this.$axios.get(`api/forget-password/${this.$nuxt.$route.params.id}`)
                .then(response => {
                    if(response.status === 200){
                        this.token = this.$nuxt.$route.params.id
                        this.showForm=true
                        this.showButton=false
                        
                    }
                })
            } catch(e) {
                if (e.response.data.message == null) {
                    this.notifications = e.response.data.data
                }
                else {
                    this.notifications=[]
                    this.notifications.push({
                    message: e.response.data.message
                    })
                }

                this.showForm=false
                this.showButton=true
                this.showAlertError = true
            }
        },
        async resetPassword() {
            try {
                await this.$axios.post('api/change-forget', {
                    token:this.token,
                    password: this.password,
                    password_confirmation: this.password_confirmation,
                }).then((response) => {
                    this.showAlertError = false
                    this.$router.push('/login');
                })
            } catch (e) {
                if (e.response.data.message == null){
                this.notifications = e.response.data.data
                }
                else {
                    this.notifications=[]
                    this.notifications.push({
                        message: e.response.data.message
                    })
                }
                
                this.showAlertError = true
            }
        }
    }
}
</script>
