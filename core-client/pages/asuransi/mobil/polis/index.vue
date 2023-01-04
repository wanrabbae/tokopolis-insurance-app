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

                    <div v-if="!shownProducts.length" class="text-center">
                        <b-img center src="/img/box.png" alt="No Polis" width="100px" style="max-height: 160px" />
                        <p>Belum Ada Polis</p>
                    </div>

                    <b-form>

                        <b-form-checkbox-group
                            id="selected-products"
                            v-model="productToCompare"
                            name="selected-products"
                        >

                            <div v-for="(product, i) in shownProducts" :key="product.id" class="position-relative mb-3 mb-md-4">

                                <div class="bg-white rounded border" :class="{ 'blur-active' : blurActive(i) }">

                                    <div class="d-flex justify-content-between p-3">

                                        <BaseButton
                                            type="link"
                                            classes="text-left p-0"
                                            @click="isLoggedIn ? detailProduct(product.id) : openLoginModal(product.id)"
                                        >
                                            <span class="fs-md-4 fw-bold text-dark">{{ product.name }}</span>
                                        </BaseButton>

                                        <!-- <span class="text-dark fw-bold">
                                            {{ formatPrice(product.price) }} / {{ product.period }}
                                        </span> -->

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

                                    <div class="p-3">
                                        <div>Premi Dasar</div>
                                        <div class="fw-bold"><h4>{{ formatPrice(product.price) }}</h4></div>
                                        <div v-if="isAgent() && product.commission != 0">Komisi {{ product.commission }}%
                                            <span class="fw-bold">{{ formatPrice(product.price * product.commission / 100) }}</span>
                                        </div>
                                        <div v-if="isAgent() && product.extra_point != 0" class="mt-1" style="width: fit-content;
                                            padding: 7px 11px;
                                            background: #e3f6ff;
                                            color: #5f668d;
                                            border-radius: 3px;">
                                            <fa :icon="'star'" class="me-2"/> Extra Poin {{ product.extra_point }}%: <span class="fw-bold">{{ (product.price * product.extra_point / 100000).toFixed(0) }} Poin</span>
                                        </div>

                                        <div class="text-right">
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

                    <b-pagination v-if="shownProducts.length"
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
                                Salah satu bentuk proteksi finasial atas aset mobil anda atas kejadian yang tidak diinginkan sehingga 
                                mengakibatkan pengeluaran tak terduga yang besar akibat perbaikan mobil anda di bengkel.
                                `
                    },
                    {
                        question: 'Mengapa anda harus memiliki asuransi mobil?',
                        answer: `
                                Bagi anda yang memiliki mobil, selayaknnya anda lengkapi dengan asuransi mobil 
                                untuk menghindari biaya kerugian yang timbul atas kejadian tak terduga seperti 
                                kecelakaan beraibat kerusakan mobil.
                                `
                    },
                    {
                        question: 'Apa saja keuntungan memiliki asuransi mobil?',
                        answer: `
                                Tidak ada rasa khawatir, jaminan perbaikan mobil jika terjadi kejadian tidak 
                                diinginkan, transafer risiko ke perusahaan asuransi, jaringan bengkel tersebar 
                                seluruh Indonesia.
                                `
                    },
                    {
                        question: 'Apa saja jenis-jenis asuransi mobil yang tersedia?',
                        answer: `
                                Comprehensive (Jaminan risiko kerusakan sebagian) & Total Loss Only / TLO 
                                (Jaminan risiko kerusakan total atau min 75% dari harga kendaraan).
                                `
                    },
                    {
                        question: 'Apa saja syarat dokumen yang disiapkan untuk pengajuan asuransi mobil?',
                        answer: `
                                Mobil Baru : Scan copy KTP dan BASTK Mobil <br>
                                Mobil Bekas : Scan copy KTP,  STNK, Foto Kendaraan tampak depan-belakang-kanan-kiri-dashboard.
                                `
                    },
                    {
                        question: 'Siapa saja asuransi yang rekanan dengan Tokopolis?',
                        answer: `
                                Tugu Insurance, Asuransi Astra (Garda Oto), Zurich Insurance, Asuransi Bintang.
                                `
                    },
                    {
                        question: 'Apakah saya bisa mengajukan asuransi mobil apabila mobil saya tergolong tua?',
                        answer: `
                                Tidak Bisa, Maksimal usia kendaraan yang dapat diasuransikan adalah 10 (sepuluh) tahun.
                                `
                    },
                    {
                        question: 'Apakah semua risiko sudah dilindungi dengan asuransi mobil comprehensive?',
                        answer: `
                                Ya, kecuali resiko yang dikecualikan dalam polis asuransi kendaraan bermotor. 
                                Kami sarankan dapat membaca wording PSAKBI (Polis Standar Asuransi Kendaraan Bermotor Indonesia).
                                `
                    },
                    {
                        question: 'Bagaimana perhitungan tarif asuransi mobil?',
                        answer: `
                                Perhitungan menggunakan rate batas bawah OJK.
                                `
                    },
                    {
                        question: 'Apa saja jenis perluasan asuransi mobil?',
                        answer: `
                                Asuransi dapat diperluas dengan menambah perluasan risiko seperti Kerusuhan, 
                                Huru Hara, Banjir, Gempa Bumi, Tuntutan Pihak Ketiga, Kecelakaan Diri Pengemudi 
                                dan Penumpang.
                                `
                    },
                    {
                        question: 'Apa yang dimaksud dengan loading fee/loading rate dan bagaimana cara menghitungnya?',
                        answer: `
                                Loading fee/loading rate akan dikenakan sebesar 5% (dari rate standar OJK) per 
                                tahunnya untuk kendaraan dengan usia di atas 5 (lima) tahun.
                                `
                    },
                    {
                        question: 'Dokumen apa saja yang perlu saya siapkan sebelum melakukan klaim dan bagaimana cara mengajukan claim?',
                        answer: `
                                Dokumen yang perlu disiapkan yaitu scan copy KTP, polis asuransi dan foto kerusakan kendaraan, 
                                selanjurnya silahkan mengisi form laporan claim pada web app kami tokopolis.id.
                                `
                    },
                    {
                        question: 'Jika ada kesalahan pengisian, apakah saya dapat melakuka  perbaikan nama, alamat, atau keterangan detil kendaraan?',
                        answer: `
                                Bisa, melalui pengajuan endorsement ditujukan ke email cs@tokopolis.id atau hubungi contact center kami.
                                `
                    },
                    {
                        question: 'Apakah saya dapat menambahkan perluasan risiko lagi, ketika polis sudah terbit?',
                        answer: `
                                Bisa, syarat dilakukan desk survey (melampirkan foto kendaraan) dan biasanya dikenakan tambahan premi. 
                                Adapun pengajuan endorsement ditujukan ke email cs@tokopolis.id atau hubungi contact center kami.
                                `
                    },
                    {
                        question: 'Apakah saya dapat mengubah tanggal aktif atau periode polis saya?',
                        answer: `
                                Tidak bisa berdasarkan kebijakan Asuransi.
                                `
                    },
                    {
                        question: 'Apakah polis yang sudah saya beli dapat dibatalkan dan bagaimana caranya?',
                        answer: `
                                Dokumen yang perlu disiapkan yaitu scan copy KTP, dan pengajuan pembatalan secara tertulis disertai alasan, 
                                selanjurnya ditujukan ke email cs@tokopolis.id atau hubungi contact center kami.
                                `
                    },
                    {
                        question: 'Apakah saya dapat menerima refund atas pembatalan polis yang dibatalkan?',
                        answer: `
                                Kebijakan atau perhitungan pengembalian dana refund akan disampaikan setelah mendapatkan konfirmasi dari 
                                pihak Asuransi.
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
                        image: this.$config.serverURL + element.image,
                        commission: element.commission,
                        extra_point: element.extra_point,
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