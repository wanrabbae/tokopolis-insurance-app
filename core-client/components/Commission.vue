<template>

    <div class="card border">

        <div class="row no-gutters">

            <div class="p-3" :class="inline ? 'col-4 border-right' : 'col-12 border-bottom'">
            
                <div class="mb-2" :class="{'d-flex align-items-center justify-content-between' : !inline}">

                    <span class="fs-4 fw-bold">

                        <span class="mr-2">
                            <CoinsIcon width="32px" height="32px"/>
                        </span>
                        
                        Komisi
                        
                        <small class="ml-1 align-top text-primary opacity-75">
                            <fa icon="circle-info"/>
                        </small>
                    
                    </span>

                    <BaseButton v-if="!inline">Penarikan</BaseButton>

                </div>

                <div class="d-block">

                    <span class="fs-2 fw-bold">{{ formatPrice(0) }}</span>

                </div>
        
            </div>

            <div class="border-right p-3" :class="inline ? 'col-4' : 'col-6'">
                
                <div class="fs-4 fw-bold mb-2">
                    
                    <span class="mr-2">
                        <b-img src="/img/shield-checkmark.png" style="width: 32px; height: 32px" />
                    </span>

                    Polis Terjual
                    
                    <small class="ml-1 align-top text-primary opacity-75">
                        <fa icon="circle-info"/>
                    </small>

                </div>

                <div class="d-block">

                    <span class="fs-2 fw-bold">0</span>

                </div>

            </div>

            <div class="p-3" :class="inline ? 'col-4' : 'col-6'">
                
                <div class="fs-4 fw-bold mb-2">
                    
                    <span class="mr-2">
                        <StripesIcon width="32px" height="32px" />
                    </span>

                    Downline 
                    
                    <small class="ml-1 align-top text-primary opacity-75">
                        <fa icon="circle-info"/>
                    </small>

                </div>

                <div class="d-block">

                    <span class="fs-2 fw-bold">0</span>

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
        downline: {
            type: Number,
            default: 0
        },
        inline: {
            type: Boolean,
            default: false
        }
    }
}
</script>