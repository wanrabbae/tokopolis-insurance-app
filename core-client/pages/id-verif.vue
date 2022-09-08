<template>

    <div>

        <h2>Verifikasi Identitas</h2>

        <validation-observer v-slot="{ handleSubmit, invalid }">
            
            <b-form @submit.prevent="handleSubmit(submit)">

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

                <BaseButton native-type="submit" :disabled="invalid" block>
                    Simpan
                </BaseButton>

                <BaseButton tag="a" href="#" type="link" block>
                    Lewati
                </BaseButton>

            </b-form>

        </validation-observer>

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
            title: 'Verifikasi ID',
            model: {
                identity: null,
                identityNumber: "",
                eula: true,
            },
            identities: [
                { text: "Jenis Identitas", value: null },
                "KTP", "Paspor", "SIM",
            ],
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    methods: {
        submit() {
            // put code here
        }
    }
};
</script>
