<template>

    <div>
        
        <div class="card-body">

            <h2>Ganti Password</h2>

            <b-form role="form" method="post" class="w-100 w-lg-75" @submit.prevent="changePassword">
                
                <BaseInput
                    v-model="oldPassword"
                    type="password"
                    name="Password Lama"
                    label="Password Lama"
                    placeholder="Masukkan Password Lama"
                    :rules="{required: true}"
                    required
                />

                <b-form-group>
                    
                    <ValidationProvider 
                        v-slot="{ errors, invalid, validated }"
                        vid="Password Baru"
                        name="Password Baru"
                        :rules="{ required: true, min: 6, max: 35 }"
                    >
                        
                        <label class="form-control-label">Password Baru</label>
                        
                        <input 
                            v-model="newPassword" 
                            type="password"
                            class="form-control"
                            placeholder="Masukkan Password Baru"
                            :class="{'is-invalid': invalid && validated}"
                        />
                        
                        <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
                            {{ errors[0] }}
                        </div>
                    
                    </ValidationProvider>
                
                </b-form-group>

                <b-form-group>
                    
                    <ValidationProvider 
                        v-slot="{ errors, invalid, validated }"
                        name="Konfirmasi Password Baru"
                        :rules="{ required: true, confirmed: 'Password Baru' }"
                    >
                        
                        <label class="form-control-label">Konfirmasi Password Baru</label>
                        
                        <input 
                            v-model="confirmPassword" 
                            type="password"
                            class="form-control"
                            placeholder="Konfirmasi Password Baru"
                            :class="{'is-invalid': invalid && validated}"
                        />
                        
                        <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
                            {{ errors[0] }}
                        </div>

                    </ValidationProvider>
                
                </b-form-group>

                <BaseButton native-type="submit" classes="w-100 w-lg-auto">Update</BaseButton>

            </b-form>

        </div> <!-- card-body ends -->

    </div>

</template>

<script>
import {  ValidationProvider } from 'vee-validate'
import BaseInput from '../../components/Inputs/BaseInput'

export default {
    components: { 
        BaseInput,
        ValidationProvider
    },
    layout: 'userarea',
    data() {
        return {
            oldPassword: '',
            newPassword:'',
            confirmPassword:'',
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
                password : this.oldPassword,
                password_new : this.newPassword,
                password_confirmation : this.confirmPassword
            }).then ((response)=> {
                window.location.reload(true)
                
            })

        }
    }
}
</script>