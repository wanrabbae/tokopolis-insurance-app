<template>

    <div class="auth-container d-flex flex-column justify-content-center">
        
        <a href="/" class="mx-auto mb-4">

            <PicoLogo class="text-white" height="64px" />
        
        </a>

        <div class="container">

            <div class="row justify-content-center">

                <div class="col-12 col-lg-5 col-md-8">

                    <Nuxt class="card p-4 p-lg-5" />

                </div> <!-- col-12.col-lg-5.col-md-8 ends -->

            </div> <!-- row ends -->

        </div> <!-- container ends -->

    </div> <!-- auth-container ends -->

</template>

<script>
import PicoLogo from '../assets/svg/pico-logo.svg'

export default {
    components: {
        PicoLogo
    }
}
</script>