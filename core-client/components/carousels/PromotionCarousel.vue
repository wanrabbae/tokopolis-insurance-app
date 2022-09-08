<template>

    <component :is="tag" class="container">
    
        <div class="promotion-carousel-wrapper">

            <client-only>
    
                <swiper 
                    ref="promotionCarousel" 
                    :options="swiperOptions" 
                    @ready="onCarouselReady" 
                    @resize="onResizeWindow"
                >

                    <swiper-slide 
                        v-for="(image, i) in images" 
                        :key="i" 
                        class="swiper-slide rounded-5 overflow-hidden"
                    >

                        <div class="swiper-image">

                            <nuxt-picture
                                preset="default"
                                width="500"
                                height="167"
                                sizes="md:315px lg:500px"
                                :src="image.source"
                                :alt="image.alt"
                            />

                        </div> <!-- swiper-image ends -->

                    </swiper-slide> <!-- swiper-slide ends -->

                    <div id="promotion-carousel-button-prev" slot="button-prev" class="swiper-button-prev"></div>

                    <div id="promotion-carousel-button-next" slot="button-next" class="swiper-button-next"></div> 

                </swiper> <!-- swiper ends --> 

                <!-- loading indicator, rendered on server-side -->
                <template slot="placeholder">
                
                    <div class="swiper-container is-loading">

                        <div class="swiper-wrapper">
                            
                            <div class="swiper-slide rounded-5 overflow-hidden swiper-slide-prev">
                                
                                <div class="swiper-image lazy-loading"></div>
                            
                            </div>

                            <div class="swiper-slide rounded-5 overflow-hidden swiper-slide-active">
                                
                                <div class="swiper-image lazy-loading"></div>
                            
                            </div>

                            <div class="swiper-slide rounded-5 overflow-hidden swiper-slide-next">
                                
                                <div class="swiper-image lazy-loading"></div>
                            
                            </div>

                        </div>
                            
                    </div>

                </template>

            </client-only>
        
        </div>

    </component>

</template>

<script>
export default {
    name: 'PromotionCarousel',
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        images: { 
            type: Array,
            default: null
        }
    },
    data() {
        return {
            carouselInterval: null,
            resizeInterval: null,
            swiperOptions: {
                loop: true,
                slidesPerView: 'auto',
                centeredSlides: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: true
                },
                navigation: {
                    nextEl: '#promotion-carousel-button-next',
                    prevEl: '#promotion-carousel-button-prev'
                }
            }
        }
    },
    methods: {
        onCarouselReady() {
            // disable carousel animation before interval
            if(!this.carouselInterval) 
            {
                this.carouselInterval = setTimeout(() => {
                    this.$refs.promotionCarousel.$swiper.el.classList.add("is-ready");
                }, 300);
            }
        },
        onResizeWindow() {
            if(this.resizeInterval) clearTimeout(this.resizeInterval);
            this.resizeInterval = setTimeout(function() {
                this.$refs.promotionCarousel.$swiper.updateSize()
            }, 500);
        }
    }
}
</script>