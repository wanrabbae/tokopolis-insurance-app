<template>

    <main class="main-content">

        <PromotionCarousel 
            tag="section" 
            :images="promotionImages"
            classes="py-4"
        />

        <Service 
            id="service"
            tag="section"
            classes="py-1"
            :service-list="serviceList"
        />
        
        <TrackClaim 
            id="track-claim"
            tag="section"
            class="pt-4 py-lg-5"
        />

        <section id="videos" class="container py-5">
            
            <VideoCarousel :videos="videos" />
        
        </section>

        <section id="claim-assistance">
            
            <ClaimAssistance 
                :claim-assistance-list="claimAssistanceList"
                class="container px-4 px-lg-5 py-lg-5 py-4" 
            />
        
        </section>

        <section class="container py-5">
            
            <WhyUs 
                id="why-us"
                :why-us-list="whyUsList"
                class="px-lg-5 pb-4"
            />

            <div id="partners" class="py-4">
                
                <h2 class="fs-lg-1 fs-3 text-center">Partner Kami</h2>
                
                <BrandCarousel :brand-images="partnerBrandImages"/>
            
            </div>

            <div id="covered-by" class="pt-4">
                
                <h2 class="fs-lg-1 fs-3 text-center">Telah Diliput Oleh</h2>           
                
                <BrandCarousel :brand-images="coveredByImages"/>
            
            </div>
        
        </section>

        <section id="testimonial" class="bg-dark-blue py-5">
            
            <div class="container">
                
                <h2 class="fs-lg-1 fs-3 text-center text-white">Apa Kata Mereka?</h2>
                
                <TestimonialCarousel :testimonials="testimonials"/>
            
            </div>
        
        </section>

        <CallToAction 
            id="call-to-action" 
            tag="section"
        />

    </main>
    
</template>

<script>
import Service from '../components/Service'
import TrackClaim from '../components/TrackClaim'
import WhyUs from '../components/WhyUs'
import ClaimAssistance from '../components/ClaimAssistance'
import CallToAction from '../components/CallToAction'
import PromotionCarousel from '../components/carousels/PromotionCarousel'
import VideoCarousel from '../components/carousels/VideoCarousel'
import BrandCarousel from '../components/carousels/BrandCarousel'
import TestimonialCarousel from '../components/carousels/TestimonialCarousel'

export default {
    components: {
        Service,
        TrackClaim,
        WhyUs,
        ClaimAssistance,
        CallToAction,
        PromotionCarousel,
        VideoCarousel,
        BrandCarousel,
        TestimonialCarousel
    },
    data() {
        return {
            promotionImages: [
                {
                    src: "img/promotion-1.png",
                    alt: "Promotion Banner 1"
                },
                {
                    src: "img/promotion-2.png",
                    alt: "Promotion Banner 2"
                }
            ],
            serviceList: [
                {
                    image: "svg/new/polis-car.svg",
                    text: "Mobil",
                    link: "/asuransi/mobil"
                },
                {
                    image: "svg/motorcycle-coming-soon.svg",
                    text: "Motor",
                    link: "#"
                },
                {
                    image: "svg/new/polis-smartphone-locked.svg",
                    text: "Smartphone",
                    link: "#"
                },
                {
                    image: "svg/health-coming-soon.svg",
                    text: "Kesehatan",
                    link: "#"
                },
                {
                    image: "svg/life-coming-soon.svg",
                    text: "Jiwa",
                    link: "#"
                }
            ],
            videos: [
                "https://www.youtube.com/embed/FpAM4fYj-4g",
            ],
            claimAssistanceList: [
                {
                    image: "svg/new/claim-report.svg",
                    text: "Lapor Claim",
                    link: "#"
                },
                {
                    image: "svg/new/claim-status.svg",
                    text: "Claim Status",
                    link: "#"
                },
                {
                    image: "svg/new/emergency.svg",
                    text: "Emergency",
                    link: "#"
                }
            ],
            whyUsList: [
                {
                    image: "svg/new/fast-time.svg",
                    text: "Praktis dan Proses Cepat"
                },
                {
                    image: "svg/new/cooperation.svg",
                    text: "40+ Partner Asuransi"
                },
                {
                    image: "svg/new/file.svg",
                    text: "Bandingkan Dengan Mudah"
                },
                {
                    image: "svg/new/headset.svg",
                    text: "Digital Claim Assistance"
                }
            ],
            partnerBrandImages: [
                {
                    src: "svg/Tugu.svg",
                    alt: "Tugu Insurance"
                },
                {
                    src: "svg/Adira.svg",
                    alt: "Adira Insurance"
                },
                {
                    src: "svg/Sinarmas.svg",
                    alt: "Asuransi Sinarmas"
                },
                {
                    src: "svg/GreatEastern.svg",
                    alt: "Great Eastern"
                },
                {
                    src: "svg/CiputraLife.svg",
                    alt: "Ciputra Life"
                }
            ],
            coveredByImages: [
                {
                    src: "svg/Liputan6.svg",
                    alt: "Liputan 6"
                },
                {
                    src: "svg/TechinAsia.svg",
                    alt: "Techin Asia"
                },
                {
                    src: "svg/kompas.svg",
                    alt: "Kompas"
                },
                {
                    src: "svg/Detik.svg",
                    alt: "Detik"
                },
                {
                    src: "svg/TechCrunch.svg",
                    alt: "Tech Crunch"
                }
            ],
            testimonials: [
                {
                    name: "Ferdinand Hasibuan ",
                    img: "img/testimoni-1.jpg",
                    review: "Saya sangat terbantu ketika pengajuan klaim asuransi, proses sangat mudah dan cepat, berkat digitalisasi sistem asuransi di tokopolis yang diberikan saya merasa puas. "
                },
                {
                    name: "Hesti Ariani",
                    img: "img/testimoni-2.jpg",
                    review: "Sesuai ekspektasi proses asuransi yang dibantu tokopolis, dengan kemudahan fitur komparasi memudahkan saya menentukan asuransi terbaik."
                },
                {
                    name: "Liza Rahma",
                    img: "img/testimoni-3.jpg",
                    review: "Makasih tokopolis! budget asuransi saya yang pas-pasan, namun tetap dibantu secara maksimal menentukan asuransi mobil terbaik."
                }
            ]
        }
    },
    head() {
        return {
            title: 'Pico Insurtech',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Deskripsi Halaman'
                }
            ]
        };
    }
}
</script>
