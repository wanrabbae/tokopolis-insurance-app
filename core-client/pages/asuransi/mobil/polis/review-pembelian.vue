<template>

    <div class="py-4 py-lg-5" style="background-color: #f6f5fc">

        <div class="container">

            <div class="card border">

               <div class="card-header border-bottom">

                   <h2 class="mb-0">Review Pembelian</h2>

               </div> <!-- card-header ends -->

               <div class="card-body">

                   <div class="mb-3">
                        <span class="fs-4 fs-lg-3 fw-bold text-dark">Garda Orto Comprehensive</span>
                    </div>

                   <div class="row">

                       <div class="col-12 col-lg-6">

                            <div class="rounded border mb-3 mb-lg-4">

                                <div v-b-toggle.document-accordion class="position-relative chevron pointer p-3">
                                    <span class="fw-bold">Dokumen yang Diperlukan</span>
                                </div>

                                <b-collapse id="document-accordion" class="border-top" visible>

                                    <div class="p-3">

                                        <div v-for="field in documentFields" :key="field.key" class="d-flex align-items-center mb-3 mb-last-0">

                                            <div class="mr-3" style="min-width: 32px; max-width: 32px;">

                                                <b-img v-if="documentImages[field.key]" :src="documentImages[field.key]"></b-img>

                                                <b-img v-else src="/svg/picture.svg"></b-img>

                                            </div>

                                            <a class="d-block flex-grow-1" target="_blank" :href="documentImages[field.key] ? documentImages[field.key] : '#'">
                                                    {{ field.label }}
                                            </a>

                                        </div>

                                    </div>

                                </b-collapse>

                            </div>

                            <div class="rounded border mb-3 mb-lg-4">

                                <div v-b-toggle.policy-holder-accordion class="position-relative chevron pointer p-3">
                                    <span class="fw-bold">Detail Pemegang Polis</span>
                                </div>

                                <b-collapse id="policy-holder-accordion" class="border-top" visible>

                                    <div class="p-3">

                                        <div v-for="field in policyHolderFields" :key="field.key" class="row mb-3 mb-last-0">

                                            <div class="col-6 col-lg-4">
                                                <span class="fw-bold">{{ field.label }}</span>
                                            </div>

                                            <div class="col-6 col-lg-8">
                                                <span>{{ policyHolderDetail[field.key] ? policyHolderDetail[field.key] : '-' }}</span>
                                            </div>

                                        </div>

                                    </div>

                                </b-collapse>

                            </div>

                            <div class="rounded border mb-3 mb-lg-4">

                                <div v-b-toggle.vehicle-detail-accordion class="position-relative chevron pointer p-3">
                                    <span class="fw-bold">Detail Kendaraan</span>
                                </div>

                                <b-collapse id="vehicle-detail-accordion" class="border-top" visible>

                                    <div class="p-3">

                                        <div v-for="field in vehicleFields" :key="field.key" class="row mb-3 mb-last-0">

                                            <div class="col-6 col-lg-4">
                                                <span class="fw-bold">{{ field.label }}</span>
                                            </div>

                                            <div class="col-6 col-lg-8">
                                                <span>{{ vehicleDetail[field.key] ? vehicleDetail[field.key] : '-' }}</span>
                                            </div>

                                        </div>

                                    </div>

                                </b-collapse>

                            </div>

                       </div> <!-- col-12.col-lg-6 ends-->

                       <div class="col-12 col-lg-6">

                            <div class="rounded border mb-3 mb-lg-4">

                                <div v-b-toggle.period-accordion class="position-relative chevron pointer p-3">
                                    <span class="fw-bold">Periode Asuransi</span>
                                </div>

                                <b-collapse id="period-accordion" class="border-top" visible>

                                    <div class="p-3">
                                        <span>23 November 2021 - 23 November 2022</span>
                                    </div>

                                </b-collapse>

                            </div>

                           <div v-if="expansionFields.length > 0" class="rounded border mb-3 mb-lg-4">

                                <div v-b-toggle.expansion-accordion class="position-relative chevron pointer p-3">
                                    <span class="fw-bold">Perluasan Resiko Tambahan</span>
                                </div>

                                <b-collapse id="expansion-accordion" class="border-top p-3" visible>

                                    <div v-for="field in expansionFields" :key="field.key" class="d-block">

                                        <div v-if="expansions[field.key]" class="d-flex justify-content-between mb-1 mb-last-0">

                                            <span>{{ field.label }}</span>

                                            <span>{{ formatPrice(expansions[field.key]) }}</span>

                                        </div>

                                    </div>

                                </b-collapse>

                            </div>

                            <div class="rounded border mb-3 mb-lg-4">

                                <div v-b-toggle.promotion-accordion class="position-relative d-flex align-items-center chevron pointer p-3">

                                    <div class="mr-3">
                                        <PercentIcon width="24px" height="24px" />
                                    </div>

                                    <div class="text-dark fs-4 fw-bold">Makin Hemat Dengan Promo</div>

                                </div>

                                <b-collapse id="promotion-accordion" visible>

                                    <b-form class="px-3 pb-3">

                                        <b-input-group>

                                            <input
                                                v-model="model.promotionCode"
                                                placeholder="Masukkan Kode Promo"
                                                class="form-control"
                                            />

                                            <b-input-group-append>

                                                <BaseButton native-type="submit">Periksa</BaseButton>

                                            </b-input-group-append>

                                        </b-input-group>

                                    </b-form>

                                </b-collapse>

                            </div>

                            <div class="rounded border mb-3 mb-lg-4">

                                <div class="p-3">
                                    <span class="fw-bold">Ringkasan Pembelian</span>
                                </div>

                                <div class="border-top p-3">

                                    <div class="d-flex justify-content-between mb-2 mb-last-0">
                                        <span class="fw-bold">ID Transaksi</span>
                                        <span class="fw-bold">{{ transactionId }}</span>
                                    </div>

                                    <div v-for="field in purchaseSummaryFields" :key="field.key" class="d-flex justify-content-between mb-2 mb-last-0">
                                        <span>{{ field.label }}</span>
                                        <span>{{ formatPrice(purchaseSummaryDatas[field.key]) }}</span>
                                    </div>

                                    <div class="d-flex justify-content-between mb-2 mb-last-0">
                                        <span class="text-primary fw-bold">Total Pembelian</span>
                                        <span class="text-primary fw-bold">{{ formatPrice(totalPrice) }}</span>
                                    </div>

                                </div>

                            </div>

                            <div class="rounded border mb-3 mb-lg-4">

                                <div class="p-3">
                                    <span class="fw-bold">Metode Pembayaran</span>
                                </div>

                                <div class="border-top px-3 py-1">

                                    <b-form-radio-group
                                        id="payment-method"
                                        v-model="model.paymentMethod"
                                        :aria-describedby="ariaDescribedby"
                                        stacked
                                    >

                                        <div v-b-toggle.virtual-account-accordion role="tab" class="position-relative d-flex flex-column justify-content-center pointer border-bottom chevron" style="min-height: 52px">
                                            Virtual Account
                                        </div>

                                        <b-collapse id="virtual-account-accordion" accordion="payment-method-accordion" role="tabpanel" visible>

                                            <div class="border-bottom py-3">

                                                <b-form-radio v-for="option in virtualAccountOptions" :key="option.value" :value="option.value" class="mb-3 mb-last-0">

                                                    <div class="d-flex">

                                                        <div style="width: 64px" class="mr-3">
                                                            <b-img :src="option.img" class="max-height: 100%" />
                                                        </div>

                                                        <div class="d-block">
                                                            <span>{{ option.text }}</span>
                                                        </div>

                                                    </div>

                                                </b-form-radio>


                                            </div>

                                        </b-collapse>
                                        <div v-b-toggle.emoney-accordion role="tab" class="position-relative d-flex flex-column justify-content-center border-bottom pointer chevron" style="min-height: 52px">
                                            E-Money
                                        </div>

                                        <b-collapse id="emoney-accordion" accordion="payment-method-accordion" role="tabpanel" >

                                            <div class="border-bottom py-3">

                                                <b-form-radio v-for="option in emoneyOptions" :key="option.value" :value="option.value" class="mb-3 mb-last-0">

                                                    <div class="d-flex">

                                                        <div style="width: 64px" class="mr-3">
                                                            <b-img :src="option.img" class="max-height: 100%" />
                                                        </div>

                                                        <div class="d-block">
                                                            <span>{{ option.text }}</span>
                                                        </div>

                                                    </div>

                                                </b-form-radio>

                                            </div>

                                        </b-collapse>

                                        <div v-b-toggle.retail-accordion role="tab" class="position-relative d-flex flex-column justify-content-center pointer chevron" style="min-height: 52px">

                                            <div>Gerai Retail</div>

                                            <div>
                                                <small class="text-muted">Verifikasi membutuhkan waktu 2x24 Jam</small>
                                            </div>

                                        </div>

                                        <b-collapse id="retail-accordion" accordion="payment-method-accordion" role="tabpanel">

                                            <div class="border-top py-3">

                                                <b-form-radio v-for="option in retailOptions" :key="option.value" :value="option.value" class="mb-3 mb-last-0">

                                                    <div class="d-flex">

                                                        <div style="width: 64px" class="mr-3">
                                                            <b-img :src="option.img" class="max-height: 100%" />
                                                        </div>

                                                        <div class="d-block">
                                                            <span>{{ option.text }}</span>
                                                        </div>

                                                    </div>

                                                </b-form-radio>

                                            </div>

                                        </b-collapse>

                                    </b-form-radio-group>

                                </div>

                            </div>

                           <BaseButton block @click="CreatePayment">Bayar Sekarang</BaseButton>

                       </div> <!-- col-12 col-lg-6 ends -->

                   </div> <!-- row ends -->

               </div> <!-- card-body ends -->

            </div> <!-- card ends -->

        </div> <!-- container ends -->

        <Loading :show="loading"/>

    </div>

