<template>
    <div class="py-6" style="background-color: #f6f5fc">
        <b-container class="mb-4 mb-md-5">
            <header tag="header" role="tab" class="d-flex align-items-center">
                <div v-if="!loading" class="bg-white rounded px-4 py-3 mr-4">
                    <b-img :src="product.image" :alt="product.name" style="max-height: 81px"/>
                </div>
                <h2 class="mb-0">{{ loading ? '-' : product.name }}</h2>
            </header>
        </b-container>

        <b-container class="mb-4">
            <b-card no-body>
                <b-tabs content-class="p-4" fill>
                    <b-tab title="Deskripsi" title-link-class="py-3" active>
                        <HtmlContent v-if="!loading" :html="product.description"/>
                    </b-tab>
                    <b-tab title="S&K" title-link-class="py-3">
                        <HtmlContent v-if="!loading" :html="product.tnc"/>
                    </b-tab>
                    <b-tab title="Claim" title-link-class="py-3">
                        <HtmlContent v-if="!loading" :html="product.claim"/>
                    </b-tab>
                </b-tabs>
            </b-card>
        </b-container>

        <b-container class="mb-4">
            <b-card class="card-header-border-bottom" no-body>
                <b-card-header header-tag="header" role="tab" class="py-3">
                    <b-card-title>Fitur</b-card-title>
                </b-card-header>
                <b-card-body>
                    <div v-if="!loading" class="mb-3">
                        <strong>{{ product.feature[0].name }}</strong>
                        <b-card-text><HtmlContent :html="product.feature[0].description"/></b-card-text>
                    </div>
                    <div v-if="!loading && product.feature.length > 1">
                        <b-collapse id="collapse-feature">
                            <div v-for="feature in product.feature.slice(1, product.feature.length)" :key="feature" class="mb-3">
                                <strong>{{feature.name}}</strong>
                                <b-card-text><HtmlContent :html="feature.description"/></b-card-text>
                            </div>
                        </b-collapse>
                        <div v-b-toggle.collapse-feature class="text-primary font-weight-bold pointer">Lihat Selengkapnya</div>
                    </div>
                </b-card-body>
            </b-card>
        </b-container>

        <b-container v-if="condition.workshop" class="mb-4">
            <b-card class="bg-white p-4" no-body>
                <b-row>
                    <b-col cols="9">
                        <h4>{{product.workshop_count}} Bengkel Tersedia</h4>
                        <b-card-text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </b-card-text>
                    </b-col>
                    <b-col cols="3" class="d-flex justify-content-end align-items-center">
                        <a target='_blank' :href="product.workshop_file" class="btn btn-primary">Lihat</a>
                    </b-col>
                </b-row>
            </b-card>
        </b-container>

        <b-container v-if="condition.brochure" class="mb-4">
            <b-card class="bg-white p-4" no-body>
                <b-row>
                    <b-col cols="9" class="d-flex align-items-center">
                        <h4 class="mb-0">Brosur Produk</h4>
                    </b-col>
                    <b-col cols="3" class="d-flex justify-content-end align-items-center">
                        <a target='_blank' :href="product.brochure_file" class="btn btn-primary">Lihat</a>
                    </b-col>
                </b-row>
            </b-card>
        </b-container>

        <b-container>
            <BaseButton type="primary" block @click="detailPayment">Lanjut ke Pembayaran</BaseButton>
        </b-container>

        <Loading :show="loading"/>
    </div>
</template>

<script>
import HtmlContent from '../../../../components/HtmlContent'
import Loading from '../../../../components/Loading'
export default {
    components:{
        Loading,
        HtmlContent
    },
    data() {
        return {
            loading: true,
            id: null,
            product:{
                name: null,
                feature: null,
                description : null,
                image : null,
                tnc: null,
                claim: null,
                brochure_file: null,
                price: null,
                workshop_count: null,
                workshop_file: null
            },
            condition:{
                workshop:false,
                brochure:false
            }


        }
    },
    deactivated(){
        this.$destroy()
    },
    created(){
        // this.$destroy()
        this.id = this.$store.state.product_id
    },
    mounted(){
        this.getProduct()
    },
    methods:{
        async getProduct(){
            const self = this
            await this.$axios.$get(`api/product/detail?id=${this.id}`)
            .then ((response) => {
                this.product.name = response.data.name
                this.product.description = response.data.description
                this.product.feature = response.data.features
                this.product.image = response.data.image
                this.product.tnc = response.data.tnc
                this.product.claim = response.data.claim
                this.product.price = response.data.price
                if (response.data.brochure_file !== null){
                    this.product.brochure_file = response.data.brochure_file
                    this.condition.brochure = true
                }
                if (response.data.workshop_file !== null){
                    this.product.workshop_file = response.data.workshop_file
                    this.product.workshop_count = response.data.workshop_count
                    this.condition.workshop = true
                }

                this.loading = false

            }).catch (function () {
                self.$router.push({name: "produk-cari-mobil"})

            })
        },
        detailPayment() {
            this.$store.commit('setProductId',this.id)
            this.$router.push({name: "asuransi-mobil-polis-pembelian"})
        },
    }
}

</script>