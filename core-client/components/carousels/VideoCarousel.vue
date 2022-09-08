<template>
    
    <component :is="tag">
                
        <client-only>

            <div class="video-carousel-wrapper">

                <swiper ref="promotionCarousel" :options="{...swiperOptions, loop}">

                    <swiper-slide v-for="(video, i) in videos" :key="i" class="swiper-slide d-flex justify-content-center">

                        <div class="swiper-video">

                            <div class="iframe-container">

                                <iframe 
                                    :src="video" 
                                    title="YouTube video player" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen
                                ></iframe>

                            </div>

                        </div>

                    </swiper-slide> <!-- swiper-slide ends -->

                    <div v-if="videos.length > 1" id="video-carousel-button-prev" slot="button-prev" class="swiper-button-prev"></div>

                    <div v-if="videos.length > 1" id="video-carousel-button-next" slot="button-next" class="swiper-button-next"></div> 

                </swiper> <!-- swiper ends --> 
            
                <div class="d-flex justify-content-center mt-2">

                    <div v-if="videos.length > 1" id="video-carousel-pagination" class="swiper-pagination"></div>

                </div>
                
            </div>

            <!-- loading indicator, rendered on server-side -->
            <template slot="placeholder">

                <div class="video-carousel-wrapper">

                    <div class="swiper-container is-loading">

                        <div class="swiper-wrapper">
                            
                            <div class="swiper-slide d-flex justify-content-center">

                                <div class="swiper-video">

                                    <div class="iframe-container lazy-loading">
                                        
                                        <iframe src="" frameborder="0"></iframe>

                                    </div>

                                </div>

                            </div>

                        </div>
                            
                    </div>
                
                </div>

            </template>
        
        </client-only>

    </component>

</template>

<script>
export default {
    name: 'VideoCarousel',
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        videos: { 
            type: Array,
            default: null
        }
    },
    data() {
        return {
            swiperOptions: {
                slidesPerView: 'auto',
                centeredSlides: true,
                pagination: {
                    el: '#video-carousel-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '#video-carousel-button-prev',
                    prevEl: '#video-carousel-button-next'
                }
            }
        }
    },
    computed: {
        loop() {
            return this.videos.length > 1;
        }
    }
}
</script>