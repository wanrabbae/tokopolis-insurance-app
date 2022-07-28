<template>

    <div>

        <h2>Verifikasi Detail Bank</h2>

        <b-form>
            
            <b-form-group>
                
                <b-form-select
                    v-model="model.bank"
                    :options="banks"
                    required
                />

            </b-form-group>

            <BaseInput
                v-model="model.bankNumber"
                name="Nomor Rekening"
                placeholder="Nomor Rekening"
                :rules="{ required: true }"
            />

            <BaseInput
                v-model="model.bankName"
                class="mb-3"
                name="Nama Rekening"
                placeholder="Nama Rekening"
                :rules="{ required: true }"
            />

            <BaseButton native-type="submit" classes="mb-3" block>Simpan</BaseButton>

            <a href="#" class="d-block text-center">Lewati</a>

        </b-form>
            
    </div>

</template>

<script>
import BaseInput from '../components/Inputs/BaseInput'

export default {
    components: { 
        BaseInput 
    },
    layout: 'auth',
    data () {
        return {
            model: {
                bank: null,
                bankNumber: null,
                bankName: null,
            },
            banks: [
                { text: 'Nama Bank', value: null }, 
                'BCA', 'BNI', 'MANDIRI' ,'BRI' , 'BTN' , 'CIMB'
            ],
        }
    }
}
</script>

