<template>

    <div class="commission-stats card border">

        <div class="row no-gutters">

            <div class="p-3 p-md-4" :class="inline ? 'col-4 border-right' : 'col-12 border-bottom'">
            
                <div class="mb-2" :class="{'d-flex align-items-center justify-content-between' : withdrawButton}">

                    <span class="fs-5 fs-md-4 fw-bold">

                        <span class="mr-1 mr-md-2">
                            <CoinsIcon class="icon"/>
                        </span>
                        
                        Komisi
                        
                        <small 
                            v-b-tooltip.hover.right.v-dark="'Masukkan deskripsi Komisi di sini'" 
                            class="ml-1 pr-2 align-top text-primary opacity-75"
                        >
                            <fa icon="circle-info"/>
                        </small>
                    
                    </span>

                    <BaseButton v-if="withdrawButton" @click="onDrawCommission">Tarik Komisi</BaseButton>

                </div>

                <div class="d-block">

                    <span class="fs-4 fs-md-2 fw-bold">{{ formatPrice(commission) }}</span>

                </div>
        
            </div>

            <div class="border-right p-3 p-md-4" :class="inline ? 'col-4' : 'col-6'">
                
                <div class="fs-5 fs-md-4 fw-bold mb-2">
                    
                    <span class="mr-1 mr-md-2">
                        <b-img src="/img/shield-checkmark.png" class="icon" />
                    </span>

                    Polis Terjual
                    
                    <small 
                        v-b-tooltip.hover.right.v-dark="'Masukkan deskripsi Polis Terjual di sini'" 
                        class="ml-1 pr-2 align-top text-primary opacity-75"
                    >
                        <fa icon="circle-info"/>
                    </small>

                </div>

                <div class="d-block">

                    <span class="fs-4 fs-md-2 fw-bold">{{ productSold }}</span>

                </div>

            </div>

            <div class="p-3 p-md-4" :class="inline ? 'col-4' : 'col-6'">
                
                <div class="fs-5 fs-md-4 fw-bold mb-2">
                    
                    <span class="mr-1 mr-md-2">
                        <StripesIcon class="icon" />
                    </span>

                    GWP
                    
                    <small 
                        v-b-tooltip.hover.right.v-dark="'Masukkan deskripsi Gross Written Premium (GWP) di sini'" 
                        class="ml-1 pr-2 align-top text-primary opacity-75"
                    >
                        <fa icon="circle-info"/>
                    </small>                  

                </div>

                <div class="d-block">

                    <span class="fs-4 fs-md-2 fw-bold">{{ gwp }}</span>

                </div>

            </div>

        </div>

    </div>

</template>

<script>
import CoinsIcon from '../assets/svg/coins.svg'
import StripesIcon from '../assets/svg/stripes.svg'
import BaseButton from '../components/BaseButton'

export default {
    components: {
        CoinsIcon,
        StripesIcon,
        BaseButton
    },
    props: {
        commission: {
            type: Number,
            default: 0
        },
        productSold: {
            type: Number,
            default: 0
        },
        gwp: {
            type: Number,
            default: 0
        },
        withdrawButton: {
            type: Boolean,
            default: true
        },
        inline: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onDrawCommission() {
            // masukkan fungsi penarikan komisi di sini
            console.log("Komisi ditarik")
        }
    }
}
</script>