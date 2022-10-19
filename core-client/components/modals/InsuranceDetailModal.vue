/* eslint-disable prefer-regex-literals */
/* eslint-disable no-useless-escape */
<template>
    
    <b-modal 
      v-bind="$attrs"
      hide-header
      centered
      body-class="p-4"
      @ok="okHandler"
    >
    
      <div class="text-center">
        <h4 class="mb-3">Detail Pemegang Polis</h4>
      </div>
      
        <b-form >
            
            <BaseInput
              v-model="model.name"
              name="Nama"
              placeholder="Josua Jostar"
              rules="required"
            />
            <BaseInput
              v-model="model.phone"
              name="Phone"
              placeholder="+62812345678"
            />
            <BaseInput
              v-model="model.email"
              name="Email"
              placeholder="user@gmail.com"
              rules="email"
            />

        </b-form>
        <template #modal-footer="{ ok }">

          <BaseButton :disabled="model.name ==''" block @click="ok()">Buat Penawaran</BaseButton>
        
        </template>

    </b-modal>

</template>

<script>
import BaseInput from '../Inputs/BaseInput.vue'
import BaseButton from '../BaseButton'


export default {
  components: { 
    BaseInput, 
    BaseButton
  },
  data () {
    return {
      model: {
        name:'',
        phone:null,
        email: null,
      }
    }
  },
  methods: {
    okHandler(bvModalEvt){
      bvModalEvt.preventDefault()
      this.$emit('submit',this.model)
    }
  }
}
</script>
