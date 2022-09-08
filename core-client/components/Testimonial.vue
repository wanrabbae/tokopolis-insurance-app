<template>
    
    <div class="container">        
        
        <h2 class="fs-3 fs-md-2 text-center mb-5">Kata Mereka Tentang Kami</h2>

        <div class="testimonial-wrapper row">
            
            <div v-for="(testimonial, i) in testimonials" :key="i" class="col-12 col-md-4 mb-3 mb-md-0 mb-last-0">
                
                <div class="position-relative w-100 h-100 p-3 d-flex flex-column bg-white rounded-5 border">
                    
                    <div class="testimonial-quotation-mark"></div>

                    <div class="flex-grow-1 text-center mt-2">{{ testimonial.review }}</div>
                    
                    <div class="d-flex justify-content-center my-2">

                        <div class="testimonial-separator"></div>

                    </div>

                    <div class="w-100 d-flex justify-content-center">
                            
                        <nuxt-img 
                            preset="default"
                            width="32"
                            height="32"
                            :src="testimonial.avatar" 
                            :alt="'Avatar - ' + testimonial.name"
                            class="rounded-circle"
                        />
                    
                    </div>
                    
                    <div class="text-center mt-2">{{ testimonial.name }}</div>

                </div>

            </div> <!-- col-12.col-md-4 ends -->

        </div> <!-- testimonial-wrapper.row ends -->

    </div> <!-- carousel-wrapper.testimonial-carousel -->

</template>

<script>
export default {
    name: 'TestimonialCarousel',
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
            },
            testimonials: [
                {
                    name: "Ferdinand Hasibuan",
                    avatar: "/img/avatar-daniel-radcliff.jpg",
                    review: "Saya sangat terbantu ketika pengajuan klaim asuransi. Proses mudah, cepat, dan asuransi ditangani dengan segera."
                },
                {
                    name: "Hesti Ariani",
                    avatar: "/img/avatar-emma-watson.jpg",
                    review: "Sesuai ekspektasi. Dengan kemudahan fitur komparasi dari TOKOPOLIS, saya sebagai customer sangat dimudahkan untuk menentukan asuransi mobil yang tepat."
                },
                {
                    name: "Liza Rahma",
                    avatar: "/img/avatar-rupert-grind.jpg",
                    review: "Tokopolis memberikan Layanan yang bagus. Saya senang menjadi customer dari Insurtech ini!"
                }
            ]
        }
    }
}
</script>