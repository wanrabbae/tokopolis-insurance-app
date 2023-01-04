<template>

    <div class="py-6" style="background-color: #f6f5fc">

        <main role="main" class="container">

            <h2 class="mb-4">{{ loading ? '-' : product.name }}</h2>

            <div class="row">

                <div class="col-12 col-md-8 mb-4 mb-md-0">

                    <div class="card border mb-4">

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

                    </div>

                    <div class="card border mb-4">

                        <div class="card-header border-bottom py-3">

                            <div class="fs-4 fw-bold">Fitur</div>

                        </div>

                        <div class="card-body">

                            <div v-if="!loading">

                                <div class="fw-bold mb-1">{{ product.feature[0].name }}</div>

                                <HtmlContent :html="product.feature[0].description"/>

                                <b-collapse v-if="product.feature.length > 1" id="feature-collapse" v-model="model.feature_collapse_visible">

                                    <div v-for="(feature, i) in product.feature.slice(1, product.feature.length)" :key="i" class="mb-3">

                                        <div class="fw-bold mb-1">{{ feature.name }}</div>

                                        <HtmlContent :html="feature.description"/>

                                    </div>

                                </b-collapse>

                                <span
                                    class="text-primary fw-bold pointer"
                                    :aria-expanded="model.feature_collapse_visible ? 'true' : 'false'"
                                    aria-controls="feature-collapse"
                                    @click="model.feature_collapse_visible = !model.feature_collapse_visible"
                                >
                                    {{ model.feature_collapse_visible ? 'Lebih Sedikit' : 'Selengkapnya' }}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div v-if="condition.workshop" class="card border mb-4">

                        <div class="card-body d-flex justify-content-between align-items-center py-3">

                            <div class="d-block">

                                <div class="fs-4 fw-bold mb-2">{{product.workshop_count}} Bengkel Tersedia</div>

                                <div class="d-block">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>

                            </div>

                            <BaseButton tag="a" target='_blank' :href="product.workshop_file">Lihat</BaseButton>

                        </div>

                    </div>

                    <div class="card border mb-4">

                        <div class="card-body d-flex justify-content-between align-items-center py-3" :class="{['border-bottom']: model.expansionData.length > 0}">

                            <div class="fs-4 fw-bold">Perluasan Resiko Tambahan</div>

                            <fa v-b-modal.expansion-modal icon="circle-plus" class="text-primary pointer" style="font-size: 2rem"/>

                        </div> <!-- card-body ends -->

                        <div v-if="model.expansionData.length > 0" class="card-body py-3">

                            <ul  class="list-unstyled mb-3">

                                <li v-for="(expansion, i) in model.expansionData" :key="i" class="d-flex justify-content-between">
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

                    <div v-if="isAgent()" class="card border">

                        <div class="card-body d-flex justify-content-between align-items-center py-3" :class="{['border-bottom']: addDiscount}">

                            <div class="fs-4 fw-bold">Beri Diskon</div>

                            <div v-if="addDiscount">

                                <BaseButton classes="mr-1" @click="submitDiscount">{{ discount ? 'Ubah' : 'Terapkan' }}</BaseButton>

                                <BaseButton type="white" classes="text-primary border-primary" @click="toggleAddDiscount">Batal</BaseButton>

                            </div>

                            <BaseButton v-else @click="toggleAddDiscount">Tambahkan</BaseButton>

                        </div>

                        <div v-if="addDiscount" class="card-body py-3">

                            <div class="form-row">

                                <div class="col-12 col-md-auto mb-3 mb-md-0">

                                    <b-form-radio-group
                                        v-model="model.discountType"
                                        :options="[
                                            { text: 'Nominal', value: 'amount' },
                                            { text: 'Persen', value: 'percent' }
                                        ]"
                                        buttons
                                        button-variant="primary"
                                        @change="onDiscountTypeChange"
                                    />

                                </div>

                                <BaseInputPrice
                                    v-if="model.discountType === 'amount'"
                                    v-model="model.discountAmount"
                                    name="Nominal Diskon"
                                    :rules="{ price_between: [formatPrice(0), formatPrice(maxDiscount)] }"
                                    :placeholder="'Maksimum ' + formatPrice(maxDiscount, 'id-ID', 'decimal')"
                                    currency="IDR"
                                    class="col-12 col-md mb-0"
                                    :disabled="!addDiscount && discount"
                                    @blur="onBlurDiscount"
                                />

                                <BaseInput
                                    v-if="model.discountType === 'percent'"
                                    v-model="model.discountPercentage"
                                    type="number"
                                    name="Persentase Diskon"
                                    :rules="{ percent_between: [0, 100 * maxPercentageDiscount]}"
                                    :placeholder="'Maksimum ' + 100 * maxPercentageDiscount"
                                    input-classes="custom-number"
                                    suffix-text="%"
                                    class="col-12 col-md mb-0"
                                    :disabled="!addDiscount && discount"
                                    @blur="onBlurDiscount"
                                />

                            </div>

                        </div> <!-- card-body.row ends -->

                    </div> <!-- card ends -->

                </div> <!-- col-12.col-md-8 ends -->

                <div class="col-12 col-md-4">

                    <div class="card border p-3">

                        <div class="d-block mb-3">

                            <div class="d-flex justify-content-between mb-2">
                                <span>Premi Dasar</span>
                                <span class="fw-bold text-primary">{{ formatPrice(product.price) }}</span>
                            </div>

                            <div v-if="totalExpansionPrice" class="d-flex justify-content-between mb-2">
                                <span>Perluasan Resiko Tambahan</span>
                                <span class="fw-bold text-primary">{{ formatPrice(totalExpansionPrice) }}</span>
                            </div>

                            <div v-if="discount" class="d-flex justify-content-between mb-2">
                                <span class="fw-bold">Diskon</span>
                                <span class="fw-bold text-primary">{{ formatPrice(-discount) }}</span>
                            </div>

                            <div class="d-flex justify-content-between mb-2">
                                <span class="fw-bold">Biaya Admin</span>
                                <span class="fw-bold text-primary">{{ formatPrice(model.adminFee) }}</span>
                            </div>

                            <div class="d-flex justify-content-between mb-2">
                                <span class="fw-bold">Biaya Materai</span>
                                <span class="fw-bold text-primary">{{ formatPrice(model.stampFee) }}</span>
                            </div>

                            <div role="separator" class="py-3">
                                <div class="border-bottom"></div>
                            </div>

                            <div class="d-flex justify-content-between">
                                <span class="fw-bold">Total Premi yang Dibayar</span>
                                <span class="fw-bold text-primary">{{ formatPrice(totalPrice) }}</span>
                            </div>

                        </div>

                        <BaseButton v-if="isAgent()" type="white" classes="text-primary border-primary mb-1"
                            block @click="openInsuranceDetailModal">Buat Penawaran</BaseButton>

                        <BaseButton block @click="postData">Beli Sekarang</BaseButton>

                    </div> <!-- card ends -->

                </div> <!-- sidebar ends -->

            </div> <!-- row ends -->

        </main> <!-- main ends -->

        <ExpansionModal
            id="expansion-modal"
            :fields="expansionFields"
            @change="expansionModalFieldChangeHandler"
            @close="expansionModalCloseHandler"
            @submit="expansionModalSubmitHandler"
        />
        <InsuranceDetailModal
            id="modal-insurance-details"
            @submit="insuranceDetailModalSubmitHandler"
        />

        <Loading :show="loading"/>

    </div>

