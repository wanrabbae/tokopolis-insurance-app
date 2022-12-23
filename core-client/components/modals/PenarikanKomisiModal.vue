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
        <h4 class="mb-3">Detail Penarikan Komisi</h4>
        <hr>
      </div>
      
        <b-form >
            
            <BaseInput
              v-model="model.value"
              label="Komisi yang bisa ditarik"
              name="Komisi yang bisa ditarik"
              placeholder="Komisi yang bisa ditarik"
              readonly="true"
            />
            <BaseInputPrice
              v-model="model.amount"
              label="Jumlah Penarikan"
              name="Jumlah Penarikan"
              currency="IDR"
              placeholder="Minimal Penarikan Rp50.000"
              required
            />
            <div style="font-size: 7pt" class="mb-2">
                Kami akan mengirimkan Komisi anda dalam waktu 1x24 jam ke rekening yang telah didaftarkan. <br />
                Batas waktu maksimal untuk melakukan penarikan komisi adalah pukul 16:00 WIB.
            </div>
            <BaseInput
              v-model="model.bank"
              name="Nama Bank"
              label="Nama Bank"
              placeholder="Nama Bank"
              readonly
            />
            <BaseInput
              v-model="model.rekening"
              name="Nomor Rekening"
              label="Nomor Rekening"
              placeholder="Nomor Rekening"
              readonly
            />
            <BaseInput
              v-model="model.nama_rekening"
              name="Nama di Rekening"
              label="Nama di Rekening"
              placeholder="Nama di Rekening"
              readonly
            />

        </b-form>
        <template #modal-footer="{ ok }">

          <BaseButton :disabled="model.name ==''" block @click="ok()">Konfirmasi Penarikan</BaseButton>
        
        </template>

    </b-modal>

</template>

<script>
import BaseInput from '../Inputs/BaseInput.vue'
import BaseInputPrice from '../Inputs/BaseInputPrice.vue'
import BaseButton from '../BaseButton'


export default {
  components: { 
    BaseInput,
    BaseInputPrice, 
    BaseButton
  },
  data () {
    return {
      model: {
        value:'0',
        bank:'Bank Mandiri',
        rekening: '12345678',
        nama_rekening: 'John Doe'
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
