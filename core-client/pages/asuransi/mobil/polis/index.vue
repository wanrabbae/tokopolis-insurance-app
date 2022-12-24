<template>

    <div class="py-6" style="background-color: #f6f5fc">

        <div class="container">

            <header class="mb-4 mb-md-5">

                <h2>Asuransi Mobil</h2>

                <div class="text-dark-blue">Temukan asuransi yang cocok denganmu</div>

            </header>

            <div class="row mb-3 mb-md-4">

                <div class="d-none d-md-block col-12 col-md-4">

                   <div class="bg-white rounded border">

                        <div class="p-3 border-bottom">

                            <fa icon="sort" class="mr-3" style="font-size: 1rem"/>

                            <span class="fs-5">Urut Berdasarkan</span>

                        </div>

                        <b-form-radio-group
                            id="sort-by"
                            v-model="sortBy"
                            :options="sortOptions"
                            name="sort-by"
                            class="p-3"
                            stacked
                        />

                    </div> <!-- card ends -->

                </div> <!-- col-12.col-md-4 ends -->

                <div class="col-12 col-md-8">

                    <b-form class="mb-3 mb-md-4">

                        <b-input-group class="addon-combined">

                            <input
                                v-model="search"
                                placeholder="Cari Asuransi"
                                class="form-control"
                                required
                            >

                            <b-input-group-append>

                                <BaseButton type="icon" classes="px-3">
                                    <fa icon="magnifying-glass"/>
                                </BaseButton>

                            </b-input-group-append>

                        </b-input-group>

                    </b-form>

                    <div v-b-modal.modal-sort class="d-flex d-md-none justify-content-between bg-white rounded border p-3 mb-3 mb-md-4">

                        <span>Urut Berdasarkan</span>

                        <div class="d-inline-block">

                            <span class="fw-bold">{{ selectedSortOption.text }}</span>

                            <fa icon="sort" class="ml-2" style="font-size: 1rem"/>

                        </div>

                    </div>

                    <b-form>

                        <b-form-checkbox-group
                            id="selected-products"
                            v-model="productToCompare"
                            name="selected-products"
                        >

                            <div v-for="(product, i) in shownProducts" :key="product.id" class="position-relative mb-3 mb-md-4">

                                <div class="bg-white rounded border" :class="{ 'blur-active' : blurActive(i) }">

                                    <div class="row">
                                        <div class="col-6">
                                            <div class="d-flex justify-content-between p-3">

                                                <BaseButton
                                                    type="link"
                                                    classes="text-left p-0"
                                                    @click="isLoggedIn ? detailProduct(product.id) : openLoginModal(product.id)"
                                                >
                                                    <span class="fs-md-4 fw-bold text-dark">{{ product.name }}</span>
                                                </BaseButton>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="pt-3 text-right">
                                                <RekomendasiFlag></RekomendasiFlag>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row px-3">

                                        <div  class="col-4 d-flex justify-content-center align-items-center">

                                            <nuxt-img 
                                                preset="default"
                                                height="96"
                                                :src="product.image" 
                                                :alt="product.name" 
                                                loading="lazy"
                                            />

                                        </div> <!-- col-4 ends -->

                                        <div class="col-8">

                                            <ul class="mb-1">

                                                <li v-for="(features, j) in product.features" :key="j">

                                                    <HtmlContent :html="features.name"/>

                                                </li>

                                            </ul>

                                            <BaseButton
                                                type="link"
                                                classes="text-primary fw-bold p-0"
                                                @click="isLoggedIn ? detailProduct(product.id) : openLoginModal(product.id)"
                                            >
                                                Selengkapnya
                                            </BaseButton>

                                        </div>  <!-- col-8 ends -->

                                    </div> <!-- card-body ends -->

                                    <div class="row">
                                        <div class="col-7">
                                            <div class="p-3">
                                                <div>Premi Dasar</div>
                                                <div>
                                                    <span class="text-dark fw-bold" style="font-size: 11pt">
                                                        {{ formatPrice(product.price) }} / {{ product.period }}
                                                    </span>
                                                </div>
                                                <div>
                                                    Komisi {{ product.commission }}% <span class="text-dark fw-bold">{{ formatPrice((product.price * product.commission) / 100) }}</span> <br />
                                                </div>
                                                <div class="mt-1">
                                                    <span style="background-color: #E6F0FF; font-size: 8pt; color:#435A8C" class="p-1 mt-5 rounded">Extra Poin {{ product.extra_point }}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-5">
                                            <div class="p-3 text-right align-bottom">

                                                <!-- <b-form-checkbox
                                                    :value="product.id"
                                                    :disabled="disableProduct(product.id)"
                                                    @change="() => {
                                                        if(!isLoggedIn) {
                                                            productToCompare = [];
                                                            openLoginModal(product.id);
                                                        }
                                                    }"
                                                >
                                                    Bandingkan
                                                </b-form-checkbox> -->

                                                <BaseButton  @click="isLoggedIn ? detailProduct(product.id) : openLoginModal(product.id)">
                                                    Pilih Produk
                                                </BaseButton>

                                                </div> <!-- card-footer ends -->
                                        </div>
                                    </div>


                                    

                                </div>

                                <div v-if="blurActive(i)" class="blur-section d-flex flex-column justify-content-center align-items-center">

                                    <div class="mb-3">Ingin melihat produk asuransi lainnya?</div>

                                    <BaseButton tag="a" href="/login">
                                        Masuk terlebih dahulu
                                    </BaseButton>

                                </div> <!-- blur-section ends -->

                            </div> <!-- card ends -->

                        </b-form-checkbox-group>

                    </b-form>

                    <b-pagination
                        v-model="currentPage"
                        v-bind="paginationOptions"
                        @page-click="onPageClick"
                    />

                </div>

            </div>

            <FAQ :title="faq.title" :contents="faq.contents" />

        </div>

        <div v-if="compareProducts.length > 0" class="comparison-wrapper py-4">

            <div class="container">

                <div class="row justify-content-center no-gutters mx-n1 mb-3">

                    <div v-for="(product, i) in compareProducts" :key="i" class="col-6 col-md-4 px-1">

                        <div class="h-100 bg-white rounded p-2 p-md-3">

                            <div class="row no-gutters">
                                
                                <div class="col col-md-12 product-image mr-2 mr-md-0 mb-md-2">

                                    <nuxt-img 
                                        preset="default"
                                        :src="product.image" 
                                        :alt="product.name"
                                        sizes="md:32px lg:192px"
                                    />

                                </div>

                                <div class="col col-md-12 product-name text-left text-md-center">

                                    <span>{{ product.name }}</span>

                                </div>

                            </div>

                            <div class="d-none d-md-block text-center">
                            
                                {{ formatPrice(product.price) }} / {{ product.period }}
                            
                            </div>

                        </div> <!-- card ends -->

                    </div> <!-- col ends-->

                </div> <!-- row ends -->

                <div class="d-flex">

                    <BaseButton
                        :disabled="compareProducts.length < 2"
                        classes="mx-auto px-5 w-100 w-md-auto"
                        @click="comparePolis"
                    >
                        Bandingkan
                    </BaseButton>

                </div>

            </div> <!-- container ends -->

        </div> <!-- compare-wrapper ends-->

        <b-modal id="modal-sort" header-class="align-items-center" centered>

            <template #modal-header="{ close }">

                <h4 class="mb-0">Urut Berdasarkan</h4>

                <div class="pointer" @click="close">

                    <CloseIcon width="28px"/>

                </div>

            </template>

            <b-form-radio-group
                id="sort-by"
                v-model="sortBy"
                :options="sortOptions"
                name="sort-by"
                stacked
            />

            <template #modal-footer="{ ok }">

                <BaseButton block @click="ok()">Terapkan</BaseButton>

            </template>

        </b-modal>

        <LoginModal
            id="modal-guest-sign-in"
        />

        <Loading :show="loading"/>

    </div>

