<template>
    <div>
        <PageHeader :title="title" />
        <div class="row">
            <div class="col-12">
                <b-modal size="lg" scrollable ref="form-modal" title="Tambah Data"
                ok-title="Submit" @ok.prevent="triggerSubmit" cancel-title="Batal">
                    <div class="d-block text-justify">
                        <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="submitData">
                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">File
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">

                                </div>
                            </div>

                            <button ref="create-data" class="d-none"></button>

                        </form>
                    </div>
                </b-modal>

                <b-modal size="lg" scrollable ref="detail-modal" title="Detail Kendaraan"
                ok-only ok-title="Tutup">
                    <div class="card-body">
                        <div class="text-muted">
                            <h5 class="font-size-16">Daftar Harga</h5>
                            <div class="table-responsive">
                                <table class="table table-striped mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Tahun</th>
                                            <th>Harga</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, i) of vehicle.prices" :key="i">
                                            <th scope="row">{{ i + 1 }}</th>
                                            <td>{{ item.year }}</td>
                                            <td>{{ formatPrice(item.price) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- <div v-if="feature.short_description" class="text-muted mb-3">
                            <h5 class="font-size-16">Deskripsi Singkat</h5>
                            <p v-html="feature.short_description"></p>
                        </div>

                        <div class="text-muted">
                            <h5 class="font-size-16">Deskripsi</h5>
                            <p v-html="getDescription()"></p>
                        </div> -->
                    </div>
                </b-modal>

                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Tabel {{ title }}</h4>
                        <div class="btn-group mt-1" role="group" aria-label="Basic example">
                            <b-button type="button" class="me-1" variant="info" v-b-tooltip.hover
                                title="Unduh Template" @click="downloadXls()">
                                <i class="uil uil-file-download-alt"></i>
                            </b-button>
                            <b-button type="button" variant="primary" @click="showUpload()">
                                <b-form-file
                                    ref="vehicle_file"
                                    v-model="vehicle.file"
                                    class="d-none hidden"
                                    accept=".xlsx, .xls"
                                    plain
                                    required="required"
                                    @change="(e) => onFileChange(e)"
                                />
                                <i class="uil uil-upload me-1"></i> Upload CSV
                            </b-button>
                        </div>

                        <div class="row">
                            <div class="col-md-3 mt-2">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">Brand</label>
                                    <div>
                                        <select
                                            class="form-select"
                                            v-model="filterForm.brand">
                                            <option v-for="option in filterList.brands" v-bind:value="option.value"
                                                v-bind:key="option.text">{{ option.text }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-2">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">Tipe</label>
                                    <div>
                                        <select
                                            class="form-select"
                                            v-model="filterForm.type">
                                            <option v-for="option in filterList.types" v-bind:value="option.value"
                                                v-bind:key="option.text">{{ option.text }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-2">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">Kategori</label>
                                    <div>
                                        <select
                                            class="form-select"
                                            v-model="filterForm.category">
                                            <option v-for="option in filterList.categories" v-bind:value="option.value"
                                                v-bind:key="option.text">{{ option.text }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-2">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">Aksi</label>
                                    <div>
                                        <b-button type="button" variant="primary" @click="doFilter()">
                                            <i class="uil uil-filter me-1"></i> Filter
                                        </b-button>
                                        <b-button type="button" variant="danger" @click="doResetFilter()"
                                            v-b-tooltip.hover
                                            title="Hapus Filter">
                                            <i class="uil uil-multiply"></i>
                                        </b-button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-4">
                            <div class="col-sm-12 col-md-6">
                                <div id="tickets-table_length" class="dataTables_length">
                                    <label class="d-inline-flex align-items-center">
                                        Show&nbsp;
                                        <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                                    </label>
                                </div>
                            </div>
                        </div>
                        <!-- Table -->
                        <div class="table-responsive mb-0">
                            <b-table ref="table" :items="getData" :fields="fields" responsive="sm"
                                :per-page="perPage" :current-page="currentPage"
                                show-empty>

                                <template #cell(index)="data">
                                    {{ (currentPage - 1) * perPage + data.index + 1 }}
                                </template>

                                <template #cell(status)="data">
                                    <h5>
                                        <b-badge v-if="data.item.is_private"
                                            class="badge bg-success">Pribadi</b-badge>

                                        <b-badge v-if="data.item.is_commercial"
                                            class="badge bg-danger">Komersil</b-badge>

                                        <b-badge v-if="data.item.is_comprehensive"
                                            class="badge bg-soft-primary">Komprehensif</b-badge>

                                        <b-badge v-if="data.item.is_tlo"
                                            class="badge bg-soft-primary">Total Loss</b-badge>
                                    </h5>
                                </template>

                                <template #cell(action)="data">
                                    <b-button type="button" variant="primary" v-b-tooltip.hover
                                        title="Lihat Detail" v-on:click="showDetail(data.item)">
                                        <i class="uil uil-eye"/>
                                    </b-button>

                                    <!-- <b-button type="button" variant="danger" v-b-tooltip.hover
                                        title="Hapus Data" v-on:click="deleteData(data.item.id)">
                                        <i class="uil uil-trash"/>
                                    </b-button> -->
                                </template>

                            </b-table>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="dataTables_paginate paging_simple_numbers float-end">
                                    <ul class="pagination pagination-rounded mb-0">
                                        <!-- pagination -->
                                        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2"
import { required } from "vuelidate/lib/validators"

export default {
    layout: 'admin',
    data() {
        return {
            tableData: [],
            title: "Daftar Kendaraan",
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 25, 50],
            filterList: {
                brand: [{ value: null, text: 'Pilih Brand' }],
                type: [{ value: null, text: 'Pilih Tipe' }],
                category: [{ value: null, text: 'Pilih Kategori' }],
            },
            filterForm: {
                brand: null,
                type: null,
                category: null
            },
            sortDesc: false,
            fields: [
                { key: "index", label: '#', tdClass: 'align-middle' },
                { key: "brand", label: 'Nama Brand', tdClass: 'align-middle' },
                { key: "code", label: 'Kode', tdClass: 'align-middle' },
                { key: "sub_model", label: 'Sub Model', tdClass: 'align-middle' },
                { key: "vehicle_type", label: 'Tipe Kendaraan', tdClass: 'align-middle' },
                { key: "category", label: 'Kategori', tdClass: 'align-middle' },
                { key: "status", label: 'Status', tdClass: 'align-middle' },
                { key: "action", label: 'Aksi', tdClass: 'align-middle' },
            ],
            isCreate: true,
            backup: {},
            vehicle: {
                file: null,
                detail: null,
                prices: []
            },
            form: {
                name: null,
                route: null,
            },
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`
        }
    },
    computed: {
        /**
         * Total no. of records
         */
        rows() {
            return this.totalRows
        }
    },
    async mounted() {
        // Set the initial number of items
        this.totalRows = this.tableData.length
        this.backup['form'] = Object.assign({}, this.form)

        this.filterList = {
            brands: await this.vehicleBrands(),
            types: await this.vehicleTypes(),
            categories: await this.vehicleCategories(),
        }
    },
    validations: {
        form: {
            name: { required },
            route: { required },
        },
    },
    methods: {
        /**
         * Search the table data with search input
         */
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        async vehicleBrands() {
            return await this.$axios.$get('api/admin/vehicle/item/brands')
                .then ((response) => {
                    const list = response.data.map(item =>
                        item = { value: item.brand, text: item.brand })

                    return [
                        { value: null, text: 'Pilih Brand' },
                        ...list
                    ]
                })
                .catch ([])
        },
        async vehicleTypes() {
            return await this.$axios.$get('api/admin/vehicle/item/types')
                .then ((response) => {
                    const list = response.data.map(item =>
                        item = { value: item.vehicle_type, text: item.vehicle_type })

                    return [
                        { value: null, text: 'Pilih Tipe Kendaraan' },
                        ...list
                    ]
                })
                .catch ([])
        },
        async vehicleCategories() {
            return await this.$axios.$get('api/admin/vehicle/item/categories')
                .then ((response) => {
                    const list = response.data.map(item =>
                        item = { value: item.category, text: item.category })

                    return [
                        { value: null, text: 'Pilih Kategori Kendaraan' },
                        ...list
                    ]
                })
                .catch ([])
        },
        doFilter() {
            this.getData()
            this.$refs.table.refresh()
        },
        doResetFilter() {
            this.filterForm = {
                brand: null,
                type: null,
                category: null
            }

            this.getData()
            this.$refs.table.refresh()
        },
        async getData() {
            this.tableData = await this.$axios.$get('api/admin/vehicle/list', {
                    params: {
                        brand: this.filterForm.brand,
                        vehicle_type: this.filterForm.type,
                        category: this.filterForm.category,
                        // limit
                        current: this.currentPage,
                        limit: this.perPage,
                    }
                })
                .then ((response) => {
                    this.totalRows = response.data.pagination.total

                    return response.data.list
                })
                .catch ([])

            return this.tableData
        },
        async showDetail(item) {
            this.vehicle.prices = await this.getPriceList(item.id)
            this.$refs['detail-modal'].show()
        },
        async getPriceList(id) {
            return await this.$axios.$get(`api/admin/vehicle/prices?vehicle_id=${id}`)
                .then ((response) => response.data)
                .catch ([])
        },
        downloadXls() {
            window.open(`/doc/Tokopolis Vehicle Data.xlsx`)
        },
        showUpload() {
            this.$refs['vehicle_file'].$el.click()
        },
        onFileChange(e) {
            if (!e.target.files[0]) return

            const formData = new FormData()

            formData.append('vehicle_file', e.target.files[0])

            this.$axios.$post('api/admin/vehicle/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(function(response) {
                window.location.reload()
            })
        },
        // triggerSubmit() {
        //     this.$refs['create-data'].click()
        // },
        // showEdit(item) {
        //     this.isCreate = false
        //     this.form = Object.assign({}, item)
        //     this.$refs['form-modal'].show()
        // },
        // async submitData(e) {
        //     e.preventDefault()

        //     if (this.$v.form.$touch() || this.$v.form.$anyError) return

        //     if (this.isCreate)
        //         return this.doCreateData()

        //     return this.doUpdateData()
        // },
        // async doCreateData() {
        //     return await this.$axios.$post('api/admin/endpoint', this.form)
        //         .then(response => {
        //             this.$refs['form-modal'].hide()

        //             Swal.fire("Berhasil", "Berhasil Menambah Data", "success")
        //             window.location.reload()
        //         })
        // },
        // async doUpdateData() {
        //     const data = this.$formCheck(this.form, ['id'])

        //     return await this.$axios.$put(`api/admin/endpoint/${this.form.id}`, data)
        //         .then(response => {
        //             this.$refs['form-modal'].hide()

        //             Swal.fire("Berhasil", "Berhasil Mengubah Data", "success")
        //             window.location.reload()
        //         })
        // },
        // async deleteData(id) {
        //     let context = this

        //     await Swal.fire({
        //         title: "Yakin ingin menghapus data ini?",
        //         text: "Aksi tidak dapat dibatalkan!",
        //         icon: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#34c38f",
        //         cancelButtonColor: "#f46a6a",
        //         confirmButtonText: "Lanjut Hapus",
        //         cancelButtonText: "Batalkan"
        //     }).then(result => {
        //         if (result.value) {
        //             return context.$axios.delete(`/api/admin/endpoint/${id}`)
        //                 .then(() => window.location.reload())
        //         }
        //     })
        // }
    }
}
</script>

