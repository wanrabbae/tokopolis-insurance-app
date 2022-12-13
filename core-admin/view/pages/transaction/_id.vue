<template>
    <div>
        <PageHeader :title="title" />

        <div class="row">
            <b-modal size="lg" scrollable ref="form-modal" title="Tambah Fitur"
                ok-title="Submit" @ok.prevent="triggerFeature" cancel-title="Batal">
                <div class="d-block text-justify">
                    <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="submitFeature">
                        <div role="group" class="row form-group mb-3">
                            <label class="col-sm-2 col-lg-2 col-form-label">Nama
                                <label class="text-danger">*</label>
                            </label>
                            <div class="col-sm-10 col-lg-10">
                                <input
                                    type="text"
                                    v-model="feature.name"
                                    class="form-control"
                                    placeholder="Masukkan Nama"
                                    required>
                            </div>
                        </div>

                        <div role="group" class="row form-group mb-3">
                            <label class="col-sm-2 col-lg-2 col-form-label">Deskripsi Singkat</label>
                            <div class="col-sm-10 col-lg-10">
                                <textarea
                                    v-model="feature.short_description"
                                    class="form-control"
                                    placeholder="Masukkan Deskripsi Singkat"></textarea>
                            </div>
                        </div>

                        <div role="group" class="row form-group mb-3">
                            <label class="col-sm-2 col-lg-2 col-form-label">Deskripsi
                                <label class="text-danger">*</label>
                            </label>
                            <div class="col-sm-10 col-lg-10" :class="{'is-invalid': $v.feature.description.$error}">
                                <CKEditor
                                    v-model="feature.description"
                                    :state="validateState($v.feature.description)"
                                    :editor="editor"/>
                            </div>
                        </div>

                        <div role="group" class="row form-group mb-3">
                            <label class="col-sm-2 col-lg-2 col-form-label">Tipe
                                <label class="text-danger">*</label>
                            </label>
                            <div class="col-sm-10 col-lg-10">
                                <select
                                    class="form-select"
                                    v-model="feature.type"
                                    required>
                                    <option v-for="option in typeList" v-bind:value="option.value"
                                        v-bind:key="option.text">{{ option.text }}</option>
                                </select>
                            </div>
                        </div>

                        <button ref="create-feature" class="d-none"></button>

                    </form>
                </div>
            </b-modal>

            <b-modal size="lg" scrollable ref="show-modal" title="Detail Fitur"
                ok-only ok-title="Tutup">
                <div class="card-body">
                    <div class="text-center">
                        <div class="avatar-lg">
                            <div class="avatar-title rounded-circle">
                                <i class="uil uil-thumbs-up"></i>
                            </div>
                        </div>
                        <h5 class="mt-3 mb-1">{{ feature.name }}</h5>
                        <p class="text-muted">{{ feature.type }}</p>
                    </div>

                    <hr class="my-4" />

                    <div v-if="feature.short_description" class="text-muted mb-3">
                        <h5 class="font-size-16">Deskripsi Singkat</h5>
                        <p v-html="feature.short_description"></p>
                    </div>

                    <div class="text-muted">
                        <h5 class="font-size-16">Deskripsi</h5>
                        <!-- <p v-html="getDescription()"></p> -->
                    </div>
                </div>
            </b-modal>

            <div class="col-xl-12">
                <div class="card">
                    <div class="card-body">
                        <div>
                            <b-button class="float-end" variant="success">
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
                                    <tr v-for="(item, key) of fields.client" v-bind:key="key" v-bind:value="item">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ data.client_data?.[key] }}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h4 class="card-title">Data Alamat</h4>

                            <table class="table table-nowrap mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of fields.address" v-bind:key="key" v-bind:value="item">
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
                                    <tr v-for="(item, key) of fields.vehicle_base" v-bind:key="key" v-bind:value="item">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ data[key] }}</td>
                                    </tr>
                                    <tr v-for="(item, key) of fields.vehicle_data" v-bind:key="key" v-bind:value="item">
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
                                    <tr v-for="(item, key) of fields.transaction" v-bind:key="key" v-bind:value="item">
                                        <td scope="row">{{ item }}</td>
                                        <td>{{ data[key] }}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h4 class="card-title">Data Pembayaran</h4>

                            <table class="table table-nowrap mt-4 mb-4">
                                <tbody>
                                    <tr v-for="(item, key) of fields.payment" v-bind:key="key" v-bind:value="item">
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
                                    <tr v-for="item of data.expansions" v-bind:key="item" v-bind:value="item">
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
        <!-- <div class="row mb-4">
            <div class="col-12">
                <b-modal size="lg" scrollable ref="exp-form-modal" title="Tambah Ekspansi"
                    ok-title="Submit" @ok.prevent="triggerExpansion" cancel-title="Batal">
                    <div class="d-block text-justify">
                        <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="submitExpansion">
                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">Label
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <input
                                        type="text"
                                        v-model="expansion.label"
                                        class="form-control"
                                        placeholder="Masukkan Label"
                                        required>
                                </div>
                            </div>

                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">Rate
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="1"
                                        v-model="expansion.rate"
                                        class="form-control"
                                        placeholder="Masukkan Rate"
                                        required>
                                </div>
                            </div>

                            <button ref="create-expansion" class="d-none"></button>

                        </form>
                    </div>
                </b-modal>

                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Daftar Ekspansi Produk</h4>

                        <b-button class="mb-3" variant="primary" @click="createExpansion">
                            <i class="uil uil-plus"/> Tambah Ekspansi
                        </b-button>

                        <div class="table-responsive">
                            <b-table ref="table" :items="data.expansions" :fields="fields.expansion" show-empty>

                                <template #cell(id)="data">
                                    {{ data.index + 1 }}
                                </template>

                                <template #cell(action)="data">
                                    <b-button type="button" variant="secondary" v-b-tooltip.hover
                                        title="Edit Ekspansi" v-on:click="editExpansion(data.item.id)">
                                        <i class="uil uil-pen"/>
                                    </b-button>

                                    <b-button type="button" variant="danger" v-b-tooltip.hover
                                        title="Hapus Ekspansi" v-on:click="deleteExpansion(data.item.id)">
                                        <i class="uil uil-trash"/>
                                    </b-button>
                                </template>

                            </b-table>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
        <!-- end row -->
    </div>
    </template>

    <script>
    let ClassicEditor

    if (process.client) {
        ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
    }

    import Swal from "sweetalert2"
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
                data: {
                    id: null,
                    product_image: null,
                    product_name: null,
                    client_data: {
                        fullname: null,
                        email: null,
                        phone: null,
                    },
                    name: null,
                    type: null,
                    description: null,
                    image: null,
                    tnc: null,
                    claim: null,
                    brochure_file: null,
                    workshop_file: null,
                    workshop_count: 0,
                    features: []
                },
                feature: {
                    name: null,
                    description: null,
                    short_description: null,
                    type: null,
                },
                expansion: {}
            };
        },
        mounted() {
            this.data = this.getData()
        },
        validations: {
            feature: {
                name: { required },
                description: { required },
                type: { required },
            },
            expansion: {
                label: { required },
                rate: { required },
            },
        },
        methods: {
            validateState(validation) {
                const { $dirty, $error } = validation
                return $dirty ? !$error : null
            },
            async getData() {
                await this.$axios.$get(`api/admin/transaction/${this.id}/detail`)
                    .then(response => this.data = response.data)
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
            }
        }
    };
    </script>