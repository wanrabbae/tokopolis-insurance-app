<template>

    <div class="py-4 py-lg-5" style="background-color: #f6f5fc">

        <div class="container">

            <header class="mb-4 mb-lg-5">

                <h2>Asuransi Mobil</h2>

                <div class="text-dark-blue">Temukan asuransi yang cocok denganmu</div>

            </header>

            <div class="row mb-3 mb-lg-4">

                <div v-if="!mobileView" class="col-12 col-lg-4">

                   <div class="bg-secondary rounded border">

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

                </div> <!-- col-12.col-lg-4 ends -->

                <div class="col-12 col-lg-8">

                    <b-form class="mb-3 mb-lg-4">

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

                    <div v-if="mobileView" v-b-modal.modal-sort class="d-flex justify-content-between bg-secondary rounded border p-3 mb-3 mb-lg-4">

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

                            <div v-for="(product, i) in shownProducts" :key="product.id" class="position-relative mb-3 mb-lg-4">

                                <div class="bg-secondary rounded border" :class="{ 'blur-active' : blurActive(i) }">

                                    <div class="d-flex justify-content-between p-3">

                                        <BaseButton
                                            type="link"
                                            classes="text-left p-0"
                                            @click="isLoggedIn ? detailProduct(product.id) : openLoginModal(product.id)"
                                        >
                                            <span class="fs-lg-4 fw-bold text-dark">{{ product.name }}</span>
                                        </BaseButton>

                                        <span class="text-dark fw-bold">
                                            {{ formatPrice(product.price) }} / {{ product.period }}
                                        </span>

                                    </div>

                                    <div class="row px-3">

                                        <div  class="col-4 d-flex justify-content-center align-items-center">

                                            <b-img-lazy :src="product.image" :alt="product.name" style="max-height: 96px" />

                                        </div> <!-- col-4 ends -->

                                        <div class="col-8">

                                            <ul class="mb-1">

                                                <li v-for="(features, j) in product.features" :key="j">

                                                    <HtmlContent :html="features.name"/>

                                                </li>

                                            </ul>

                                            <!-- <BaseButton
                                                type="link"
                                                classes="text-primary fw-bold p-0"
                                                @click="isLoggedIn ? detailProduct(product.id) : openLoginModal(product.id)"
                                            >
                                                Selengkapnya
                                            </BaseButton> -->

                                        </div>  <!-- col-8 ends -->

                                    </div> <!-- card-body ends -->

                                    <div class="p-3 text-right">

                                        <b-form-checkbox
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
                                        </b-form-checkbox>

                                        <BaseButton  @click="isLoggedIn ? detailProduct(product.id) : openLoginModal(product.id)">
                                            Pilih Produk
                                        </BaseButton>

                                    </div> <!-- card-footer ends -->

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

        <div v-if="compareProducts.length > 0" class="comparison comparison-wrapper py-4">

            <div class="container">

                <div class="row justify-content-center no-gutters mb-3">

                    <div v-for="(product, i) in compareProducts" :key="i" class="col-6 col-lg-4">

                        <div class="card d-flex flex-row flex-lg-column justify-content-center align-items-center p-2 p-lg-3">

                            <div class="product-image d-flex justify-content-center align-items-lg-center my-lg-2">

                                <b-img :src="product.image" :alt="product.name" />

                            </div>

                            <div class="product-name ml-2 ml-lg-0 mb-lg-1">

                                <span class="fw-bold text-dark">{{ product.name }}</span>

                            </div>

                            <div v-if="!mobileView" class="d-block">

                                <span>{{ formatPrice(product.price) }} / {{ product.period }}</span>

                            </div>

                        </div> <!-- card ends -->

                    </div> <!-- col ends-->

                </div> <!-- row ends -->

                <div class="d-flex">

                    <BaseButton
                        :disabled="compareProducts.length < 2"
                        classes="mx-auto px-5 w-100 w-lg-auto"
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
import LoginModal from '../../../../components/LoginModal'
import CloseIcon from '../../../../assets/svg/close.svg'

export default {
    components: {
        Loading,
        HtmlContent,
        LoginModal,
        CloseIcon
    },
    props: {
        mobileView: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
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
            title: 'Asuransi Mobil - Pico Insurtech',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Deskripsi Halaman'
                }
            ]
        };
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
                console.log(response.data)
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
                        image: element.image,
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
                console.log(error)
                this.$router.push({name: "asuransi-mobil"})
            })
        },
        openLoginModal(productIndex) {
            this.productIndex = productIndex
            this.$bvModal.show('modal-guest-sign-in')
        },
        // async onSubmitLoginModal(event, formData) {
        //     // on submit guest sign in modal method here
        //     console.log(formData);

        //     await this.$axios.$post('api/guest', {
        //         fullname: formData.fullName,
        //         email: formData.email,
        //         phone: formData.phoneNumber,
        //     }).catch (error => {
        //         console.log(error)
        //     })

        //     this.$bvModal.hide('modal-guest-sign-in')
        //     this.detailPayment(this.productIndex)
        // }
    }
}
</script>