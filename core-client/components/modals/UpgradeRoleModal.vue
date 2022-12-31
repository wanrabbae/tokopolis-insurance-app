/* eslint-disable prefer-regex-literals */
/* eslint-disable no-useless-escape */
<template>

    <b-modal
      v-bind="$attrs"
      centered
      body-class="p-4"
      @close="closeHandler"
      @ok="okHandler"
    >

        <template #modal-header="{ close }">

            <h4 class="mb-0">{{ modalTitle }}</h4>

            <div class="pointer" @click="close">

                <CloseIcon width="28px"/>

            </div>

        </template>

        <div class="text-justify">
            Dengan ini saya menyatakan bahwa: <br />
            <br />
            <ul>
                <li>Saya bersedia mengisi informasi yang di sediakan oleh PT Tokopolis Handal Nusantara</li>
                <li>Saya menyatakan bahwa semua informasi yang diinformasikan benar dan akurat sesuai data pengguna</li>
                <li>Saya mengetahui dan menyetujui syarat dan ketentuan aplikasi milik PT Tokopolis Handal Nusantara</li>
                <li>Saya bersedia data informasi yang disampaikan digunakan untuk keperluan PT Tokopolis Handal Nusantara sesuai perundang-undangan yang berlaku</li>
            </ul>
            <br />
            Informasi-informasi yang tidak lengkap atau palsu dapat dijadikan alasan bagi PT Tokopolis Handal Nusantara untuk menolak pengajuan verifikasi dan penghapusan akun secara sepihak.
        </div>

        <br />

        <b-form role="form" method="post" @submit.prevent="doLogin">

            <BaseInput
              v-model="model.leader_id"
              name="Leader ID"
              placeholder="Masukkan ID Leader"
              rules="required"
            />

        </b-form>

        <template #modal-footer="{ ok }">

          <BaseButton :disabled="model.leader_id ==''" block @click="ok()">Submit</BaseButton>

        </template>

    </b-modal>

</template>

<script>
import CloseIcon from '../../assets/svg/close.svg'
import BaseButton from '../BaseButton'
import BaseInput from '../Inputs/BaseInput'

export default {
    components: {
        CloseIcon,
        BaseButton,
        BaseInput
    },
    props: {
        modalTitle: {
            type: String,
            default: "Upgrade Role"
        },
    },
    data () {
        return {
            model: {
                leader_id: '',
            }
        }
    },
    methods: {
        okHandler(bvModalEvt){
            bvModalEvt.preventDefault()
            this.$emit('submit', this.model)
        },
        closeHandler() {
            this.$emit('close')
        },
    }
}
</script>
