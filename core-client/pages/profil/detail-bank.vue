<template>

    <div>

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

                    <BaseButton native-type="submit" classes="w-100 w-md-auto" :disabled="invalid">Update</BaseButton>

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
            banks: [{ text: 'Pilih Bank', value: null }, 'BCA', 'BNI', 'MANDIRI' ,'BRI' , 'BTN' , 'CIMB'],
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    methods: {
        onSubmit() {
            console.log("Detail bank telah diperbarui");
        }
    }
}
</script>
