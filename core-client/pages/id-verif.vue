<template>
    
    <div>
        
        <h2>Verifikasi Identitas</h2>

        <b-form>
            
            <b-form-group>

                <b-form-select
                    v-model="model.identity"
                    :options="identities"
                    required
                />
                
            </b-form-group>

            <BaseInput
                v-model="model.identityNumber"
                name="Nomor Identitas"
                placeholder="Nomor Identitas"
                :rules="{ required: true }"
            />

            <BaseInput
                v-model="model.password"
                name="Password"
                type="password"
                placeholder="Password"
                :rules="{ required: true, min: 6 }"
            />

            <BaseButton native-type="submit" classes="mb-3" block>
                Simpan
            </BaseButton>

            <a href="#" class="d-block text-center">Lewati</a>

        </b-form>

    </div>

</template>

<script>
import BaseInput from "../components/Inputs/BaseInput"

export default {
    components: { 
        BaseInput 
    },
    layout: "auth",
    data() {
        return {
            model: {
                identity: null,
                identityNumber: "",
                eula: true,
            },
            identities: [
                { text: "Jenis Identitas", value: null },
                "KTP", "Paspor", "SIM",
            ],
        };
    }
};
</script>
