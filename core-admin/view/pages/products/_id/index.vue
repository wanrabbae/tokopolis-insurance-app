<template>
<div>
    <PageHeader :title="title" />

    <div class="row mb-4">
        <div class="col-xl-6">
            <div class="card h-100">
                <div class="card-body">
                    <div class="text-center">
                        <b-dropdown class="float-end" variant="white" right toggle-class="font-size-16 text-body p-0">
                            <template v-slot:button-content>
                                <i class="uil uil-ellipsis-v"></i>
                            </template>
                            <a class="dropdown-item" :href="id + '/edit'">Edit</a>
                            <a class="dropdown-item" href="#" @click="deleteProduct(id)">Hapus</a>
                        </b-dropdown>
                        <div class="clearfix"></div>
                        <div>
                            <img :src="data.image" :alt="data.name" width="120" />
                        </div>
                        <h5 class="mt-3 mb-1">{{ data.name }}</h5>
                        <p class="text-muted">{{ getType() }}</p>

                        <div class="mt-4">
                            <b-button v-if="data.brochure_file != null" type="button"
                                class="btn btn-sm" variant="primary"
                                :href="data.brochure_file" target="_blank">
                                <i class="uil uil-paperclip me-2"></i>
                                    Brosur Produk
                            </b-button>
                            <b-button v-if="data.workshop_file != null" type="button"
                                class="btn btn-sm" variant="primary"
                                :href="data.workshop_file" target="_blank">
                                <i class="uil uil-paperclip me-2"></i>
                                    List Bengkel
                                    <span class="badge bg-light rounded-pill">
                                        {{ data.workshop_count }}
                                    </span>
                            </b-button>
                        </div>
                    </div>

                    <hr class="my-4" />

                    <div class="text-muted">
                        <h5 class="font-size-16">Alamat Email</h5>
                        <p v-html="data.email"></p>
                    </div>

                    <div class="text-muted">
                        <h5 class="font-size-16">Deskripsi</h5>
                        <p v-html="data.description"></p>
                    </div>

                    <div class="text-muted">
                        <h5 class="font-size-16">Fitur Plus</h5>
                        <h5>
                            <b-badge v-if="data.commission != 0"
                                class="badge bg-info">Komisi: {{ data.commission }}%</b-badge>

                            <b-badge v-if="data.extra_point != 0"
                                class="badge bg-info">Extra Poin: {{ data.extra_point }}%</b-badge>

                            <b-badge v-if="data.commission == 0 && data.extra_point == 0"
                                class="badge bg-danger">Tidak Tersedia</b-badge>
                        </h5>
                    </div>

                    <div class="text-muted mt-2">
                        <h5 class="font-size-16">Dukungan Brand</h5>
                        <h5 v-if="data.supported_brands != null">
                            <b-badge v-for="brand in data.supported_brands.split(',')"
                                v-bind:key="brand"
                                class="badge bg-primary me-1">{{ titleCase(brand) }}</b-badge>
                        </h5>
                        <h5 v-else>
                            <b-badge class="badge bg-success">Semua Brand</b-badge>
                        </h5>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-6">
            <div class="card mb-0">
                <b-tabs content-class="p-4" justified class="nav-tabs-custom">
                    <b-tab active>
                        <template v-slot:title>
                            <i class="uil uil-shield font-size-20"></i>
                            <span class="d-none d-sm-block">Syarat dan Ketentuan</span>
                        </template>
                        <div v-html="data.tnc"></div>
                    </b-tab>
                    <b-tab>
                        <template v-slot:title>
                            <i class="uil uil-car-sideview font-size-20"></i>
                            <span class="d-none d-sm-block">Klaim</span>
                        </template>
                        <div v-html="data.claim"></div>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
    </div>
    <div class="row mb-2">
        <div class="col-12">
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
                        <p v-html="getDescription()"></p>
                    </div>
                </div>
            </b-modal>

            <div class="card">
                <div class="card-body">
                    <h4 class="card-title">Daftar Fitur Produk</h4>

                    <b-button class="mb-3" variant="primary" @click="createFeature">
                        <i class="uil uil-plus"/> Tambah Fitur
                    </b-button>

                    <div class="table-responsive">
                        <b-table ref="table" :items="data.features" :fields="fields.feature" show-empty>

                            <template #cell(id)="data">
                                {{ data.index + 1 }}
                            </template>

                            <template #cell(action)="data">
                                <b-button type="button" variant="primary" v-b-tooltip.hover
                                    title="Lihat Fitur" v-on:click="showFeature(data.item.id)">
                                    <i class="uil uil-eye"/>
                                </b-button>

                                <b-button type="button" variant="secondary" v-b-tooltip.hover
                                    title="Edit Fitur" v-on:click="editFeature(data.item.id)">
                                    <i class="uil uil-pen"/>
                                </b-button>

                                <b-button type="button" variant="danger" v-b-tooltip.hover
                                    title="Hapus Fitur" v-on:click="deleteFeature(data.item.id)">
                                    <i class="uil uil-trash"/>
                                </b-button>
                            </template>

                        </b-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row mb-4">
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
    </div>
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
            title: "Detail Produk",
            editor: ClassicEditor,
            isCreate: true,
            fields: {
                feature: [
                    { key: "id", label: '#', tdClass: 'align-middle' },
                    { key: "name", label: 'Nama', tdClass: 'align-middle' },
                    { key: "type", label: 'Tipe', tdClass: 'align-middle' },
                    { key: "action", label: 'Aksi', tdClass: 'align-middle' },
                ],
                expansion: [
                    { key: "id", label: '#', tdClass: 'align-middle' },
                    { key: "label", label: 'Label', tdClass: 'align-middle' },
                    { key: "rate", label: 'Rate', tdClass: 'align-middle' },
                    { key: "action", label: 'Aksi', tdClass: 'align-middle' },
                ],
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
        this.getData()
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
            await this.$axios.$get(`api/admin/product/${this.id}`)
                .then(response => this.data = response.data)
        },
        getType() {
            return this.data.type?.replace(/(?:^|\s|-)\S/g, x => x.toUpperCase())
        },
        getDescription() {
            return this.feature.description?.replace(/<\/?[^>]+>/ig, " ")
        },
        async deleteProduct(id) {
            let context = this

            await Swal.fire({
                title: "Yakin ingin menghapus data ini?",
                text: "Aksi tidak dapat dibatalkan!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Lanjut",
                cancelButtonText: "Batal"
            }).then(result => {
                if (result.value) {
                    return context.$axios.delete(`/api/admin/product/${id}`)
                        .then(() => this.$router.push({ name: 'products' }))
                }
            })
        },
        createFeature() {
            // Reset all key
            Object.keys(this.feature).forEach(key => this.feature[key] = null)

            this.isCreate = true

            this.feature['product_id'] = this.id
            this.$refs['form-modal'].show()
        },
        showFeature(id) {
            const item = this.data.features.filter(i => i.id == id)
            if (item.length <= 0) return

            this.feature = Object.assign({}, item[0])
            this.$refs['show-modal'].show()
        },
        editFeature(id) {
            const item = this.data.features.filter(i => i.id == id)
            if (item.length <= 0) return

            this.isCreate = false

            this.feature = Object.assign({}, item[0])
            this.$refs['form-modal'].show()
        },
        triggerFeature() {
            this.$refs['create-feature'].click()
        },
        async submitFeature(e) {
            e.preventDefault()

            if (this.$v.feature.$touch() || this.$v.feature.$anyError) return

            if (this.isCreate)
                return this.createFeatureData()

            return this.updateFeatureData()
        },
        async createFeatureData() {
            const data = this.$formCheck(this.feature, ['id'])

            return await this.$axios.$post('api/admin/product/feature', data)
                .then(response => {
                    this.$refs['form-modal'].hide()

                    Swal.fire("Berhasil", "Berhasil Menambah Data", "success")
                    window.location.reload()
                })
        },
        async updateFeatureData() {
            const data = this.$formCheck(this.feature, ['id', 'product_id'])

            return await this.$axios.$put(`api/admin/product/feature/${this.feature.id}`, data)
                .then(response => {
                    this.$refs['form-modal'].hide()

                    Swal.fire("Berhasil", "Berhasil Mengubah Data", "success")
                    window.location.reload()
                })
        },
        async deleteFeature(id) {
            let context = this

            await Swal.fire({
                title: "Yakin ingin menghapus data ini?",
                text: "Aksi tidak dapat dibatalkan!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Lanjut",
                cancelButtonText: "Batal"
            }).then(result => {
                if (result.value) {
                    return context.$axios.delete(`/api/admin/product/feature/${id}`)
                        .then(() => window.location.reload())
                }
            })
        },
        createExpansion() {
            // Reset all key
            Object.keys(this.expansion).forEach(key => this.expansion[key] = null)

            this.isCreate = true

            this.expansion['product_id'] = this.id
            this.$refs['exp-form-modal'].show()
        },
        editExpansion(id) {
            const item = this.data.expansions.filter(i => i.id == id)
            if (item.length <= 0) return

            this.isCreate = false

            this.expansion = Object.assign({}, item[0])
            this.$refs['exp-form-modal'].show()
        },
        triggerExpansion() {
            this.$refs['create-expansion'].click()
        },
        async submitExpansion(e) {
            e.preventDefault()

            if (this.$v.expansion.$touch() || this.$v.expansion.$anyError) return

            if (this.isCreate)
                return this.createExpansionData()

            return this.updateExpansionData()
        },
        async createExpansionData() {
            const data = this.$formCheck(this.expansion, ['id'])

            return await this.$axios.$post('api/admin/product/expansion', data)
                .then(response => {
                    this.$refs['exp-form-modal'].hide()

                    Swal.fire("Berhasil", "Berhasil Menambah Data", "success")
                    window.location.reload()
                })
        },
        async updateExpansionData() {
            const data = this.$formCheck(this.expansion, ['id', 'product_id', 'name'])

            return await this.$axios.$put(`api/admin/product/expansion/${this.expansion.id}`, data)
                .then(response => {
                    this.$refs['exp-form-modal'].hide()

                    Swal.fire("Berhasil", "Berhasil Mengubah Data", "success")
                    window.location.reload()
                })
        },
        async deleteExpansion(id) {
            let context = this

            await Swal.fire({
                title: "Yakin ingin menghapus data ini?",
                text: "Aksi tidak dapat dibatalkan!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Lanjut",
                cancelButtonText: "Batal"
            }).then(result => {
                if (result.value) {
                    return context.$axios.delete(`/api/admin/product/expansion/${id}`)
                        .then(() => window.location.reload())
                }
            })
        },
    }
};
</script>