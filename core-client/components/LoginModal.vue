/* eslint-disable prefer-regex-literals */
/* eslint-disable no-useless-escape */
<template>
    
    <b-modal 
      v-bind="$attrs"
      hide-header
      hide-footer
      centered
      body-class="p-4"
    >

      <div class="text-center">
        <h4 class="mb-3">Login</h4>
      </div>
      <b-alert :show="showAlert" variant="danger" class="alert mb-3">
            
          <b-list-group class="alert text-white">
                
              <b-list-group-item v-for="error in errors" :key="error.message" class="list-item-alert-danger">{{error.message}}</b-list-group-item>
    
          </b-list-group>
        
      </b-alert>

      <ValidationObserver v-slot="{ invalid }">
        
        <b-form role="form" method="post" @submit.prevent="doLogin">
            
            <BaseInput
              v-model="model.email"
              name="Email"
              placeholder="Email"
              rules="required|email"
            />

            <BaseInput
              v-model="model.password"
              type="password"
              name="Password"
              placeholder="Password"
              rules="required"
            />

            <a href="/lupa-password" class="d-block mb-3">
                Lupa Password?
            </a>

            <BaseButton native-type="submit" class="mb-3" :disabled="invalid" block>
                Masuk ke Akun
            </BaseButton>

            <div class="text-center">
                Belum memiliki akun? <a href="/register">Daftar Akun Baru</a>
            </div>

        </b-form>

      </ValidationObserver>

    </b-modal>

</template>

<script>
import cookie from 'js-cookie'
import { ValidationObserver } from 'vee-validate'
import BaseInput from './Inputs/BaseInput'
import BaseButton from './BaseButton'


export default {
  components: { 
    BaseInput, 
    BaseButton, 
    ValidationObserver
  },
  data () {
    return {
      model: {
        email: '',
        password: '',
        showAlert:false,
      },
      errors : []
    }
  },
  methods: {
    async doLogin() {
      // masukkan fungsi login di sini
      try{
				await this.$axios.post('/api/login', {
					email: this.model.email,
					password: this.model.password
				}).then((response) => {
					const accessToken = response.data.data.token
					const payload = JSON.parse(atob(accessToken.split('.')[1]))

					cookie.set('token', accessToken, { expires: 1 })
					cookie.set('photo', payload.photo, { expires: 1 })

					this.$store.commit('setToken',accessToken)
					this.$router.go()
				})}
            catch (e) {
                if (e.response.data.message == null){
                    this.errors = e.response.data.data
                }
                else {
                    this.errors = []
                    this.errors.push({
                        message: e.response.data.message
                    })
                }

                this.model.showAlert = true
            }
    }
  }
}
</script>
