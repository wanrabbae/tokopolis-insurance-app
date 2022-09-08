<template>
    
    <component :is="tag" class="container">

        <div class="row">

            <div class="col-12 col-md-6 align-self-center">
                
                <h2 class="fs-2 fs-md-1 text-center text-md-left mb-5 mb-md-6">
                    Dapatkan Asuransi Tepat untuk Mobil Anda
                </h2>
            
            </div>

            <div class="col-6 d-none d-md-block">

                <nuxt-img 
                    width="488" 
                    height="267" 
                    preset="default" 
                    src="img/hero-car-transparent.png"
                    alt="Hero Image - Car"
                    loading="lazy"
                />
            
            </div>

        </div>

        <div class="bg-secondary py-5 mt-0 mt-md-n6 rounded-5">

            <div class="row justify-content-center mx-n4 mb-4">
            
                <component :is="service.disabled ? 'span' : 'a'"
                    v-for="service in services" 
                    :key="service.text" 
                    :href="service.link"
                    class="col-auto px-4"
                >

                    <nuxt-img 
                        preset="default"
                        width="64"
                        height="64" 
                        :src="service.image"
                        :alt="'Service Icon - ' + service.text"
                        loading="lazy"
                        class="lazy-loading rounded-circle mb-2"
                    />
                    
                    <div class="text-center" :class="service.disabled ? 'text-muted' : 'text-white'">
                        
                        <span>{{ service.text }}</span>
                    
                    </div>
                    
                </component>

            </div> <!-- row ends -->
            
            <b-form class="d-block d-md-flex justify-content-md-center px-5" @submit.prevent="trackClaim">

                <BaseInput
                    v-model="model.claimNumber"
                    type="number"
                    name="claim-number"
                    placeholder="Masukkan nomor claim di sini"
                    class="flex-fill flex-md-grow-0 w-md-50 mb-md-0 mr-0 mr-md-3"
                    input-classes="custom-number"
                    onkeypress="if(this.value.length==14) return false;"
                />
            
                <BaseButton native-type="submit" classes="w-100 w-md-auto">Periksa Claim</BaseButton>

            </b-form>
        
        </div>
    
    </component>

</template>

<script>
import BaseInput from './Inputs/BaseInput'
import BaseButton from './BaseButton'

export default {
    name: 'Hero',
    components: {
        BaseInput,
        BaseButton
    },
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        services: {
            type: Array,
            default() {
                return [
                    {
                        image: "img/service-icon-car.png",
                        text: "Mobil",
                        link: "/asuransi/mobil"
                    },
                    {
                        image: "img/service-icon-motorcycle-disabled.png",
                        text: "Motor",
                        disabled: true
                    },
                    {
                        image: "img/service-icon-others-disabled.png",
                        text: "Lainnya",
                        disabled: true
                    }
                ]
            }
        },
        
    },
    data() {
        return {
            model: {
                claimNumber: null,
            }
        }
    },
    methods: {
        trackClaim() {
            console.log("track claim");
        }
    }
}
</script>