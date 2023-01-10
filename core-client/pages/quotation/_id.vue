<template>
    <div>
        <embed v-if="status" :src="filename" width="100%" style="height: 100vh; display: block;" />
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
