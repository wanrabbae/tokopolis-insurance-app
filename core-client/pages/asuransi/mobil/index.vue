<template>

    <div class="py-5 py-md-6" style="background-color: #f6f5fc">

        <main class="container mb-5 mb-md-6">

            <div class="insurance-search-wrapper bg-white rounded border">

                <div class="insurance-search-header row pt-4 px-4 pt-md-0 mb-3">

                    <div class="col-12 col-md-6">
                        
                        <h2 class="fs-3 fs-md-1 align-self-center mb-md-6">
                            Masukkan Detail Mobil untuk cari Asuransi
                        </h2>

                    </div>

                    <div class="col-6 d-none d-md-block">

                        <nuxt-img 
                            width="439" 
                            height="215" 
                            preset="default"
                            src="/svg/hero-car-insurance.svg"
                            alt="Hero Image - Car Insurance"
                            class="position-relative"
                            loading="lazy"
                        />

                    </div>

                </div>

                <b-form class="row pb-4 px-4" @submit.prevent="searchPolis">

                    <BaseSelect
                        v-model="model.yearProduction"
                        name="Tahun Produksi"
                        label="Tahun Produksi"
                        class="col-12 col-md-4"
                        :options="years"
                        :rules="{ required: true }"
                        required
                        @change="getBrandCar"
                    />

                    <BaseSelect
                        v-model="model.brand"
                        name="Merek Mobil"
                        label="Merek Mobil"
                        class="col-12 col-md-4"
                        :options="brandCar"
                        :rules="{ required: true }"
                        required
                        :disabled='!condition.brand'
                        @change="getTypeCar"
                    />

                    <BaseSelect
                        v-model="model.type"
                        name="Tipe Mobil"
                        label="Tipe Mobil"
                        class="col-12 col-md-4"
                        :options="typeCar"
                        :rules="{ required: true }"
                        required
                        :disabled='!condition.type'
                        @change="getSeriesCar"
                    />

                    <BaseSelect
                        v-model="model.series"
                        name="Seri Mobil"
                        label="Seri Mobil"
                        class="col-12 col-md-4"
                        :options="seriesCar"
                        :rules="{ required: true }"
                        required
                        :disabled='!condition.series'
                        @change="getPriceCar"
                    />

                    <BaseSelect
                        v-model="model.licensePlate"
                        name="Plat Nomor"
                        label="Plat Nomor"
                        class="col-12 col-md-4"
                        :options="plateCar"
                        :rules="{ required: true }"
                        required
                    />

                    <BaseSelect
                        v-model="model.usage"
                        name="Penggunaan Mobil"
                        label="Penggunaan Mobil"
                        class="col-12 col-md-4"
                        :options="userCar"
                        :rules="{ required: true }"
                        required
                    />

                    <div class="col-12 col-md-6 mb-3">

                        <BaseInputPrice
                            v-model="model.price"
                            name="Harga Mobil"
                            placeholder="Masukkan Harga Mobil"
                            currency="IDR"
                            :rules="{ required: true, price_between: [model.minPrice, model.maxPrice] }"
                            required
                            @blur="checkMinMaxPrice"
                        >

                            <template #label>

                                <div class="row">

                                    <div class="col-4 pr-0">

                                        <label class="form-control-label">Harga Mobil</label>

                                    </div> <!-- col-4 ends -->

                                    <div class="col-8 d-flex justify-content-end align-items-center text-right" style="font-size: 12px; color: #9a9b9c">

                                        {{ model.minPrice }} - {{ model.maxPrice }}

                                    </div> <!-- col-8 ends -->

                                </div> <!-- row ends -->

                            </template>

                        </BaseInputPrice>

                        <b-input-group>

                            <b-form-checkbox
                                v-model="model.addAccessories"
                                :disabled="formatNumber(model.price) == 0 || model.price == null"
                                @change="onAccessoriesCheckboxChange"
                            >
                                Tambahkan Aksesoris
                            </b-form-checkbox>

                        </b-input-group>

                    </div>

                    <BaseInput
                        v-if="model.accessories.length !== 0"
                        v-model="model.totalAccessoriesPrice"
                        label="Aksesoris"
                        class="col-12 col-md-6"
                        disabled
                    />

                    <div class="col-12">

                        <label class="form-control-label">Periode Asuransi</label>

                        <b-form-datepicker
                            v-model="model.startDatePeriod"
                            v-bind="calendarLabels"
                            locale="id"
                            :min="$dayjs().format('YYYY-MM-DD')"
                            :open-date="$dayjs().format('YYYY-MM-DD')"
                            class="w-md-50 mb-4"
                            placeholder="Pilih Tanggal Mulai"
                            nav-button-variant="primary"
                            :date-format-options="{ 'day': 'numeric', 'month': 'long', 'year': 'numeric' }"
                            hide-header
                            required
                        >

                            <template #button-content>

                                <CalendarIcon style="color:#FF7900; width: 1.4rem" />

                            </template>

                        </b-form-datepicker>

                    </div>

                    <b-form-group
                        v-slot="{ ariaDescribedby }"
                        label="Pilih Paket Asuransi"
                        label-class="custom-label"
                        class="col-12 mb-0"
                    >

                        <b-form-radio-group
                            id="insurance-package"
                            v-model="model.insurancePackage"
                            :aria-describedby="ariaDescribedby"
                            class="row"
                        >

                            <div class="col-12 col-md-6 mb-4">

                                <div class="rounded border p-3">

                                    <b-form-radio
                                        value="comprehensive"
                                        :disabled="!condition.comprehensive"
                                    >

                                        <div class="mb-2">

                                            <span class="fw-bold">Komprehensif</span>

                                        </div>

                                        <div class="row">

                                            <div class="col-12 col-md-4 d-none d-md-block">

                                                <nuxt-img 
                                                    preset="default"
                                                    sizes="lg:122px" 
                                                    src="/svg/car-insurance-comprehensive.svg"
                                                    alt="Asuransi Komprenhensif"
                                                    loading="lazy" 
                                                />

                                            </div> <!-- col-12.col-md-8 ends -->

                                            <div class="col-12 col-md-8">

                                                <span>Menjamin segala jenis kerusakan pada mobil Anda termasuk kerusakan ringan, berat maupun kehilangan total akibat pencurian.</span>

                                            </div> <!-- col-12.col-md-4 ends -->

                                        </div> <!-- row ends -->

                                    </b-form-radio>

                                </div> <!-- rounded.border ends -->

                            </div> <!-- col-12.col-md-6 ends -->

                            <div class="col-12 col-md-6 mb-4">

                                <div class="rounded border p-3">

                                    <b-form-radio
                                        value="tlo"
                                        :disabled="!condition.tlo"
                                    >

                                        <div class="mb-2">

                                            <span class="fw-bold">Kerugian Total / TLO</span>

                                        </div>

                                        <div class="row">

                                            <div class="col-12 col-md-4 d-none d-md-block">

                                                <nuxt-img 
                                                    preset="default"
                                                    sizes="lg:122px" 
                                                    src="/svg/car-insurance-total-loss-only.svg"
                                                    alt="Asuransi Kerugian Total / TLO (Total Loss Only)"
                                                    loading="lazy" 
                                                />

                                            </div> <!-- col-12.col-md-4 ends -->

                                            <div class="col-12 col-md-8">

                                                <span>Menjamin kerugian/kerusakan di mana biaya perbaikan ≥ 75% dari harga mobil termasuk kehilangan total akibat pencurian.</span>

                                            </div> <!-- col-12.col-md-8 ends -->

                                        </div> <!-- row ends -->

                                    </b-form-radio>

                                </div> <!-- rounded.border ends -->

                            </div> <!-- col-12.col-md-6 ends -->

                        </b-form-radio-group>  <!-- row ends -->

                    </b-form-group>

                    <div class="col-12">

                        <BaseButton
                            native-type="submit"
                            :disabled="model.insurancePackage === null || model.licensePlate === null || model.usage === null || model.startDatePeriod === null"
                            block
                        >
                            Cari
                        </BaseButton>

                    </div>

                </b-form> <!-- row ends -->

            </div> <!-- card ends -->

        </main> <!-- container ends -->

        <div class="container">

            <FAQ :title="faq.title" :contents="faq.contents" />

        </div>

        <AccessoriesModal
            id="modal-accessories"
            :fields="accessoriesFields"
            :max-price="maxAccessoriesPrice"
            @close="modalAccessoriesCloseHandler"
            @submit="modalAccessoriesSubmitHandler"
        />

    </div>

