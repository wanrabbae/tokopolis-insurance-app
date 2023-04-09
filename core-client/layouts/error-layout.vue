<template>

    <div class="error-container d-flex flex-column justify-content-center align-items-center" style="min-height: 100vh">

        <h2 class="error-code">404</h2>

        <div class="error-title mb-4">Oops</div>

        <div class="error-message w-50 w-md-75 mb-5">

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
    props: {
        error: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            title: 'Error 404',
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    }
}
</script>