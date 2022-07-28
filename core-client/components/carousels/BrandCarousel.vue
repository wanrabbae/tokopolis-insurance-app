<template>

    <div class="brand-carousel">
        
        <div v-swiper:brandCarousel="swiperOption" class="swiper">
            
            <div class="swiper-wrapper">
                
                <div v-for="(image, id) in brandImages" :key="id" class="swiper-slide">
                    
                    <div class="brand-image px-4">
                    
                        <b-img :src="image.src" :alt="image.alt" />

                    </div>
                
                </div>
            
            </div>
        
        </div>
    
    </div>

</template>

<script>
export default {
    name: 'BrandCarousel',
    props: {
        brandImages: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
             swiperOption: {
                loop: true,
                slidesPerView: 2,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 5,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                    576: {
                        slidesPerView: 3,
                    }
                }
            }
        }
    }
}
</script>