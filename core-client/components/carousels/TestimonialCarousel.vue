<template>
    
    <div class="carousel-wrapper testimonial-carousel">        
        
        <div class="row no-gutters">
            
            <div class="col-1 d-flex justify-content-start align-items-center">
                
                <div id="testimonial-swiper-button-prev" slot="button-prev" class="swiper-button-prev"></div>
            
            </div> <!-- col-1 ends -->
            
            <div class="col-10">
                
                <div v-swiper:testimonialCarousel="swiperOption" class="swiper">
                    
                    <div class="swiper-wrapper">
                        
                        <div v-for="(testimonial, id) in testimonials" :key="id" class="swiper-slide">
                            
                            <div class="card h-100">
                                
                                <div class="card-header pb-0">
                                    
                                    <div class="d-inline-block mr-3" style="width:80px; height:80px">
                                        
                                        <b-img :src="testimonial.img" class="rounded-circle" :alt="testimonial.name" />
                                    
                                    </div>
                                    
                                    <div class="d-inline-flex align-items-center">
                                        
                                        <div class="fs-lg-3 fs-4 fw-bold">{{ testimonial.name }}</div>
                                    
                                    </div>

                                </div> <!-- card-header ends -->
                                
                                <div class="card-body">
                                    
                                    {{ testimonial.review }}
                                
                                </div> <!-- card-body ends -->

                            </div> <!-- card ends -->

                        </div> <!-- swiper-slide ends -->

                    </div> <!-- swiper-wrapper ends -->

                </div> <!-- swiper ends -->

            </div> <!-- col-10 ends -->

            <div class="col-1 d-flex justify-content-end align-items-center">
                
                <div id="testimonial-swiper-button-next" slot="button-prev" class="swiper-button-next"></div>
            
            </div> <!-- col-1 ends -->

        </div> <!-- row ends -->

    </div> <!-- carousel-wrapper.testimonial-carousel -->

</template>

<script>
export default {
    name: 'TestimonialCarousel',
    props: {
        testimonials: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
            swiperOption: {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 30,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 2,
                    }
                },
                navigation: {
                    nextEl: '#testimonial-swiper-button-next',
                    prevEl: '#testimonial-swiper-button-prev'
                }
            }
        }
    }
}
</script>