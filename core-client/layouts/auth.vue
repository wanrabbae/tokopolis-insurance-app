<template>

    <div class="auth-container d-flex flex-column justify-content-center py-5">
        
        <a href="/" class="mx-auto mb-5">

            <nuxt-img  
                format="svg"
                height="36"
                src="svg/logo-tokopolis-white.svg"
                alt="Logo Tokopolis"
                loading="lazy"
            />
        
        </a>

        <div class="container">

            <div class="row justify-content-center">

                <div class="col-12 col-md-8 col-lg-6">

                    <NuxtChild class="card p-4 p-md-5" keep-alive />

                </div> <!-- col-12.col-md-5.col-md-8 ends -->

            </div> <!-- row ends -->

        </div> <!-- container ends -->

    </div> <!-- auth-container ends -->

</template>