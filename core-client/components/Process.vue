<template>
    
    <component :is="tag" class="container">

        <div class="row align-items-center">

            <div class="col-12 col-md-6 mb-4 mb-md-0">

                <h2 class="display-4 text-primary text-center text-md-left">Proses Kami</h2>
                
                <div class="h2 text-center text-md-left">Beberapa Tutorial yang Tersedia untuk Anda</div>

                <div class="text-center text-md-left">Anda dapat memilih beberapa video tutorial yang tersedia untuk mempelajari layanan kami lebih lanjut</div>

            </div>

            <VideoCarousel :videos="videos" class="col-12 col-md-6" />

        </div>
    
    </component> <!-- carousel-wrapper.video-carousel -->

</template>

<script>
import VideoCarousel from './carousels/VideoCarousel.vue'

export default {
    name: 'Process',
    components: {
        VideoCarousel
    },
    props: {
        tag: {
            type: String,
            default: 'div'
        }
    },
    data() {
        return {
            videos: [
                "https://www.youtube.com/embed/FpAM4fYj-4g"
            ],
        }
    },
}
</script>