</template>

<script>
import Loading from '../../../../components/Loading'
import PercentIcon from '../../../../assets/svg/percent.svg'

export default {
    components: {
        Loading,
        PercentIcon
    },
    data () {
        return {
            loading : true,
            idTransaction : null,
            model: {
                promotionCode: null,
                paymentMethod: null
            },
            transactionId: "32141312",
            documentFields: [
                {
                    key: "stnk",
                    label: "Foto STNK"
                },
                {
                    key: "vehicleFront",
                    label: "Foto Bagian Depan Kendaraan"
                },
                {
                    key: "vehicleRight",
                    label: "Foto Bagian Kanan Kendaraan"
                },
                {
                    key: "vehicleLeft",
                    label: "Foto Bagian Kiri Kendaraan"
                },
                {
                    key: "vehicleBehind",
                    label: "Foto Bagian Belakang Kendaraan"
                },
                {
                    key: "vehicleDasboard",
                    label: "Foto Dasbor Kendaraan"
                },
                {
                    key: "optionalPhoto1",
                    label: "Foto Tambahan (Opsional)"
                },
                {
                    key: "optionalPhoto2",
                    label: "Foto Tambahan (Opsional)"
                },
                {
                    key: "optionalPhoto3",
                    label: "Foto Tambahan (Opsional)"
                },
                {
                    key: "optionalPhoto4",
                    label: "Foto Tambahan (Opsional)"
                }
            ],
            documentImages: {
                stnk: null,
                vehicleFront: null,
                vehicleRight: null,
                vehicleLeft: null,
                vehicleBehind: null,
                vehicleDasboard: null,
                optionalPhoto1: null,
                optionalPhoto2: null,
                optionalPhoto3: null,
                optionalPhoto4: null,
            },
            policyHolderFields: [
                {
                    key: "name",
                    label: "Nama"
                },
                {
                    key: "phone",
                    label: "No. Telepon"
                },
                {
                    key: "email",
                    label: "Email"
                }
            ],
            policyHolderDetail: {
                name: "John Doe",
                phone: "08123456789",
                email: "johndoe@email.com"
            },
            vehicleFields: [
                {
                    key: "brand",
                    label: "Merek Mobil"
                },
                {
                    key: "type",
                    label: "Tipe Mobil"
                },
                {
                    key: "series",
                    label: "Email"
                },
                {
                    key: "productionYear",
                    label: "Tahun Produksi"
                },
                {
                    key: "price",
                    label: "Harga"
                },
                {
                    key: "lisencePlateId",
                    label: "Kode Plat"
                },
                {
                    key: "plateNumber",
                    label: "Nomor Plat"
                },
                {
                    key: "selectedPackage",
                    label: "Paket"
                },
                {
                    key: "color",
                    label: "Warna Mobil"
                },
                {
                    key: "machineNumber",
                    label: "Nomor Mesin"
                },
                {
                    key: "vehicleIdentificationNumber",
                    label: "Nomor Rangka"
                }
            ],
            vehicleDetail: {
                brand: "TOYOTA",
                type: "AGYA",
                series: "G A/T",
                productionYear: "2017",
                price: 8865500,
                lisencePlateId: "B (DKI Jakarta)",
                plateNumber : "-",
                selectedPackage: "Komprehensif",
                color: "Silver",
                machineNumber: "F430ID271263",
                vehicleIdentificationNumber: "MH8FD125X472"
            },
            expansionFields: [
                // {
                //     key: "chaosAndRiot",
                //     label: "Huru-hara dan kerusuhan"
                // },
                // {
                //     key: "terrorismAndSabotage",
                //     label: "Terorisme dan Sabotase"
                // },
                // {
                //     key: "flood",
                //     label: "Banjir dan Angin Topan"
                // },
                // {
                //     key: "earthquakeAndTsunami",
                //     label: "Gempa Bumi dan Tsunami"
                // },
                // {
                //     key: "thirdPartyResponsibilityLaw",
                //     label: "Tanggung Jawab Hukum Terhadap Pihak Ketiga"
                // },
                // {
                //     key: "driverSelfAccident",
                //     label: "Kecelakaan Diri untuk Pengemudi"
                // },
                // {
                //     key: "passengerSelfAccident",
                //     label: "Kecelakaan Diri untuk Penumpang"
                // },
                // {
                //     key: "bengalAuthorized",
                //     label: "Fasilitas Bengal Authorized"
                // },
                // {
                //     key: "autocilin",
                //     label: "Fitur Autocilin"
                // }
            ],
            expansions: {
                // chaosAndRiot: 38300,
                // terrorismAndSabotage: 38300,
                // floodAndThypoon: 76600,
                // earthquakeAndTsunami: 76600,
                // thirdPartyResponsibilityLaw: 50000,
                // driverSelfAccident: 25000,
                // passengerSelfAccident: 10000
            },
            purchaseSummaryFields: [
                {
                    key: "premiPrice",
                    label: "Harga Premi"
                },
                {
                    key: "expTotal",
                    label: "Total Perluasan"
                },
                {
                    key: "administrationCost",
                    label: "Biaya Admin"
                },
                // {
                //     key: "discount",
                //     label: "Diskon"
                // },
                // {
                //     key: "promo",
                //     label: "Promo"
                // }
            ],
            purchaseSummaryDatas: {
                premiPrice: 0,
                expTotal: 0,
                administrationCost: 0,
                // discount: 0,
                // promo: 0
            },
            emoneyOptions: [
                {
                    img: '/img/logo-gopay.png',
                    text: 'Gopay',
                    value: 'gopay'
                },
                {
                    img: '/img/logo-ovo.png',
                    text: 'OVO',
                    value: 'ovo'
                },
                {
                    img: '/img/logo-shopeepay.png',
                    text: 'ShopeePay',
                    value: 'shopeepay'
                },
                {
                    img: '/img/logo-linkaja.png',
                    text: 'Linkaja',
                    value: 'linkaja'
                },
                {
                    img: '/img/logo-qris.png',
                    text: 'QRIS',
                    value: 'qris'
                }
            ],
            virtualAccountOptions: [
                {
                    img: '/img/logo-mandiri.png',
                    text: 'Mandiri Virtual Account',
                    value: 'mandiri'
                },
                {
                    img: '/img/logo-bni.png',
                    text: 'BNI Virtual Account',
                    value: 'bni'
                },
                {
                    img: '/img/logo-bca.png',
                    text: 'BCA Virtual Account',
                    value: 'bca'
                },
                {
                    img: '/img/logo-bri.png',
                    text: 'BRI Virtual Account',
                    value: 'bri'
                },
                {
                    img: '/img/logo-payment-others.png',
                    text: 'Virtual Account Lainnya',
                    value: 'permata'
                },
            ],
            transferBankOptions: [
                {
                    img: '/img/logo-mandiri.png',
                    text: 'Mandiri',
                    value: 'mandiri'
                },
                {
                    img: '/img/logo-bni.png',
                    text: 'BNI',
                    value: 'bni'
                },
                {
                    img: '/img/logo-btpn.png',
                    text: 'BCA',
                    value: 'bca'
                },
                {
                    img: '/img/logo-bri.png',
                    text: 'BRI',
                    value: 'bri'
                },
                {
                    img: '/img/logo-payment-others.png',
                    text: 'Bank Lainnya',
                    value: 'others'
                },
            ],
            retailOptions: [
                {
                    img: '/img/logo-indomaret.png',
                    text: 'Indomaret',
                    value: 'indomaret'
                },
                {
                    img: '/img/logo-alfamart.png',
                    text: 'Alfamart',
                    value: 'alfamart'
                },

            ]
        }
    },
    head() {
        return {
            title: 'Review Pembelian - Pico Insurtech',
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
        totalPrice() {
            let total = 0;
            const keys = Object.keys(this.purchaseSummaryDatas);
            keys.forEach((key, index) => {
                total += this.purchaseSummaryDatas[key];
            });
            return total;
        }
    },
    deactivated(){
        this.$destroy()
    },
    created(){
        // this.$destroy()
        this.idTransaction = this.$store.state.transaction_id
    },
    mounted(){
        this.getTransactionReview()
    },
    methods: {
        async getTransactionReview() {
            await this.$axios.$get(`api/transaction/review?transaction_id=${this.idTransaction}`)
                .then ((response) => {
                    console.log(response)
                    this.policyHolderDetail.name = response.data.account.fullname
                    this.policyHolderDetail.phone = response.data.account.phone
                    this.policyHolderDetail.email = response.data.account.email

                    this.vehicleDetail.brand = response.data.vehicle.brand
                    this.vehicleDetail.type = response.data.vehicle.model
                    this.vehicleDetail.series = response.data.vehicle.sub_model
                    this.vehicleDetail.productionYear = response.data.vehicle.year
                    this.vehicleDetail.price = this.formatPrice(response.data.vehicle.price)
                    this.vehicleDetail.lisencePlateId = response.data.vehicle.plate
                    this.vehicleDetail.plateNumber = response.data.vehicle.plate_detail
                    this.vehicleDetail.protection = response.data.vehicle.selectedPackage
                    this.vehicleDetail.color = response.data.vehicle.vehicle_color
                    this.vehicleDetail.machineNumber = response.data.vehicle.machine_number
                    this.vehicleDetail.vehicleIdentificationNumber = response.data.vehicle.skeleton_number

                    this.purchaseSummaryDatas.premiPrice = response.data.transaction.price
                    this.transactionId = response.data.transaction.code
                    // this.purchaseSummaryDatas.administrationCost = response.data.transaction.price
                    // this.purchaseSummaryDatas.discount = response.data.transaction.price
                    // this.purchaseSummaryDatas.promo = response.data.transaction.price

                    const expan = response.data.transaction.expansions

                    this.expansions = {}
                    this.expansionFields = []
                    for (const value of expan){
                        this.expansionFields.push({
                            key: value.code,
                            label: value.label
                        })

                        this.expansions[value.code] = value.price
                        this.purchaseSummaryDatas.expTotal += value.price

                    }

                    const file = response.data.transaction.documents
                    this.documentImages.stnk = this.$config.baseAPI + file.stnk
                    this.documentImages.vehicleFront = this.$config.baseAPI +file.front_side
                    this.documentImages.vehicleRight = this.$config.baseAPI +file.right_side
                    this.documentImages.vehicleLeft = this.$config.baseAPI +file.left_side
                    this.documentImages.vehicleBehind = this.$config.baseAPI +file.back_side
                    this.documentImages.vehicleDasboard = this.$config.baseAPI +file.dashboard
                    this.loading = false
                })
                .catch (error => {
                    console.log(error)
                    this.$router.push({name: "asuransi-mobil-polis-pembelian"})
                })
        },
        CreatePayment() {
            this.$axios.$post('api/transaction/payment', {
                transaction_id : this.idTransaction,
                platform : this.model.paymentMethod,
            }).then ((response)=> {

                console.log(response)
                this.$router.push({name: "asuransi-mobil-polis-konfirmasi-pembayaran"})
                // window.location.reload(true)

            })

        }
    }
}
</script>