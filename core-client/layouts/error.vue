<template>
    
    <div class="error-container d-flex flex-column justify-content-center align-items-center" style="min-height: 100vh">
        
        <div style="font-size: 6rem">
            
            <span class="fw-bold text-dark">{{ error.statusCode }}</span>
        
        </div>
        
        <div class="mb-4" style="font-size: 3rem">
            
            <span class="fw-bold text-dark">Oops</span>
        
        </div>
        
        <div class="text-center w-50 w-lg-75 mb-4">

            <span v-if="error.statusCode === 404">
                Halaman tidak dapat ditemukan
            </span>
            
            <span v-else>
                {{ error.message }}
            </span>
        
        </div>
        
        <BaseButton tag="a" href="/">Kembali ke Beranda</BaseButton>
    
    </div>

</template>

<script>
export default {
    layout: 'blank',
    props: {
        error: {
        type: Object,
        default: () => ({})
        }
    },
    head() {
        return {
            title: 'Error ' + this.error.statusCode + ' - Pico Insurtech',
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