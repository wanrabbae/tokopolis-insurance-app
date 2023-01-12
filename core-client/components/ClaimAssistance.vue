<template>
    
    <component :is="tag" class="container">
        
        <div class="claim-assistance-wrapper rounded-5 px-3 px-md-6 py-5">
            
            <div class="row align-items-center">

                <div class="col-12 col-md-4 mb-3 mb-md-0">
                    
                    <h2 class="text-center text-md-left">Claim Assistance</h2>

                </div>

                <div class="col-12 col-md-8">

                    <div class="row justify-content-center">
                        
                        <component
                            :is="item.link ? 'a' : 'span'" 
                            v-for="(item, i) in assistanceList" 
                            :key="i" 
                            class="col-4 d-flex flex-column align-items-center"
                        >
                            
                            <div class="bg-white rounded-5 overflow-hidden">
                                
                                <nuxt-img 
                                    preset="default"
                                    :src="item.image"
                                    :alt="item.alt ? item.alt : 'Claim Assistance Icon - ' + item.text" 
                                    sizes="md:48px lg:96px"
                                    loading="lazy"
                                />
                            
                            </div> <!-- card-image ends -->
                            
                            <div class="text-center mt-2">
                                
                                <span class="fw-bold text-dark">{{ item.text }}</span>
                            
                            </div>
                        
                        </component> <!-- col-12.col-md-4 ends -->
                    
                    </div> <!-- row ends -->

                </div>

            </div>

        </div>
    
    </component>

</template>

<script>
export default {
    name: 'ClaimAssistance',
    props: {
        tag: {
            type: String,
            default: 'div'
        }
    },
    data() {
        return {
            assistanceList: [
                {
                    image: "img/claim-assistance-icon-report.png",
                    text: "Lapor Klaim"
                },
                {
                    image: "img/claim-assistance-icon-status.png",
                    text: "Klaim Status"
                },
                {
                    image: "img/claim-assistance-icon-emergency.png",
                    text: "Bantuan Klaim Secara Online"
                }
            ],
        }
    }
}
</script>