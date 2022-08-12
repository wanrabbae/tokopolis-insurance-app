<template>

    <div class="auth-container d-flex flex-column justify-content-center py-5">
        
        <a href="/" class="mx-auto mb-4">

            <TokopolisLogo class="text-white" height="150px" />
        
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
import TokopolisLogo from '../assets/svg/tokopolis-logo-white.svg'

export default {
    components: {
        TokopolisLogo
    }
}
</script>