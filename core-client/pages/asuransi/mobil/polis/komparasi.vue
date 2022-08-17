<template>

    <div class="py-4 py-lg-5" style="background-color: #f6f5fc">

        <div class="container">

            <div class="comparison comparison-table">

                <b-table-simple class="bg-secondary rounded border mb-3 mb-lg-4">

                    <b-tr>

                        <b-td v-if="!mobileView" :class="`col-lg-${ 12 / (products.length + 1) }`"></b-td>

                        <b-td v-for="(product, i) in productsToCompare" :key="i" :class="`col-4 col-lg-${ 12 / (productsToCompare.length + 1) }`" class="text-center border-left">

                            <div class="product-image d-inline-flex justify-content-center align-items-center my-2">

                                <b-img :src="product.image" :alt="product.name" />

                            </div>

                            <div class="product-name mb-1">

                                <span class="fw-bold text-dark">{{ product.name }}</span>

                            </div>

                            <b-card-text class="product-price mb-2">{{ formatPrice(product.price) }} / {{ product.period }}</b-card-text>

                            <BaseButton classes="w-100 w-lg-auto" @click="detailPayment(i)">Pilih Produk</BaseButton>

                        </b-td>

                    </b-tr>

                </b-table-simple>

                <b-table-simple v-if="!mobileView" class="bg-secondary rounded border">

                    <b-tr v-for="(field, i) in comparisonFields" :key="i">

                        <b-td :class="`col-lg-${ 12 / (productsToCompare.length + 1) }`" class="align-middle">

                            <span v-if="field.label" class="comparison-label">{{ field.label }}</span>

                        </b-td>

                        <b-td v-for="(product, j) in productsToCompare" :key="j" :class="`col-lg-${ 12 / (productsToCompare.length + 1) }`" class="text-center align-middle border-left">

                            <div v-if="field.key" class="d-block">

                                <span :class="product[field.key].status ? 'text-success' : 'text-danger'" style="font-size: 1rem;">
                                    <fa :icon="product[field.key].status ? 'circle-check' : 'circle-xmark'" />
                                </span>

                            </div>

                            <div v-if="field.key && product[field.key].description" class="d-block">

                                <span>{{ product[field.key].description }}</span>

                            </div>

                        </b-td>

                    </b-tr>

                </b-table-simple>

                <div v-else class="d-block">

                    <b-table-simple v-for="(field, i) in comparisonFields" :key="i" class="bg-secondary rounded border">

                        <b-tr>

                            <b-td colspan="2" class="text-center align-middle">

                                <div class="d-block">

                                    <span v-if="field.label" class="comparison-label">{{ field.label }}</span>

                                </div>

                            </b-td>

                        </b-tr>

                        <b-tr>

                            <b-td v-for="(product, j) in productsToCompare" :key="j" class="col-6 text-center align-middle border-left">

                                <div v-if="field.key" class="d-block">

                                    <span :class="product[field.key].status ? 'text-success' : 'text-danger'" style="font-size: 1rem;">
                                        <fa :icon="product[field.key].status ? 'circle-check' : 'circle-xmark'" />
                                    </span>

                                </div>

                                <div v-if="field.key && product[field.key].description" class="d-block">

                                    <span>{{ product[field.key].description }}</span>

                                </div>

                            </b-td>

                        </b-tr>

                    </b-table-simple>

                </div> <!-- d-block ends -->

            </div> <!-- comparison-table ends -->

        </div> <!-- container ends -->

        <Loading :show="loading"/>

    </div>

</template>

<script>
import Loading from '../../../../components/Loading'

export default {
    components: {
        Loading
    },
    props: {
        mobileView: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            title: 'Komparasi Asuransi Mobil',
            selectedProducts: null,
            comparisonFields: [
                {
                    key: 'era',
                    label: 'Emergency Road Assistance (ERA)'
                },
                {
                    key: 'ambulance',
                    label: 'Ambulance'
                },
                {
                    key: 'call_center',
                    label: 'Call Center'
                },
                {
                    key: 'tow',
                    label: 'Jasa Derek'
                },
                {
                    key: 'replace_vehicle',
                    label: 'Kendaraan Pengganti'
                },
                {
                    key: 'taxi_fare',
                    label: 'Pergantian Biaya Taksi'
                },
                {
                    key: 'nfo',
                    label: 'New For Old (6 Bulan)'
                },
                {
                    key: 'repair_warranty',
                    label: 'Garansi Perbaikan'
                },
                {
                    key: 'mobile_app',
                    label: 'Mobile App (Claim)'
                },
                {
                    key: 'to_workshop',
                    label: 'Antar jemput kendaraan ke bengkel'
                }
            ],
            products: [],
            loading: true
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    computed: {
        productsToCompare() {
            if(!this.mobileView) return this.products;

            if(this.products.length > 2) {
                return this.products.slice(0, 2);
            } else {
                return this.products;
            }
        }
    },
    deactivated(){
        this.$destroy()
    },
    created(){
        // this.$destroy()
        if(this.$store.state.selected_id == null){
            this.$router.push({name: "asuransi-mobil-polis"})
        }else{
            this.selectedProducts = this.$store.state.selected_id
        }
    },
    mounted(){
        this.getComparisonPolis()
    },
    methods: {
        detailPayment(index) {
            this.$store.commit('setProductId',this.products[index].id)
            this.$router.push({name: "asuransi-mobil-polis-pembelian"})
        },
        async getComparisonPolis(){
            const param = () => {
                if (this.selectedProducts !== null && this.selectedProducts !== undefined)
                    return {
                        product1: this.selectedProducts[0],
                        product2: this.selectedProducts[1],
                        product3: this.selectedProducts[2]
                    }
            }
            this.products = []

            await this.$axios.$get('api/product/compare', {
                params: param()
            }).then ((response) => {

                response.data.forEach(element => {
                    const product = {
                        id: element.id,
                        name: element.name,
                        image: element.image,
                        price: element.price,
                        period: 'tahun'
                    }
                    const features  = Object.entries(element.feature)
                    features.forEach(e => {
                        const key = e[0]
                        const value = e[1]
                        product[key] = value
                    });
                    this.products.push(product)
                    console.log(product)
                });
                this.loading = false

            }).catch (() => {
                    this.$router.push({name: "asuransi-mobil-polis"})
            })
        }
    }
}
</script>