</template>

<script>

import BaseInput from '../../../components/Inputs/BaseInput'
import BaseInputPrice from '../../../components/Inputs/BaseInputPrice'
import BaseSelect from '../../../components/Inputs/BaseSelect'
import AccessoriesModal from '../../../components/AccessoriesModal'
import CalendarIcon from '../../../assets/svg/calendar.svg'

export default {
    components: {
        BaseInput,
        BaseInputPrice,
        BaseSelect,
        AccessoriesModal,
        CalendarIcon
    },
    data () {
        return {
            title: 'Asuransi Mobil',
            promotionImages: [
                {
                    source: "img/promotion-banner-3.png",
                    alt: "Promotion Banner 3"
                },
            ],
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
                addAccessories: false,
                accessories: [],
                totalAccessoriesPrice: null
            },
            condition:{
                brand: false,
                type: false,
                series: false,
                comprehensive : false,
                tlo : false
            },
            years: [
                { text: 'Pilih', value: null },
            ],
            brandCar: [{ text: 'Pilih', value: null }, ],
            typeCar: [{ text: 'Pilih', value: null }, ],
            seriesCar: [{ text: 'Pilih', value: null }, ],
            userCar: [
                    { text: 'Pilih', value: null },
                    { text: 'PRIBADI', value: "private" },
                    { text: 'KOMERSIL', value: "agency" }
                    ],
            plateCar:[],
            accessoriesFields: [
                {
                    key: "windowTint",
                    label: "Kaca Film",
                    checked: false,
                },
                {
                    key: "soundSystem",
                    label: "Sound System",
                    checked: false
                },
                {
                    key: "autoCarpet",
                    label: "Karpet Mobil",
                    checked: false
                },
                {
                    key: "velgAndWheel",
                    label: "Velg dan Ban",
                    checked: false
                },
                {
                    key: "carSeat",
                    label: "Jok Mobil",
                    checked: false
                },
                {
                    key: "bodyKit",
                    label: "Body Kit",
                    checked: false
                },
                {
                    key: "others",
                    label: "Lainnya",
                    checked: false
                }
            ],
            accessories: [],
            calendarLabels: {
                labelPrevDecade: 'Dekade Sebelumnya',
                labelPrevYear: 'Tahun Sebelumnya',
                labelPrevMonth: 'Bulan Sebelumnya',
                labelCurrentMonth: 'Bulan Ini',
                labelNextMonth: 'Bulan Depan',
                labelNextYear: 'Tahun Depan',
                labelNextDecade: 'Dekade Depan',
                labelToday: 'Hari Ini',
                labelSelected: 'Tanggal Terpilih ',
                labelNoDateSelected: 'Tanggal Belum Dipilih',
                labelCalendar: 'Kalendar',
                labelNav: 'Navigasi Kalendar',
                labelHelp: 'Gunakan Anak Panah Sebagai Bantuan Navigasi'
            },
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
    computed: {
        maxAccessoriesPrice() {
            return this.formatNumber(this.model.price) * .1
        }
    },
    mounted(){
        this.getPlates()
        this.getYear()
    },
    methods: {
        getYear(){
            const year = this.$dayjs().get('year')
            for( let i = year ; i > 2005 ; i--){
                this.years.push({
                    text: i,
                    value: i
                })
            }
        },
        isNull(data) {
            return (data === null || data === "")
        },
        resetField() {
            this.condition.brand = false
            this.condition.type = false
            this.condition.series = false
            this.condition.comprehensive = false
            this.condition.tlo = false
            this.model.insurancePackage = null
            this.model.price = this.formatPrice(0, 'id-ID', 'decimal')
            this.model.minPrice = this.formatPrice(0)
            this.model.maxPrice = this.formatPrice(0)
        },
        async getBrandCar(){
            this.resetField()

            this.brandCar = [{ text: 'Pilih', value: null }]
            this.model.type = null
            this.model.series = null

            if (this.isNull(this.model.yearProduction)) {
                return
            }

            await this.$axios.$get('api/vehicle',{
                params:{
                    year: this.model.yearProduction
                }
            }).then ((response) => {
                this.condition.brand = true

                response.data.forEach(element => {
                    this.brandCar.push({
                        text: `${element}`,
                        value: element
                    })
                });
            })
        },
        async getTypeCar(){
            this.resetField()

            this.condition.brand = true

            this.typeCar = [{ text: 'Pilih', value: null }]
            this.model.series = null

            if (this.isNull(this.model.brand)) {
                return
            }

            await this.$axios.$get('api/vehicle',{
                params:{
                    year:this.model.yearProduction,
                    brand : this.model.brand
                }
            }).then ((response) => {
                this.condition.type = true

                response.data.forEach(element => {
                    this.typeCar.push({
                        text: `${element}`,
                        value: element
                    })
                });

            })
        },
        async getSeriesCar(){
            this.resetField()

            this.condition.brand = true
            this.condition.type = true

            this.seriesCar = [{ text: 'Pilih', value: null }]

            if (this.isNull(this.model.type)) {
                return
            }

            await this.$axios.$get('api/vehicle',{
                params:{
                    year:this.model.yearProduction,
                    brand : this.model.brand,
                    model : this.model.type
                }
            }).then ((response) => {
                this.condition.series = true

                response.data.forEach(element => {
                    this.seriesCar.push({
                        text: `${element}`,
                        value: element
                    })
                });
            })
        },
        async getPriceCar() {
            this.condition.comprehensive = false
            this.condition.tlo = false
            this.model.insurancePackage = null
            this.model.price = this.formatPrice(0, 'id-ID', 'decimal')
            this.model.minPrice = this.formatPrice(0)
            this.model.maxPrice = this.formatPrice(0)

            if (this.isNull(this.model.series)) {
                return
            }

            await this.$axios.$get('api/vehicle/price',{
                params:{
                    year: this.model.yearProduction,
                    brand: this.model.brand,
                    model: this.model.type,
                    sub_model: this.model.series
                }
            }).then ((response) => {
                this.model.price = this.formatPrice(response.data.price, 'id-ID', 'decimal')
                this.model.minPrice = this.formatPrice(response.data.lowest_price)
                this.model.maxPrice = this.formatPrice(response.data.highest_price)

                /* eslint-disable eqeqeq */
                if (response.data.is_comprehensive == '1'){
                    this.condition.comprehensive = true
                }
                if (response.data.is_tlo == '1'){
                    this.condition.tlo = true
                }

            })
        },
        async getPlates(){
            await this.$axios.$get('api/vehicle/plates')
            .then ((response) => {

                this.plateCar.push({
                    text : 'Pilih' ,
                    value : null
                })
                response.data.forEach(element => {
                    this.plateCar.push({
                        text: `${element.code} (${element.province})`,
                        value: element.code
                    })
                });


            })
        },
        searchPolis() {
            const newModel = this.model
            newModel.price =this.formatNumber(newModel.price)

            this.$router.push({name: "asuransi-mobil-polis", params: { data: newModel }})
        },
        checkMinMaxPrice(){
            // automatic change min and max if below or above limit
            if(this.model.price === null) return;

            const value = this.formatNumber(this.model.price)
            const min = this.formatNumber(this.model.minPrice)
            const max = this.formatNumber(this.model.maxPrice)

            this.model.price = this.formatPrice(this.limit(value, min, max), 'id-ID', 'decimal');
        },
        onAccessoriesCheckboxChange(checked) {
            if(checked) {
                this.$bvModal.show('modal-accessories');
            }
        },
        modalAccessoriesCloseHandler() {
            this.model.addAccessories = false;
        },
        modalAccessoriesSubmitHandler(accessoriesData, totalPrice) {
            this.model.accessories = []
            accessoriesData.forEach((data) => {
                this.model.accessories.push(data.brand + ','+ data.type + ',' + data.price)
            })
            this.model.totalAccessoriesPrice = this.formatPrice(totalPrice)
        }
    }
}
</script>
