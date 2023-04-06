/* eslint-disable prefer-regex-literals */
/* eslint-disable no-useless-escape */
<template>

    <b-modal
      v-bind="$attrs"
      ref="modal-penarikan-komisi"
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
              ref="bankCode"
              name="Nama Bank"
              label="Nama Bank"
              placeholder="Nama Bank"
              :value="fields.type"
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
              :value="fields.accountHolderName"
              readonly
            />
            <BaseInputPrice
              label="Komisi yang bisa ditarik"
              name="Komisi yang bisa ditarik"
              currency="IDR"
              placeholder="Komisi yang bisa ditarik"
              :value="fields.value"
              readonly
            />
            <BaseInput
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
    props: {
        fields: {
            type: Object,
            default: () => ({
                amount:'0',
                bankCode:'',
                accountNumber: '',
                accountHolderName: ''
            })
        }
    },
    data () {
        return {
            model: {
              bankCode: this.fields.type,
              accountHolderName: this.fields.accountHolderName,
              accountNumber: this.fields.accountNumber,
              amount: null
            }
        }
    },
    methods: {
        async okHandler(bvModalEvt){
            bvModalEvt.preventDefault()

            this.model.bankCode = this.fields.type;
            this.model.accountHolderName = this.fields.accountHolderName;
            this.model.accountNumber = this.fields.accountNumber;
            
            await this.$axios.$post('/api/comissions/withdraw', this.model)
              .then((response) => {
                window.location.reload();
              })
        }
    }
}
</script>
