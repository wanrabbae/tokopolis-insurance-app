<template>

    <div class="py-4 py-lg-5" style="background-color: #f6f5fc">

        <main role="main" class="container">

            <h2 class="mb-4">{{ loading ? '-' : product.name }}</h2>

            <div class="row">

                <div class="col-12 col-lg-8">

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
                        <b-card class="bg-secondary p-4" no-body>
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

                    <div class="card border mb-4">

                        <div class="card-body d-flex justify-content-between align-items-center py-3" :class="{['border-bottom']: model.expansionData.length > 0}">

                            <h3 class="mb-0">Perluasan Resiko Tambahan</h3>

                            <button v-b-modal.expansion-modal class="btn p-0">
                                <fa icon="circle-plus" class="text-primary pointer" style="font-size: 2rem"/>
                            </button>

                        </div> <!-- card-body ends -->

                        <div v-if="model.expansionData.length > 0" class="card-body py-3">

                            <ul  class="list-unstyled mb-3">
                                <li v-for="(expansion, index) in model.expansionData" :key="index" class="d-flex justify-content-between">
                                    <span>{{ expansion.label }}</span>
                                    <span class="fw-bold">{{ formatPrice(expansion.price) }}</span>
                                </li>
                            </ul>

                            <div class="d-flex justify-content-between">
                                <span class="text-primary fw-bold">Total</span>
                                <span class="fw-bold">{{ formatPrice(totalExpansionPrice) }}</span>
                            </div>

                        </div> <!-- card-body ends -->

                    </div> <!-- card ends -->

                    <div class="card border">

                        <div class="card-body d-flex justify-content-between align-items-center py-3" :class="{['border-bottom']: addDiscount}">

                            <h3 class="mb-0">Beri Diskon</h3>

                            <BaseButton v-if="!addDiscount" @click="toggleAddDiscount">Tambahkan</BaseButton>

                            <BaseButton v-else type="secondary" classes="text-primary border-primary" @click="toggleAddDiscount">Batal</BaseButton>

                        </div>

                        <div v-if="addDiscount" class="card-body py-3">

                            <BaseInput
                                v-model="model.discount"
                                name="Diskon"
                                input-group-classes="addon-combined"
                                placeholder="Maks Diskon Rp. 1.078.326"
                            >
                                <div slot="prepend">
                                    <BaseSelect
                                        v-model="model.selectedDiscountCurrency"
                                        :options="discountCurrencyOptions"
                                        input-classes="bg-transparent border-0"
                                    ></BaseSelect>
                                </div>
                            </BaseInput>

                        </div> <!-- card-body.row ends -->

                    </div> <!-- card ends -->

                </div> <!-- col-12.col-lg-8 ends -->

                <sidebar class="col-12 col-lg-4">

                    <div class="card border p-3">

                        <div class="d-block mb-3">

                            <div class="d-flex justify-content-between mb-2">
                                <span>Premi Dasar</span>
                                <span class="fw-bold text-primary">{{ formatPrice(product.price) }}</span>
                            </div>

                            <div class="d-flex justify-content-between">
                                <span>Biaya Admin</span>
                                <span class="fw-bold text-primary">Rp. 0</span>
                            </div>

                            <div role="separator" class="py-3">
                                <div class="border-bottom"></div>
                            </div>

                            <div class="d-flex justify-content-between">
                                <span class="fw-bold">Total</span>
                                <span class="fw-bold text-primary">{{ formatPrice(product.price) }}</span>
                            </div>

                        </div>

                        <BaseButton type="secondary" classes="text-primary border-primary mb-1" block>Buat Penawaran</BaseButton>

                        <BaseButton block @click="postData">Beli Sekarang</BaseButton>

                    </div> <!-- card ends -->

                </sidebar> <!-- sidebar ends -->

            </div> <!-- row ends -->

        </main> <!-- main ends -->

        <ExpansionModal
            id="expansion-modal"
            :fields="expansionFields"
            @close="expansionModalCloseHandler"
            @submit="expansionModalSubmitHandler"
        />

        <Loading :show="loading"/>

    </div>

