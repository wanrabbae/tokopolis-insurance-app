<template>
    
    <component :is="tag">
        
        <div class="row align-items-center">
            
            <b-form role="form" method="post" class="col-12 col-lg-6" @submit.prevent="submitHandler">
                
                <h2 class="fs-3 fs-lg-1">{{ title }}</h2>
                
                <p>{{ caption }}</p>
                
                <BaseInput
                    v-model="model.claimNumber"
                    type="number"
                    name="claim-number"
                    placeholder="Masukkan nomor claim di sini"
                    input-classes="form-control custom-number"
                    onkeypress="if(this.value.length==14) return false;"
                >
                    
                    <template #append>
                        
                        <BaseButton native-type="submit">{{ buttonText }}</BaseButton>
                    
                    </template>
                
                </BaseInput>
            
            </b-form>  <!-- col-12 col-lg-6 ends -->
            
            <div class="col-12 col-lg-6 d-none d-lg-flex justify-content-end">
                
                <TrackClaimIcon style="width: 320px"/>
            
            </div> <!-- col-12 col-lg-6 ends -->
        
        </div> <!-- row ends -->

    </component>

</template>

<script>
import TrackClaimIcon from '../assets/svg/track-claim.svg'
import BaseInput from './Inputs/BaseInput'
import BaseButton from './BaseButton'

export default {
    name: 'TrackClaim',
    components: {
        BaseInput,
        BaseButton,
        TrackClaimIcon
    },
    props: {
        tag: {
            type: String,
            default: 'div',
            description: 'html tag'
        },
        title: {
            type: String,
            default: 'Tracking Claim'
        },
        caption: {
            type: String,
            default: 'Fitur untuk mengetahui progress pengajuan klaim anda secara real-time. Masukkan nomor pelaporan klaim anda disini dan dapatkankan informasi progress klaim yang sedang anda ajukan.'
        },
        inputPlaceholder: {
            type: String,
            default: ''
        },
        buttonText: {
            type: String,
            default: 'Periksa'
        }
    },
    data() {
        return {
            model: {
                claimNumber: null
            }
        }
    },
    methods: {
        submitHandler(evt) {
            this.$emit('submit', evt, this.model.claimNumber)
        }
    }
}
</script>