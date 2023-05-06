<template>
    <div>
        <PageHeader :title="title" />

        <div class="row">
            <b-modal size="xl" scrollable ref="upload-modal" title="Upload Dokumen e-Polis"
                ok-title="Submit" @ok.prevent="triggerUpload" cancel-title="Batal">
                    <div class="d-block text-justify">
                        <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="doUpload">
                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">e-Policy
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <input
                                        @change="onFileChange"
                                        name="epolicy"
                                        type="file"
                                        class="form-control">
                                </div>
                            </div>

                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">Nota
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <input
                                        @change="onFileChange"
                                        name="nota"
                                        type="file"
                                        class="form-control">
                                </div>
                            </div>

                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">Wording Policy
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <input
                                        @change="onFileChange"
                                        name="policy"
                                        type="file"
                                        class="form-control">
                                </div>
                            </div>

                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">Lainnya
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <input
                                        @change="onFileChange"
                                        name="lainnya"
                                        type="file"
                                        class="form-control">
                                </div>
                            </div>

                            <button ref="upload-data" class="d-none"></button>

                        </form>
                    </div>
                </b-modal>

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

            <b-modal size="lg" scrollable ref="revert-modal" title="Revert to Agent"
                ok-title="Proses" @ok.prevent="triggerRevert" cancel-title="Batal">
                <div class="d-block text-justify">
                    <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="processRevert">

                        <div class="form-group">
                            <label class="col-form-label">Catatan
                                <label class="text-danger">*</label>
                            </label>

                            <textarea v-model="formRevert.message" class="form-control" style="height: 300px"></textarea>
                        </div>

                        <button ref="create-revert" class="d-none"></button>

                    </form>
                </div>
            </b-modal>

            <div class="col-xl-12">
                <div class="card">
                    <div class="card-body">
                        <div>
                            <div v-if="account.role_id == 1">
                                <b-button v-if="data.assessment == null && data.status !== 'polis'" class="float-end ms-2" variant="danger"
                                    :disabled="data.documents == null"
                                    @click="showRevert()">
                                    <i class="uil uil-outline-feedback me-1"></i> Revert to Agent
                                </b-button>
                                <b-button v-if="data.assessment == null && data.status !== 'polis'" class="float-end" variant="success"
                                    :disabled="data.documents == null"
                                    @click="showReview()">
                                    <i class="uil uil-file-check me-1"></i> Review Berkas
                                </b-button>
                                <b-button v-else class="float-end" variant="success"
                                    disabled>
                                    <i class="uil uil-file-check me-1"></i> Berkas telah direview
                                </b-button>
                                <b-button v-if="data.status !== 'polis'" class="float-end me-2" variant="primary"
                                    :disabled="data.documents == null"
                                    @click="showUpload()">
                                    <i class="uil uil-outline-feedback me-1"></i> Upload e-Polis
                                </b-button>
                            </div>
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

            <div v-bind:key="key" v-for="(item, key) of data.documents" class="col-xl-3">
                <div class="card">
                    <div class="card-body">
                        <img :src="item" width="100%" @click="setLightBoxStatus(key)"
                            style="object-fit: cover; height: 120px; cursor: pointer;" />
                        <vue-easy-lightbox :visible="getLightBoxStatus(key)" :imgs="item"
                            @hide="setLightBoxStatus(key, false)"></vue-easy-lightbox>
                        <div class="text-center mt-3">
                            {{ documentsText[key] }}
                            <span v-if="data.assessment != null">
                                <span v-if="data.assessment.item[key].status"
                                    class="badge bg-success rounded-status" v-b-tooltip.hover
                                    title="Kondisi Baik"><i class="uil uil-check"></i></span>
                                <span v-else
                                    class="badge bg-danger rounded-status" v-b-tooltip.hover
                                    title="Kondisi Rusak"><i class="uil uil-multiply"></i></span>
                            </span>
                        </div>
                        <div v-if="data.assessment != null && !data.assessment.item[key].status"
                            class="text-center text-danger mt-2">{{ data.assessment.item[key].note }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body row">
                        <div class="col-lg-6 col-12">
                            <h4 class="card-title">Data Pemegang Polis</h4>

                            <table class="table mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of fields.client" v-bind:key="key">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ data.client_data?.[key] }}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h4 class="card-title">Data Alamat</h4>

                            <table class="table mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of fields.address" v-bind:key="key">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ data[key] }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="col-lg-6 col-12">
                            <h4 class="card-title">Informasi Kendaraan</h4>

                            <table class="table mt-4 mb-4">
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
                        <div :class="(hasExpansions ? 'col-lg-6 ' : 'col-lg-12 ') + 'col-12'">
                            <h4 class="card-title">Data Transaksi</h4>

                            <table class="table mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of fields.transaction" v-bind:key="key">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ data[key] }}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h4 class="card-title">Data Pembayaran</h4>

                            <table class="table mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of fields.payment" v-bind:key="key">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ autoNumberFormat(data.pg_data?.[key]) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div v-if="hasExpansions" class="col-lg-6 col-12">
                            <h4 class="card-title">Data Perluasan</h4>

                            <table class="table mt-4 mb-4">
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

            <div class="col-12">
                <div class="card">
                    <div class="card-body row">
                        <div :class="(hasExpansions ? 'col-lg-6 ' : 'col-lg-12 ') + 'col-12'">
                            <h4 class="card-title">Dokumen e-Polis</h4>

                            <table class="table mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of data.epolis" v-bind:key="key">
                                        <td colspan="2">
                                            <a :href="item" target="_blank">{{ key.toUpperCase() }}</a>
                                        </td>
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
    import { required } from "vuelidate/lib/validators"
    import Swal from "sweetalert2"

    let ClassicEditor

    if (process.client) {
        ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
    }

    /**
     * Profile component
     */
    export default {
        layout: 'admin',
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
                        'is_new_condition': 'Kondisi'
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
                formRevert: {
                    message: ''
                },
                formepolis: {
                    transaction_id: null,
                    epolicy: null,
                    nota: null,
                    policy: null,
                    lainnya: null
                },
                account: []
            };
        },
        head() {
            return {
                title: `${this.title} | Nuxtjs Responsive Bootstrap 5 Admin Dashboard`,
            };
        },
        computed: {
            hasExpansions() {
                return this.data.expansions != null && this.data.expansions.length > 0
            }
        },
        created() {
            this.data = this.getData()
            this.getAccount()
        },
        validations: {
            feature: {
                name: { required },
                description: { required },
                type: { required },
            },
        },
        methods: {
            async getAccount() {
                this.account = await this.$axios.$get('api/admin/account')
                    .then ((response) => {
                        return response.data;
                    })
            },
            onFileChange(e) {
                const files = e.target.files || e.dataTransfer.files
                if (!files.length)
                    return

                this.formepolis[e.target.name] = files[0]
            },
            validateState(validation) {
                const { $dirty, $error } = validation
                return $dirty ? !$error : null
            },
            async getData() {
                const epolisdok = ['epolicy', 'policy', 'nota', 'lainnya'];
                await this.$axios.$get(`api/admin/transaction/${this.id}/detail`)
                    .then(response => {
                        this.data = response.data
                        this.data.is_new_condition = response.data.is_new_condition == 1 ? 'Baru' : 'Bekas';

                        const documents = {};
                        const epolis = {};

                        for (let key in response.data.documents) {

                            if (epolisdok.includes(key)) {
                                epolis[key] = response.data.documents[key]
                            } else {
                                documents[key] = response.data.documents[key]
                                this.assessment[key] = {
                                    status: true,
                                    note: null
                                }
                            }
                        }

                        this.data.documents = documents;
                        this.data.epolis = epolis;
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
            showUpload() {
                this.$refs['upload-modal'].show()
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
            },
            showRevert() {
                this.$refs['revert-modal'].show();
            },
            triggerRevert() {
                this.$refs['create-revert'].click();
            },
            triggerUpload() {
                this.$refs['upload-data'].click();
            },
            doUpload() {

                this.formepolis.transaction_id = this.id;

                const formData = new FormData()

                for (const key of Object.keys(this.formepolis)) {
                    formData.append(key, this.formepolis[key])
                }

                this.$axios.$post('api/admin/transaction/epolicy', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                .then(response => {
                    window.location.reload()
                })
            },
            async processRevert(e) {
                e.preventDefault();

                await this.$axios.$post(`/api/admin/transaction/${this.id}/feedback`, this.formRevert)
                    .then((resp) => {
                        this.$refs['revert-modal'].hide()

                        Swal.fire("Berhasil", "Berhasil Mengirimkan Feedback ke Agent", "success")
                        window.location.reload()
                    })
            }
        },
    };
    </script>