</template>

<script>
import BaseInput from '../../../../components/Inputs/BaseInput'
import BaseSelect from '../../../../components/Inputs/BaseSelect'
import ExpansionModal from '../../../../components/ExpansionModal'
import Loading from '../../../../components/Loading'
import HtmlContent from '../../../../components/HtmlContent'


export default {
    components:{
        HtmlContent,
        BaseInput,
        BaseSelect,
        ExpansionModal,
        Loading
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
            },
            model: {
                discount: null,
                selectedDiscountCurrency: 'IDR',
                expansionData: [],
            },
            addDiscount: false,
            discountCurrencyOptions: [
                { text: "Rp.", value: "IDR" },
                { text: "$", value: "USD" },
            ],
            expansionFields: [],

        }
    },
    head() {
        return {
            title: 'Detail Polis - Pico Insurtech',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Deskripsi Halaman'
                }
            ]
        };
    },
    computed: {
        totalExpansionPrice() {
            let totalPrice = 0;

            this.model.expansionData.forEach((exp) => {
                totalPrice += exp.price;
            });

            return totalPrice;
        }
    },
     deactivated(){
        this.$destroy()
    },
    created(){
        this.id = this.$store.state.product_id
    },
    mounted(){
        this.getProduct()
        this.getExpansionDetail()
        console.log(this.product)
    },

    methods: {
        async getExpansionDetail(){
            // const self = this
            this.expansionFields = []
            await this.$axios.$get(`api/product/expansions?id=${this.id}`)
            .then ((response) => {
                response.data.forEach(element => {
                    const expansionField = {
                        key: element.name,
                        label: element.label,
                        checked : false,

                    }
                    if ( element.premium != null && element.premium !== undefined){
                        const price = element.premium.price
                        expansionField.price = price
                    }
                    if ( element.premiums != null && element.premiums !== undefined){
                        expansionField.selectedProtectionValues = null
                        expansionField.protectionValues = []

                        const option  = Object.entries(element.premiums)
                        option.forEach(e => {
                            expansionField.protectionValues.push({
                                text: e[1].value,
                                value: e[1].price
                            })

                        });
                    }
                    if(element.name ==="pap"){
                        expansionField.selectedNumOfPeople = 1
                        expansionField.numOfPeople = [1,2,3,4]
                    }

                    this.expansionFields.push(expansionField)
                });


            }).catch (function () {
                console.log(this.expansionFields)
            })
        },
        async getProduct(){
            const self = this
            await this.$axios.$get(`api/product/detail?id=${this.id}`)
            .then ((response) => {
                console.log(response)
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
        toggleAddDiscount() {
            this.addDiscount = !this.addDiscount;
        },
        expansionModalCloseHandler(data) {
            console.log(data)

            // put any code here
        },
        expansionModalSubmitHandler(data) {
            console.log(data)

            // put any code here
            this.model.expansionData = data
        },
        postData() {
            const self = this

            this.model.exp = []

            if(this.model.expansionData.length > 0){
                this.model.expansionData.forEach((exp) => {
                    const code = exp.key
                    const str = exp.selectedValue
                    const count = exp.numOfPeople
                    if(str !== undefined){
                        const limit = str/1000000
                        if(count !== undefined){
                            const clc = code + "," + limit + "," + count
                            return this.model.exp.push(clc)

                        }else{
                            const cl = code + "," + limit
                            return this.model.exp.push(cl)
                        }
                    }
                    this.model.exp.push(code)
                })
            }

            this.$axios.$post(`api/product`, {
                product_id: this.id,
                exp: this.model.exp
            })
            .then(function(response) {
                self.$store.commit('setProductId', self.id)
                self.$router.push({name: "asuransi-mobil-polis-pembelian"})
            })
        }
    }
}

</script>