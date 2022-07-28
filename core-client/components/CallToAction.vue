<template>
    
    <component :is="tag" class="d-flex justify-content-end">
        
        <b-img-lazy :src="overlayImage" alt="Call To Action Overlay" class="overlay-img" />
        
        <div class="overlay-gradient"></div>

        <div class="overlay-content">
            
            <div class="container">
            
                 <div class="w-75 w-md-50 mr-auto">
                    
                    <h2 class="fs-lg-1 fs-3">{{ caption }}</h2>
                    
                    <BaseButton classes="text-uppercase" :href="buttonLink">
                        
                        {{ buttonText }}
                    
                    </BaseButton>
                
                </div>

            </div>
        
        </div>
    
    </component>

</template>

<script>
import BaseButton from './BaseButton'

export default {
    name: 'CallToAction',
    components: {
        BaseButton
    },
    props: {
        tag: {
            type: String,
            default: 'div',
            description: 'html tag'
        },
        overlayImage: {
            type: String,
            default: "/img/bg-call-to-action.png"
        },
        caption: {
            type: String,
            default: 'Jadilah bagian dari kami dan dapatkan penghasilan tak terbatas'
        },
        buttonText: {
            type: String,
            default: 'Daftar Sekarang'
        },
        buttonLink: {
            type: String,
            default: '/register'
        }
    }
}
</script>