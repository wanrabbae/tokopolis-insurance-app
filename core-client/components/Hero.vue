<template>
    
    <component :is="tag" class="hero-wrapper container">

        <div class="hero-header row">

            <div class="col-12 col-md-6 align-self-center">
                
                <h2 class="hero-title fs-2 fs-md-1 text-center text-md-left">
                    Dapatkan Asuransi Tepat untuk Kebutuhan Anda
                </h2>
            
            </div>

            <div class="col-6 d-none d-md-block">

                <nuxt-img 
                    width="320" 
                    height="317" 
                    preset="default"
                    src="/svg/hero-homepage.svg"
                    alt="Hero Image - Insurance"
                    class="ml-auto mr-6"
                    loading="lazy"
                />
            
            </div>

        </div>

        <div class="hero-body py-5 rounded-5">

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
                    
                    <div class="text-dark text-center" :class="{ 'text-muted' : service.disabled }">
                        
                        <span>{{ service.text }}</span>
                    
                    </div>
                    
                </component>

            </div> <!-- row ends -->
            
            <b-form class="d-block d-md-flex justify-content-md-center px-5" @submit.prevent="trackClaim">

                <BaseInput
                    v-model="model.claimNumber"
                    type="text"
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
            this.$router.push({path: '/detail-klaim?id='+this.model.claimNumber})
        }
    }
}
</script>