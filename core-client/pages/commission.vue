<template>

    <div class="py-4 py-lg-5" style="background-color: #f6f5fc">

        <div class="container">
            
            <Commission 
                :commission="0" 
                :product-sold="0" 
                :downline="0"
                class="mb-4"
            />

            <Commission
                :commission="0" 
                :product-sold="0" 
                :downline="0"
                inline
            />
        
        </div> <!-- container ends -->

    </div>

</template>

<script>
import Commission from '../components/Commission'

export default {
    components: {
        Commission
    },
}
</script>