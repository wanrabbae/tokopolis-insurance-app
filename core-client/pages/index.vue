<template>

    <main class="main-content">

        <Hero id="hero" tag="section" class="my-5 my-md-6" />

        <PromotionCarousel id="promotion" tag="section" :images="promotionImages" class="my-5 my-md-6" />
        
        <section id="partner" class="container my-5 my-md-6">
            
            <BrandCarousel :brand-images="partnerImages" grayscale />

        </section>

        <Process id="process" tag="section" class="my-5 my-md-6"/>

        <ClaimAssistance id="claim-assistance" tag="section" class="my-5 my-md-6" />

        <WhyUs id="why-us" class="my-5 my-md-6" />

        <section id="coverer" class="container my-5 my-md-6 py-3">

            <div class="row align-items-center">

                <div class="col-12 col-md-3 mb-3 mb-md-0">

                    <h2 class="fs-3 text-center text-md-left">Telah Diliput oleh</h2>

                </div>

                <div class="col-12 col-md-9">
            
                    <BrandCarousel :brand-images="covererImages"/>

                </div>

            </div>

        </section>

        <Testimonial id="testimonial" class="my-5 my-md-6"/>

    </main>

</template>

<script>
import Hero from '../components/Hero'
import PromotionCarousel from '../components/carousels/PromotionCarousel'
import BrandCarousel from '../components/carousels/BrandCarousel'
import Process from '../components/Process'
import ClaimAssistance from '../components/ClaimAssistance'
import WhyUs from '../components/WhyUs'
import Testimonial from '../components/Testimonial'

export default {
    components: {
        Hero,
        PromotionCarousel,
        BrandCarousel,
        Process,
        ClaimAssistance,
        WhyUs,
        Testimonial
    },
    data() {
        return {
            promotionImages: [
                {
                    source: "/img/promotion-banner-1.png",
                    alt: "Promotion Banner 1"
                },
                {
                    source: "/img/promotion-banner-2.png",
                    alt: "Promotion Banner 2"
                },
                {
                    source: "/img/promotion-banner-3.png",
                    alt: "Promotion Banner 3"
                }
            ],
            partnerImages: [
                {
                    source: "/svg/brands/logo-tugu.svg",
                    alt: "Tugu Insurance"
                },
                {
                    source: "/svg/brands/logo-bintang.svg",
                    alt: "Asuransi Bintang"
                },
                {
                    source: "/svg/brands/logo-astra.svg",
                    alt: "Asuransi Astra"
                },
                {
                    source: "/svg/brands/logo-zurich.svg",
                    alt: "Zurich"
                }
            ],
            covererImages: [
                {
                    source: "/svg/brands/logo-liputan-6.svg",
                    alt: "Liputan 6"
                },
                {
                    source: "/svg/brands/logo-tech-in-asia.svg",
                    alt: "Tech in Asia"
                },
                {
                    source: "/svg/brands/logo-kompas.svg",
                    alt: "Kompas"
                },
                {
                    source: "/svg/brands/logo-detik.svg",
                    alt: "Detik"
                },
                {
                    source: "/svg/brands/logo-tech-crunch.svg",
                    alt: "Tech Crunch"
                }
            ]
        }
    },
    head() {
        return {
            titleTemplate: `%s`,
        };
    }
}
</script>
