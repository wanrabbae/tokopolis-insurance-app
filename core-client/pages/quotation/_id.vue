<template>
    <div v-if="filename !== null" style="height: 100vh;">
        <embed :src="filename" width="100%" class="display-embed" />
    </div>
</template>

<script>
export default {
    layout: 'blank',
    data() {
        return {
            id: this.$nuxt.$route.params.id,
            title: 'Berkas Quotation',
            filename: null,
            status: true
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        async getData() {
            await this.$axios.$get(`api/admin/transaction/${this.id}/quotation`)
                .then ((response) => {
                    this.filename = response.data.quotation
                })
                .catch(() => {
                    this.status = false

                    setTimeout(() => {
                        window.close()
                    }, 1000)
                })
        },
    }
}
</script>
<style scoped>
    .display-embed {
        height: 100%;
        display: block;
    }
</style>
