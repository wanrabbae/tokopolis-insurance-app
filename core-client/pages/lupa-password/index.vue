<template>

    <div>

        <h2>Lupa Password</h2>

        <p>Kami akan mengirimkan tautan ke email anda untuk mengubah Password</p>

        <b-alert :show="showAlertSuccess" variant="success" class="mb-3">

            <b-list-group class="alert text-white">

                <b-list-group-item class="list-item-alert-success">Kami telah mengirim link untuk reset password ke email anda</b-list-group-item>

            </b-list-group>

        </b-alert>

        <b-alert :show="showAlertError" variant="danger" class="mb-3">

            <b-list-group class="alert text-white">

                <b-list-group-item v-for="notification in notifications" :key="notification.message" class="list-item-alert-danger">• {{notification.message}}</b-list-group-item>

            </b-list-group>

        </b-alert>

        <b-form method="post" @submit.prevent="forgetPassword">

            <BaseInput
                v-model="email"
                name="Email"
                placeholder="Email"
                :rules="{required: true, email: true}"
            />

            <BaseButton native-type="submit" block>Kirim Tautan</BaseButton>

        </b-form>

    </div>

</template>

<script>
import BaseInput from '../../components/Inputs/BaseInput'

export default {
    components: {
        BaseInput
    },
    layout: 'auth',
    middleware:'guest',
    data () {
        return {
            title: 'Lupa Password',
            email: '',
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
        async forgetPassword () {
            try {
                await this.$axios.post('api/forget-password', {
                    email: this.email,
                }).then((response) => {
                    this.showAlertSuccess = true
                    this.showAlertError = false
                    }
                )

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
