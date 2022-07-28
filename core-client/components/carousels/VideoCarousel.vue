<template>
    
    <div class="carousel-wrapper video-carousel">
        
        <div class="row no-gutters" :class="videos.length > 1 ? 'mb-4' : ''">
            
            <div class="col-1 col-lg-2 d-flex justify-content-start align-items-center">
                
                <div id="video-swiper-button-prev" slot="button-prev" class="swiper-button-prev"></div>
            
            </div> <!-- col-1.col-lg-2 ends -->
            
            <div class="col-10 col-lg-8">
                
                <div v-swiper:videoCarousel="swiperOption" class="swiper">
                    
                    <div class="swiper-wrapper">
                        
                        <div v-for="(video, id) in videos" :key="id" class="swiper-slide">
                            
                            <div class="swiper-video">
                                
                                <div class="video-container">
                                    
                                    <iframe 
                                        :src="video" 
                                        title="YouTube video player" 
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowfullscreen
                                    ></iframe>
                                
                                </div> <!-- video-container ends -->
                            
                            </div> <!-- swiper-video ends -->
                        
                        </div> <!-- swiper-slide ends -->
                    
                    </div> <!-- swiper-wrapper ends -->
                
                </div>  <!-- swiper ends -->
            
            </div> <!-- col-10.col-lg-8 ends -->
            
            <div class="col-1 col-lg-2 d-flex justify-content-end align-items-center">
                
                <div id="video-swiper-button-next" slot="button-next" class="video-swiper-button-next swiper-button-next"></div>
            
            </div> <!-- col-1.col-lg-2 ends -->
        
        </div> <!-- row ends -->
        
        <div v-if="videos.length > 1" id="video-swiper-pagination" slot="pagination" class="swiper-pagination"></div>
    
    </div> <!-- carousel-wrapper.video-carousel -->

</template>

<script>
export default {
    name: 'VideoCarousel',
    props: {
        videos: { 
            type: Array,
            default: null
        }
    },
    data() {
        return {
             swiperOption: {
                loop: true,
                slidesPerView: 1,
                pagination: {
                    el: '#video-swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '#video-swiper-button-next',
                    prevEl: '#video-swiper-button-prev'
                }
            }
        }
    },
}
</script>