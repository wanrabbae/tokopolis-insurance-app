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
                <li>Saya mengetahui dan menyetujui ketentuan pengguna milik PT Tokopolis</li>
            </ul>
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
