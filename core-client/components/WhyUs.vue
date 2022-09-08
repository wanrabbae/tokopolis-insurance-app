<template>
    
    <component :is="tag" class="container">
        
        <div class="why-us-wrapper">
            
            <h2 class="fs-3 fs-md-2 text-center mb-5">Kenapa Kami?</h2>
            
            <div class="row justify-content-center">
                
                <div v-for="(item, i) in whyUsList" :key="i" class="col-6 col-md-3 d-flex justify-content-center">
                    
                    <div class="why-us-card px-4">
                            
                        <div class="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                            
                            <nuxt-img
                                preset="default"
                                :src="item.image"
                                :alt="item.alt ? item.alt : 'Why Us Icon - ' + item.text" 
                                sizes="md:70px lg:96px"
                                loading="lazy"
                            />
                            
                            <div class="text-center mt-2">
                                
                                <span class="fw-bold text-dark">{{ item.text }}</span>
                            
                            </div>

                        </div>
                    
                    </div>
                
                </div>
            
            </div>

        </div>
    
    </component>

</template>

<script>
export default {
    name: 'WhyUs',
    props: {
        tag: {
            type: String,
            default: 'div'
        }
    },
    data() {
        return {
            whyUsList: [
                {
                    image: "img/why-us-icon-fast.png",
                    text: "Praktis dan Proses Cepat"
                },
                {
                    image: "img/why-us-icon-cooperation.png",
                    text: "40+ Partner Asuransi"
                },
                {
                    image: "img/why-us-icon-compare.png",
                    text: "Bandingkan dengan Mudah"
                },
                {
                    image: "img/why-us-icon-customer-service.png",
                    text: "Digital Claim Assistance"
                }
            ]
        }
    }
}
</script>