</template>

<script>
import BaseInputPrice from '../../../../components/Inputs/BaseInputPrice'
import BaseInput from '../../../../components/Inputs/BaseInput'
import ExpansionModal from '../../../../components/modals/ExpansionModal'
import InsuranceDetailModal from '../../../../components/modals/InsuranceDetailModal'
import Loading from '../../../../components/Loading'
import HtmlContent from '../../../../components/HtmlContent'

export default {
    components:{
        HtmlContent,
        BaseInputPrice,
        BaseInput,
        ExpansionModal,
        InsuranceDetailModal,
        Loading
    },
    data() {
        return {
            title: 'Detail Polis',
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
            model:{
                adminFee: 0,
                stampFee: 0,
                discountAmount: 0,
                discountPercentage: null,
                discountType: 'amount',
                feature_collapse_visible: false,
                expansionData: [],
                exp:null
            },
            insuranceDetail:[],
            maxPercentageDiscount: .25, // 25%
            discount: 0,
            addDiscount: false,
            expansionFields: [],
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    computed: {
        totalExpansionPrice() {
            let totalExpPrice = 0;

            this.model.expansionData.forEach((exp) => {
                totalExpPrice += exp.price;
            });

            return totalExpPrice;
        },
        totalPrice() {
            return this.product.price + this.totalExpansionPrice + this.model.adminFee + this.model.stampFee - this.discount;
        },
        maxDiscount() {
            return (this.product.price + this.totalExpansionPrice) * this.maxPercentageDiscount;
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
                        disabled: element.name === 'terorism',
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
                this.product.name = response.data.name
                this.product.description = response.data.description
                this.product.feature = response.data.features
                this.product.image = response.data.image
                this.product.tnc = response.data.tnc
                this.product.claim = response.data.claim
                this.product.price = response.data.price
                this.model.adminFee = response.data.admin_fee
                this.model.stampFee = response.data.stamp_fee
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
        async getAdminFee() {
            await this.$axios.$get(`api/transaction/fee/admin`)
                .then ((response) => {
                    this.model.adminFee = response.data.fee
                })
        },
        expansionModalFieldChangeHandler(field) {
            if(field.key === 'srcc')
            {
                if(field.checked)
                {
                    this.expansionFields = this.expansionFields.map(el => el.key === 'terorism' ? { ...el,  disabled: false } : el);
                } else {
                    this.expansionFields = this.expansionFields.map(el => el.key === 'terorism' ? { ...el,  disabled: true, checked: false } : el);
                }
            }
        },
        expansionModalCloseHandler(data) {
        },
        expansionModalSubmitHandler(data) {
            this.model.expansionData = data
        },
        insuranceDetailModalSubmitHandler(data){
            this.insuranceDetail = data
            this.doOffer()
        },
        toggleAddDiscount() {
            this.addDiscount = !this.addDiscount;

            if(!this.addDiscount) {
                this.discount = 0;
            }
        },
        onDiscountTypeChange() {
            if(this.model.discountType === 'amount') {
                this.model.discountAmount = null
            } else if(this.model.discountType === 'percent') {
                this.model.discountPercentage = null
            }

            this.discount = 0
        },
        onBlurDiscount() {
            if(!this.model.discountAmount || !this.model.discountPercentage)
                this.discount = 0

            if(this.model.discountType === 'amount') {
                const value = this.formatNumber(this.model.discountAmount)
                this.model.discountAmount = this.formatPrice(this.limit(value, 0, this.maxDiscount), 'id-ID', 'decimal')
            } else if(this.model.discountType === 'percent') {
                this.model.discountPercentage = this.limit(this.model.discountPercentage, 0, 25)
            }
        },
        submitDiscount() {
            if(!this.model.discountAmount || !this.model.discountPercentage)
                this.discount = 0

            if (this.model.discountType === 'amount') {
                this.discount = this.formatNumber(this.model.discountAmount)
            } else if(this.model.discountType === 'percent') {
                this.discount = (this.product.price + this.totalExpansionPrice) *
                    (this.model.discountPercentage / 100)
            }
        },
        postData() {
            const self = this
            this.getExpansionData()

            const discountType = this.model.discountType

            this.$axios.$post(`api/transaction/temp`, {
                product_id: this.id,
                exp: this.model.exp,
                discount_format: discountType,
                discount_value: discountType === 'amount' ? this.discount :
                    this.model.discountPercentage
            })
            .then(function(response) {
                self.$store.commit('setProductId', self.id)
                self.$router.push({name: "asuransi-mobil-polis-pembelian"})
            })
        },
        openInsuranceDetailModal(){
            this.$bvModal.show('modal-insurance-details')
        },
        doOffer() {
            const self = this
            const discountType = this.model.discountType

            this.getExpansionData()
            this.$axios.$post(`api/transaction/offer`, {
                fullname:this.insuranceDetail.name,
                phone:this.insuranceDetail.phone,
                email:this.insuranceDetail.email,
                product_id: this.id,
                exp: this.model.exp,
                discount_format: discountType,
                discount_value: discountType === 'amount' ? this.discount :
                    this.model.discountPercentage
            })
            .then(function(response) {
                const redirectURL = self.$config.nodeEnv === 'development' ? self.$config.apiURL :
                    self.$config.serverURL

                window.open(`${redirectURL}/quotation/${response.data.transaction_id}.pdf`, '_blank')
                self.$router.push({
                    name: "asuransi-mobil-polis-pembelian",
                    query: { id: response.data.transaction_id }
                })
            })
        },
        getExpansionData(){
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
        }
    }
}
</script>
