<template>
    <div>

        <section class="my-5">
            <div class="offset-3 col-md-6">
                <nuxt-img
                    width="340"
                    src="/img/logo-tokopolis.png"
                    alt="Logo Tokopolis"
                    style="margin-left: auto; margin-right: auto"
                    loading="lazy"
                />

                <div id="document-download">
                    <h2 class="text-center mb-5">Unduh Berkas Polis</h2>

                    <b-row v-if="status" align-h="center">
                        <b-col v-for="(button, index) in buttons" :key="index" cols="12" md="6" lg="6" class="mb-4">
                            <BaseButton class="mb-3 btn-secondary h-100" :disabled="!isDownloadValid(button.link)"
                                block @click="downloadNow(button.link)">
                                {{ button.text }}
                            </BaseButton>
                        </b-col>
                    </b-row>
                    <h4 v-else class="text-center">Berkas tidak ditemukan</h4>
                </div>
            </div>
        </section>

        <br>
        <br>

    </div>
</template>

<script>
export default {
    layout: 'blank',
    data() {
        return {
            id: this.$nuxt.$route.params.id,
            title: 'Unduh Berkas Polis',
            buttons: [
                {
                    key: "document",
                    text: "Dokumen Pendukung",
                    link: "#"
                },
                {
                    key: "excel",
                    text: "File Excel Penutupan",
                    link: "#"
                },
            ],
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
            await this.$axios.$get(`api/admin/transaction/${this.id}/file`)
                .then ((response) => {
                    this.buttons = this.buttons.map((button) => {
                        return {
                            ...button,
                            link: response.data[button.key]
                        }
                    })
                })
                .catch(() => {
                    this.status = false
                })
        },
        isDownloadValid(url) {
            return url != null
        },
        downloadNow(url) {
            if (url == null) return

            window.location.assign(url)
        }
    }
}
</script>

<style lang="scss" scoped>
h1 {
    font-size: 3rem;
}

#document-download {
    padding: 20px 30px;
    background: #fff2dc;
    margin-top: 30px;
    border: 1px solid #f3f3f3;
    border-radius: 10px;
}

</style>
