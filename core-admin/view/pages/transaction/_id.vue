<template>
    <div>
        <PageHeader :title="title" />

        <div class="row">
            <b-modal size="lg" scrollable ref="review-modal" title="Review Data Transaksi"
                ok-title="Simpan Review" @ok.prevent="triggerReview" cancel-title="Batal">
                <div class="d-block text-justify">
                    <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="submitReview">

                        <div class="form-group">
                            <label class="col-form-label">Pengecekan Dokumen Kendaraan
                                <label class="text-danger">*</label>
                            </label>

                            <table class="table table-responsive">
                                <tbody>
                                    <tr class="caption" v-for="(item, key) of data.documents" v-bind:key="key">
                                        <td style="width: 60%">
                                            <div>
                                                {{ documentsText[key] }}
                                            </div>
                                            <div v-if="!assessment[key]?.status" class="mt-2">
                                                <input type="text" class="form-control" placeholder="Deskripsi Kerusakan"
                                                    v-model="assessment[key].note">
                                            </div>
                                        </td>
                                        <td align="right">
                                            <b-button :variant="(assessment[key]?.status ? 'outline-' : '') + 'danger'"
                                                size="sm" @click="reviewBad(key)">
                                                <i class="uil uil-times"></i> Kondisi Rusak
                                            </b-button>
                                            <b-button :variant="(!assessment[key]?.status ? 'outline-' : '') + 'success'"
                                                size="sm" @click="reviewGood(key)">
                                                <i class="uil uil-check"></i> Kondisi Baik
                                            </b-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="form-group">
                            <label class="col-form-label">Catatan Tambahan (opsional)</label>

                            <textarea
                                v-model="assessment_note"
                                ref="short"
                                class="form-control"
                                placeholder="Tambahkan Catatan"></textarea>
                        </div>

                        <button ref="create-review" class="d-none"></button>

                    </form>
                </div>
            </b-modal>

            <div class="col-xl-12">
                <div class="card">
                    <div class="card-body">
                        <div>
                            <b-button v-if="data.assessment == null" class="float-end" variant="success"
                                :disabled="data.documents == null"
                                @click="showReview()">
                                <i class="uil uil-file-check me-1"></i> Review Berkas
                            </b-button>
                            <div style="display: table">
                                <img :src="data.product_image" alt="data.name" width="120" />
                                <div style="display: table-cell; vertical-align: middle;">
                                    <p>{{ data.product_name }}</p>
                                    <p style="font-weight: bold">{{ data.id }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3" v-for="(item, key) of data.documents" v-bind:key="key">
                <div class="card">
                    <div class="card-body">
                        <img :src="item" width="100%" @click="setLightBoxStatus(key)"
                            style="object-fit: cover; height: 120px; cursor: pointer;" />
                        <vue-easy-lightbox :visible="getLightBoxStatus(key)" :imgs="item"
                            @hide="setLightBoxStatus(key, false)"></vue-easy-lightbox>
                        <div class="text-center mt-3">{{ documentsText[key] }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body row">
                        <div class="col-6">
                            <h4 class="card-title">Data Pemegang Polis</h4>

                            <table class="table table-nowrap mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of fields.client" v-bind:key="key">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ data.client_data?.[key] }}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h4 class="card-title">Data Alamat</h4>

                            <table class="table table-nowrap mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of fields.address" v-bind:key="key">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ data[key] }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="col-6">
                            <h4 class="card-title">Informasi Kendaraan</h4>

                            <table class="table table-nowrap mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of fields.vehicle_base" v-bind:key="key">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ data[key] }}</td>
                                    </tr>
                                    <tr v-for="(item, key) of fields.vehicle_data" v-bind:key="key">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ autoNumberFormat(data.vehicle_data?.[key]) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="card">
                    <div class="card-body row">
                        <div class="col-6">
                            <h4 class="card-title">Data Transaksi</h4>

                            <table class="table table-nowrap mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of fields.transaction" v-bind:key="key">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ data[key] }}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h4 class="card-title">Data Pembayaran</h4>

                            <table class="table table-nowrap mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of fields.payment" v-bind:key="key">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ autoNumberFormat(data.pg_data?.[key]) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="col-6">
                            <h4 class="card-title">Data Perluasan</h4>

                            <table class="table table-nowrap mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of data.expansions" v-bind:key="key">
                                        <td scope="row">{{ item.label }}</td>
                                        <td>{{ autoNumberFormat(item.price) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </template>

    <script>
    let ClassicEditor

    if (process.client) {
        ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
    }

    import { required } from "vuelidate/lib/validators"

    /**
     * Profile component
     */
    export default {
        layout: 'admin',
        head() {
            return {
                title: `${this.title} | Nuxtjs Responsive Bootstrap 5 Admin Dashboard`,
            };
        },
        data() {
            return {
                id: this.$nuxt.$route.params.id,
                title: "Detail Transaksi",
                editor: ClassicEditor,
                lightBoxImage: [],
                documentsText: {
                    'bastk': 'File BASTK',
                    'identity_card': 'Kartu Identitas',
                    'stnk': 'STNK',
                    'dashboard': 'Foto Dashboard',
                    'front_side': 'Foto Tampak Depan',
                    'back_side': 'Foto Tampak Belakang',
                    'right_side': 'Foto Tampak Kanan',
                    'left_side': 'Foto Tampak Kiri',
                },
                isCreate: true,
                fields: {
                    client: {
                        'fullname': 'Nama Lengkap',
                        'email': 'Email',
                        'phone': 'No. Telepon',
                    },
                    address: {
                        'address_detail': 'Alamat Lengkap',
                        'village_name': 'Desa/Kelurahan',
                        'district_name': 'Kecamatan',
                        'regency_name': 'Kabupaten/Kota',
                        'province_name': 'Provinsi',
                    },
                    vehicle_base: {
                        'brand': 'Merk',
                        'sub_model': 'Seri',
                    },
                    vehicle_data: {
                        'year': 'Tahun Pembuatan',
                        'color': 'Warna',
                        'plate': 'Kode Plat',
                        'machine_number': 'Nomor Mesin',
                        'skeleton_number': 'Nomor Rangka',
                        'capacity': 'Kapasitas',
                        'price': 'Harga',
                    },
                    accessories: {

                    },
                    transaction: {
                        'product_name': 'Nama Produk',
                        'created_at': 'Tanggal Transaksi',
                    },
                    payment: {
                        'name': 'Nama Platform',
                        'virtual_number': 'Nomor VA',
                        'amount': 'Total Biaya',
                        'due': 'Jatuh Tempo',
                    }
                },
                typeList: [
                    { value: null, text: 'Pilih' },
                    { value: 'era', text: 'Emergency Road Assistance (ERA)' },
                    { value: 'ambulance', text: 'Ambulance' },
                    { value: 'call_center', text: 'Call Center' },
                    { value: 'tow', text: 'Jasa Derek' },
                    { value: 'replace_vehicle', text: 'Kendaraan Pengganti' },
                    { value: 'taxi_fare', text: 'Pergantian Biaya Taksi' },
                    { value: 'nfo', text: 'New For Old (6 Bulan)' },
                    { value: 'repair_warranty', text: 'Garansi Perbaikan' },
                    { value: 'mobile_app', text: 'Mobile App (Claim)' },
                    { value: 'to_workshop', text: 'Antar jemput kendaraan ke bengkel' },
                    { value: 'other', text: 'Lain' },
                ],
                data: {},
                assessment: {},
                assessment_note: null,
            };
        },
        created() {
            this.data = this.getData()
        },
        validations: {
            feature: {
                name: { required },
                description: { required },
                type: { required },
            },
        },
        methods: {
            validateState(validation) {
                const { $dirty, $error } = validation
                return $dirty ? !$error : null
            },
            async getData() {
                await this.$axios.$get(`api/admin/transaction/${this.id}/detail`)
                    .then(response => {
                        this.data = response.data

                        for (let key in response.data.documents) {
                            this.assessment[key] = {
                                status: true,
                                note: null
                            }
                        }
                    })
            },
            getLightBoxStatus(key) {
                return this.lightBoxImage[key]
            },
            setLightBoxStatus(key, status = true) {
                this.lightBoxImage = this.lightBoxImage.map(item => false)
                this.lightBoxImage[key] = status
            },
            autoNumberFormat(value) {
                if (typeof value === 'number' && value >= 10) {
                    return this.formatPrice(value)
                }

                return value
            },
            showReview() {
                if (this.data.documents == null) return

                this.$refs['review-modal'].show()
            },
            reviewGood(key) {
                this.assessment[key].status = true
                this.$forceUpdate()
            },
            reviewBad(key) {
                this.assessment[key].status = false
                this.$forceUpdate()
            },
            triggerReview() {
                this.$refs['create-review'].click()
            },
            async submitReview(e) {
                e.preventDefault()

                // if (this.$v.$touch() || this.$v.form.$anyError) return

                this.$axios.$put(`api/admin/transaction/${this.id}/review`, {
                    item: this.assessment,
                    note: this.assessment_note
                })
                .then(response => {
                    window.location.reload()
                })
            }
        },
    };
    </script>