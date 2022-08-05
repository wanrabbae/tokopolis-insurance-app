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
        password: ''
      },
    }
  },
  methods: {
    onSubmit() {
      // masukkan fungsi login di sini
    }
  }
}
</script>
