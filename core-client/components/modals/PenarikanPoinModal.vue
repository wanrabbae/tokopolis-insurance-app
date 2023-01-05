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
        <h4 class="mb-3">Detail Penarikan Poin</h4>
        <hr>
      </div>

        <b-form >

            <BaseInput
              name="Nama Bank"
              label="Nama Bank"
              placeholder="Nama Bank"
              :value="fields.bank"
              readonly
            />
            <BaseInput
              name="Nomor Rekening"
              label="Nomor Rekening"
              placeholder="Nomor Rekening"
              :value="fields.accountNumber"
              readonly
            />
            <BaseInput
              name="Nama di Rekening"
              label="Nama di Rekening"
              placeholder="Nama di Rekening"
              :value="fields.accountName"
              readonly
            />
            <BaseInput
              label="Poin yang bisa ditarik"
              name="Poin yang bisa ditarik"
              placeholder="Poin yang bisa ditarik"
              :value="fields.value"
              readonly="true"
            />
            <BaseInput
              v-model="model.amount"
              label="Jumlah Penarikan"
              name="Jumlah Penarikan"
              type="number"
              placeholder="Minimal Penarikan 50 poin"
              required
            />
            <div style="font-size: 7pt" class="mb-2">
                Kami akan mengirimkan Poin anda dalam waktu 1x24 jam ke rekening yang telah didaftarkan. <br />
                Batas waktu maksimal untuk melakukan penarikan Poin adalah pukul 16:00 WIB.
            </div>

        </b-form>
        <template #modal-footer="{ ok }">

          <BaseButton :disabled="model.name ==''" block @click="ok()">Konfirmasi Penarikan</BaseButton>

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
    props: {
        fields: {
            type: Object,
            default: () => ({
                value:'0',
                bank:'',
                accountNumber: '',
                accountName: ''
            })
        }
    },
    data () {
        return {
            model: {
                amount: null
            }
        }
    },
    methods: {
        okHandler(bvModalEvt){
            bvModalEvt.preventDefault()
            this.$emit('submit', this.model)
        }
    }
}
</script>