</template>

<script>
import HtmlContent from '../../../../components/HtmlContent'
import Loading from '../../../../components/Loading'
import LoginModal from '../../../../components/modals/LoginModal'
import CloseIcon from '../../../../assets/svg/close.svg'
import RekomendasiFlag from '../../../../components/RekomendasiFlag'

export default {
    components: {
        Loading,
        HtmlContent,
        LoginModal,
        CloseIcon,
        RekomendasiFlag
    },
    props: {
        mobileView: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            title: 'Asuransi Mobil',
            model: {
                brand: null,
                type: null,
                series: null,
                yearProduction: null,
                price: null,
                minPrice : null,
                maxPrice : null,
                usage: null,
                licensePlate: null,
                startDatePeriod: null,
                insurancePackage: null,
            },
            loading: true,
            search: null,
            sortBy: 'recommended',
            products: [],
            productToCompare: [],
            productIndex: -1,
            guestShownProductsLimit: 3,
            isLoggedIn : false,
            currentPage: 1,
            paginationOptions: {
                align: "center",
                disabled: !this.isLoggedIn,
                limit: 3,
                perPage: 6,
                totalSearchResult: 10,
            },
            sortOptions: [
                { text: 'Produk Rekomendasi', value: "recommended" },
                { text: 'Harga Tertinggi', value: "higher-price" },
                { text: 'Harga Terendah', value: "lower-price" }
            ],
            faq: {
                title: "FAQ Asuransi Mobil",
                contents: [
                    {
                        question: 'Apa itu asuransi mobil?',
                        answer: `
                                Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-
                                origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                                helvetica, craft beer labore wes anderson cred nesciunt sapiente
                                ea proident. Ad vegan excepteur butcher vice lomo.
                                `
                    },
                    {
                        question: 'Mengapa anda harus memiliki asuransi mobil?',
                        answer: `
                                Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-
                                origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                                helvetica, craft beer labore wes anderson cred nesciunt sapiente
                                ea proident. Ad vegan excepteur butcher vice lomo.
                                `
                    },
                    {
                        question: 'Apa saja keuntungan memiliki asuransi mobil?',
                        answer: `
                                Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-
                                origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                                helvetica, craft beer labore wes anderson cred nesciunt sapiente
                                ea proident. Ad vegan excepteur butcher vice lomo.
                                `
                    },
                    {
                        question: 'Apa saja jenis-jenis asuransi mobil yang tersedia?',
                        answer: `
                                Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-
                                origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                                helvetica, craft beer labore wes anderson cred nesciunt sapiente
                                ea proident. Ad vegan excepteur butcher vice lomo.
                                `
                    },
                    {
                        question: 'Istilah-istilah dalam asuransi mobil',
                        answer: `
                                Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-
                                origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                                helvetica, craft beer labore wes anderson cred nesciunt sapiente
                                ea proident. Ad vegan excepteur butcher vice lomo.
                                `
                    },
                    {
                        question: 'Dokumen apa saja yang perlu dipersiapkan sebelum melakukan claim?',
                        answer: `
                                Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-
                                origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                                helvetica, craft beer labore wes anderson cred nesciunt sapiente
                                ea proident. Ad vegan excepteur butcher vice lomo.
                                `
                    },
                    {
                        question: 'Syarat dan ketentuan refund',
                        answer: `
                                Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-
                                origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                                helvetica, craft beer labore wes anderson cred nesciunt sapiente
                                ea proident. Ad vegan excepteur butcher vice lomo.
                                `
                    },
                ]
            }
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    computed:{
        shownProducts() {
            if(this.isLoggedIn) {
                return this.products;
            } else {
                return this.products.slice(0, this.guestShownProductsLimit);
            }
        },
        compareProducts() {
            const result = this.shownProducts.filter(product => {
                return this.productToCompare.find(productId => {
                        return product.id === productId;
                    });
                });
            return result;
        },
        selectedSortOption() {
            return this.sortOptions.find( option => option.value === this.sortBy );
        }
    },
    deactivated(){
        this.$destroy()
    },
    created(){
        this.model = this.$route.params.data
    },
    mounted(){
        this.getProductList()
    },
    methods: {
        detailProduct(id) {
            this.$store.commit('setProductId',id)
            this.$router.push({name: "asuransi-mobil-polis-detail-polis"})
        },
        detailPayment(id) {
            this.$store.commit('setProductId',id)
            this.$router.push({name: "asuransi-mobil-polis-pembelian"})
        },
        comparePolis(){
            this.$store.commit('setSelectedId',this.productToCompare)
            this.$router.push({name: "asuransi-mobil-polis-komparasi"})
        },
        // blur produk paling akhir dari produk yang ditampilkan
        blurActive(index) {
            return !this.isLoggedIn && index === this.shownProducts.length - 1;
        },
        disableProduct(id) {
            if(this.mobileView && this.productToCompare.length < 2) return false;
            if(!this.mobileView && this.productToCompare.length < 3) return false;

            return !this.productToCompare.find(productId => {
                return id === productId;
            });
        },
        onPageClick(event, page) {
            this.loading = true
            this.getProductList(page)
        },
        async getProductList(page){
            const param = () => {
                if (this.model !== null && this.model !== undefined)
                    return {
                        page,
                        year: this.model.yearProduction,
                        brand: this.model.brand,
                        model: this.model.type,
                        sub_model: this.model.series,
                        price: this.model.price,
                        plate: this.model.licensePlate,
                        protection: this.model.insurancePackage,
                        use: this.model.usage,
                        start_date: this.model.startDatePeriod,
                        acc: this.model.accessories
                    }

                return { page }
            }

            await this.$axios.$get('api/product', {
                params: param()
            }).then ((response) => {
                this.products = []

                if(response.data.pagination != null){
                    this.isLoggedIn = true
                    this.paginationOptions.totalSearchResult = response.data.pagination.total
                    this.paginationOptions.perPage = response.data.pagination.per_page
                } else {
                    this.isLoggedIn = false
                }

                response.data.data.forEach(element => {
                    this.products.push({
                        id: element.id,
                        name: element.name,
                        description : element.description,
                        price: element.price,
                        commission: element.commission,
                        extra_point: element.extra_point,
                        image: this.$config.serverURL + element.image,
                        tnc: element.tnc,
                        period: "Tahun",
                        claim: element.claim,
                        features: element.features,
                        brochure_file : element.brochure_file,
                        workshop_file : element.workshop_file,
                        workshop_count : element.workshop_count
                    })
                })

                this.loading = false
            }).catch (error => {
                if(error.response.status === 400){
                    this.$router.push({name: "asuransi-mobil"})
                }
            })
        },
        openLoginModal(productIndex) {
            this.productIndex = productIndex
            this.$bvModal.show('modal-guest-sign-in')
        },
    }
}
</script>