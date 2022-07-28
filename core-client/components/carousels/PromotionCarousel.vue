<template>
    
    <div class="promotion-carousel">
        
        <div v-swiper:promotionCarousel="swiperOption" class="swiper">
            
            <div class="swiper-wrapper">
                
                <div v-for="(image, index) in images" :key="index" class="swiper-slide">

                    <div class="swiper-image">

                        <b-img :src="image.src" :alt="image.alt" />

                    </div> <!-- swiper-image ends -->
                
                </div> <!-- swiper-slide ends -->
            
            </div> <!-- swiper-wrapper ends -->   
            
            <div id="promotion-swiper-button-prev" slot="button-prev" class="swiper-button-prev"></div>
            
            <div id="promotion-swiper-button-next" slot="button-next" class="swiper-button-next"></div>
            
            <div id="promotion-swiper-pagination" slot="pagination" class="swiper-pagination"></div>
        
        </div> <!-- swiper ends -->  
    
    </div> <!-- promotion-carousel ends -->  

</template>

<script>
export default {
    name: 'PromotionCarousel',
    props: {
        images: { 
            type: Array,
            default: null
        }
    },
    data() {
        return {
            swiperOption: {
                loop: true,
                slidesPerView: 1,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '#promotion-swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '#promotion-swiper-button-next',
                    prevEl: '#promotion-swiper-button-prev'
                }
            }
        }
    }
}
</script>