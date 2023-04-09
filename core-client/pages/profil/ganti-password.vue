<template>

    <div class="card border">

        <validation-observer v-slot="{ handleSubmit, invalid }" tag="div" class="card-body">

            <h2>Ganti Password</h2>

            <b-alert :show="showAlertError" variant="danger" class="mb-3">

                <b-list-group class="alert text-white">

                    <b-list-group-item v-for="notification in notifications" :key="notification.message" class="list-item-alert-danger">• {{notification.message}}</b-list-group-item>

                </b-list-group>

            </b-alert>

            <b-form
                method="post"
                class="w-100 w-md-75"
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
                    classes="w-100 w-md-auto"
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
            title: 'Ganti Password',
            model: {
                oldPassword: null,
                newPassword: null,
                confirmPassword: null
            },            
            showAlertSuccess:false,
            showAlertError:false,            
            notifications:[]
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    methods: {
        async changePassword() {
            try {
                await this.$axios.$post('api/user/change-password', {
                    password : this.model.oldPassword,
                    password_new : this.model.newPassword,
                    password_confirmation : this.model.confirmPassword
                }).then ((response)=> {
                    window.location.reload(true)
                })
            } catch (e) {

                if(e.response.data.message == null){
                    this.notifications = e.response.data.data
                } else {
                    this.notifications = []
                    this.notifications.push({
                        message: e.response.data.message
                    })
                }

                this.showAlertError = true
                this.showAlertSuccess = false
            }

        }
    }
}
</script>
