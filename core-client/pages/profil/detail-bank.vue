<template>

    <div class="card border">

        <div class="card-body">

            <h2>Detail Bank</h2>

            <validation-observer v-slot="{ handleSubmit, invalid }" tag="div" class="d-block">

                <b-form @submit.prevent="handleSubmit(onSubmit)">

                    <BaseSelect
                        v-model="model.bank"
                        name="Nama Bank"
                        label="Nama Bank"
                        :options="banks"
                        class="w-100 w-md-75"
                        rules="required"
                    />

                    <BaseInput
                        v-model="model.bank_number"
                        type="number"
                        label="Nomor Rekening"
                        name="Nomor Rekening"
                        input-classes="custom-number"
                        placeholder="Masukkan Nomor Rekening"
                        class="w-100 w-md-75"
                        rules="required"
                        required
                    />

                    <BaseInput
                        v-model="model.bank_name"
                        name="Nama Rekening"
                        label="Nama Rekening"
                        placeholder="Masukkan Nama Rekening"
                        class="w-100 w-md-75"
                        rules="required"
                        required
                    />

                    <div v-if="model.verified" class="mt-2" style="color:#37e65f">

                        <span class="mr-1"><fa icon="circle-check" style="width: 16px; height: 16px;"/></span>

                        <span class="fw-bold">Terverifikasi</span>

                    </div>

                    <div v-else class="mt-2" style="color:#d42f2f">

                        <span class="mr-1"><fa icon="circle-xmark" style="width: 16px; height: 16px;"/></span>

                        <span class="fw-bold">Belum Terverifikasi</span>

                    </div>

                    <BaseButton native-type="submit" classes="w-100 mt-3 w-md-auto" :disabled="invalid">Update</BaseButton>

                </b-form>

            </validation-observer>

        </div> <!-- card-body ends -->

    </div>

</template>

<script>
import BaseInput from '../../components/Inputs/BaseInput'
import BaseSelect from '../../components/Inputs/BaseSelect'

export default {
    components: {
        BaseInput,
        BaseSelect
    },
    layout: 'userarea',
    data() {
        return {
            title: 'Detail Bank',
            model: {
                bank:null,
                bank_number:'',
                bank_name:'',
            },
            banks: [
                { text: 'Pilih Bank', value: null },
                { text: 'BCA', value: 'bca' },
                { text: 'BNI', value: 'bni' },
                { text: 'Mandiri', value: 'mandiri' },
                { text: 'BRI', value: 'bri' },
                { text: 'BTN', value: 'btn' },
                { text: 'CIMB Niaga', value: 'cmb' },
            ],
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    mounted(){
        this.getBank()
    },
    methods: {
        async getBank() {
            await this.$axios.$get('api/user/bank')
                .then ((response) => {
                    if (response.data != null) {
                        this.model.bank = response.data.type
                        this.model.bank_number = response.data.account_number
                        this.model.bank_name = response.data.fullname

                        this.model.verified = response.data.is_verified
                    }

                    this.loading = false
                })

        },
        onSubmit() {
            this.$axios.$post('api/user/bank', {
                type: this.model.bank,
                account_number: this.model.bank_number,
                fullname: this.model.bank_name,
            })
            .then(function(response) {
                window.location.reload(true)
            })
        }
    }
}
</script>
