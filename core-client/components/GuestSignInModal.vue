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
        <h4 class="mb-3">Masukkan Data Diri untuk Melanjutkan</h4>
      </div>
    
      <b-form role="form" method="post" @submit.prevent="submitHandler">
          
          <BaseInput
              v-model="formData.fullName"
              name="Nama Lengkap"
              :rules="{required: true}"
              placeholder="Nama Lengkap"
              input-classes="form-control"
          />

          <BaseInput
              v-model="formData.phoneNumber"
              type="number"
              name="Nomor Telepon"
              placeholder="Nomor Telepon"
              :rules="{ required: true }"
              input-classes="form-control custom-number"
              onkeypress="if(this.value.length==14) return false;"
          />

          <BaseInput
              v-model="formData.email"
              name="Email"
              :rules="{required: true, email: true}"
              placeholder="Email"
              input-classes="form-control"
          />

          <BaseButton
            type="primary"
            native-type="submit"
            block
            :disabled="!validateForm"
            
          >
            Selesai
        </BaseButton>

      </b-form>

    </b-modal>

</template>

<script>
import BaseInput from './Inputs/BaseInput'
import BaseButton from './BaseButton'

export default {
  components: { BaseInput, BaseButton },
  data () {
    return {
      formData: {
        fullName: '',
        phoneNumber: '',
        email: ''
      },
    }
  },
  computed:{  
    validateForm(){
            const required = [
                this.formData.fullName,
                this.formData.phoneNumber,
                this.formData.email]

            for(let i = 0; i < 3; i++){
                if (required[i] === null || required[i] === ''){
                    return false
                }
            }
            return true
        }
  },
  methods: {
    submitHandler(evt) {
      this.$emit('submit', evt, this.formData)
    },
  
  }
}
</script>
