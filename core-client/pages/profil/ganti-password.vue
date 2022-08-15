<template>

    <div>
        
        <validation-observer v-slot="{ handleSubmit, invalid }" tag="div" class="card-body">

            <h2>Ganti Password</h2>

            <b-form 
                method="post" 
                class="w-100 w-lg-75" 
                @submit.prevent="handleSubmit(changePassword)"
            >
                
                <BaseInput
                    v-model="model.oldPassword"
                    type="password"
                    name="Password Lama"
                    label="Password Lama"
                    placeholder="Masukkan Password Lama"
                    rules="required"
                    required
                />

                <BaseInput
                    v-model="model.newPassword"
                    name="Password Baru"
                    type="password"
                    label="Password Baru"
                    placeholder="Password Baru"
                    rules="required|min:8|max:35"
                />

                <BaseInput
                    v-model="model.confirmPassword"
                    name="Konfirmasi Password Baru"
                    type="password"
                    label="Konfirmasi Password Baru"
                    placeholder="Konfirmasi Password Baru"
                    rules="required|confirmed:Password Baru"
                />
                       
                <BaseButton 
                    native-type="submit" 
                    classes="w-100 w-lg-auto" 
                    :disabled="invalid"
                >
                    Update
                </BaseButton>

            </b-form>

        </validation-observer> <!-- card-body ends -->

    </div>

</template>

<script>
import BaseInput from '../../components/Inputs/BaseInput'

export default {
    components: { 
        BaseInput
    },
    layout: 'userarea',
    data() {
        return {
            model: {
                oldPassword: null,
                newPassword: null,
                confirmPassword: null
            }
        }
    },
    head() {
        return {
            title: 'Ganti Password - Pico Insurtech',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Deskripsi Halaman'
                }
            ]
        }
    },
    methods: {
        async changePassword() {
            await this.$axios.$post('api/user/change-password', {
                password : this.model.oldPassword,
                password_new : this.model.newPassword,
                password_confirmation : this.model.confirmPassword
            }).then ((response)=> {
                window.location.reload(true)
            })

        }
    }
}
</script>