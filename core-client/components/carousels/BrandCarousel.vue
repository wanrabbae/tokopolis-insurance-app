<template>

    <div class="brand-carousel-wrapper">

        <client-only>
     
            <swiper 
                :options="swiperOptions"
                :style="{ opacity: grayscale ? 0.5 : 1, filter: grayscale ? 'grayscale(1)' : 'none' }"
            >
                
                <swiper-slide v-for="(image, i) in brandImages" :key="i">
                    
                    <div class="brand-image px-4">
                    
                        <nuxt-img 
                            height="48"
                            preset="default"
                            :src="image.source" 
                            :alt="image.alt" 
                            loading="lazy"
                        />

                    </div>
                
                </swiper-slide>
            
            </swiper>

            <template slot="placeholder">

                <div class="row flex-nowrap overflow-hidden">

                    <div v-for="i in 5" :key="i" class="swiper-slide col-6 col-sm-4 col-md-3 col-lg">
                    
                        <div class="brand-image rounded-5 lazy-loading"></div>

                    </div>

                </div>

            </template>

        </client-only>
    
    </div>

</template>

<script>
export default {
    name: 'BrandCarousel',
    props: {
        brandImages: {
            type: Array,
            default: null
        },
        grayscale: {
            type: Boolean,
            default: false,
            description: 'show brands in grayscale filter'
        }
    },
    data() {
        return {
            swiperOptions: {
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                slidesPerView: 2,
                breakpoints: {
                    992: {
                        slidesPerView: 5
                    },
                    768: {
                        slidesPerView: 4
                    },
                    576: {
                        slidesPerView: 3
                    }
                }
            }
        }
    }
}
</script>