<template>
    <div>
        <PageHeader :title="title" />
        <div class="row">
            <div class="col-12">
                <b-modal size="xl" scrollable ref="form-create" title="Tambah Data"
                ok-title="Submit" @ok.prevent="triggerCreate" cancel-title="Batal">
                    <div class="d-block text-justify">
                        <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="doCreateData">
                            <div v-for="(item, index) in formList" :key="item.id" class="row">
                                <div class="col-md-3 mt-2">
                                    <div role="group" class="form-group">
                                        <label class="col-form-label">Nama
                                            <label class="text-danger">*</label>
                                        </label>
                                        <div>
                                            <input
                                                type="text"
                                                v-model="item.name"
                                                class="form-control"
                                                placeholder="Masukkan Nama Endpoint"
                                                required>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4 mt-2">
                                    <div role="group" class="form-group">
                                        <label class="col-form-label">Route
                                            <label class="text-danger">*</label>
                                        </label>
                                        <div>
                                            <input
                                                type="text"
                                                v-model="item.route"
                                                class="form-control"
                                                placeholder="Masukkan Link Route"
                                                required>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-3 mt-2">
                                    <div role="group" class="form-group">
                                        <label class="col-form-label">Method
                                            <label class="text-danger">*</label>
                                        </label>
                                        <div>
                                            <select
                                                class="form-select"
                                                v-model="item.method"
                                                required>
                                                <option v-for="option in data.method" v-bind:value="option.value"
                                                    v-bind:key="option.text">{{ option.text }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-2 col-lg-2 mt-2">
                                    <div role="group" class="form-group">
                                        <label class="col-form-label">Aksi</label>
                                        <div class="mt-2">
                                            <input type="button" class="btn btn-danger btn-block inner"
                                                value="Hapus" @click="deleteContent(index)" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-10 col-lg-8 mt-3">
                                <input type="button" class="btn btn-success inner"
                                    value="Tambah Baris" @click="addContent" />
                            </div>

                            <button ref="create-data" class="d-none"></button>

                        </form>
                    </div>
                </b-modal>

                <b-modal size="lg" scrollable ref="form-update" title="Update Data"
                ok-title="Submit" @ok.prevent="triggerUpdate" cancel-title="Batal">
                    <div class="d-block text-justify">
                        <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="doUpdateData">
                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">Nama
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <input
                                        type="text"
                                        v-model="form.name"
                                        class="form-control"
                                        placeholder="Masukkan Nama Endpoint"
                                        required>
                                </div>
                            </div>

                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">Route
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <input
                                        type="text"
                                        v-model="form.route"
                                        class="form-control"
                                        placeholder="Masukkan Link Route"
                                        required>
                                </div>
                            </div>

                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">Method
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <select
                                        class="form-select"
                                        v-model="form.method"
                                        required>
                                        <option v-for="option in data.method" v-bind:value="option.value"
                                            v-bind:key="option.text">{{ option.text }}</option>
                                    </select>
                                </div>
                            </div>

                            <button ref="update-data" class="d-none"></button>

                        </form>
                    </div>
                </b-modal>

                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Tabel {{ title }}</h4>
                        <b-button class="mt-1" variant="primary" @click="showCreate">
                            <i class="uil uil-plus"/> Tambah
                        </b-button>

                        <div class="row mt-4">
                            <div class="col-sm-12 col-md-6">
                                <div id="tickets-table_length" class="dataTables_length">
                                    <label class="d-inline-flex align-items-center">
                                        Show&nbsp;
                                        <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                                    </label>
                                </div>
                            </div>
                            <!-- Search -->
                            <div class="col-sm-12 col-md-6">
                                <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                                    <label class="d-inline-flex align-items-center">
                                        Search:&nbsp;
                                        <b-form-input v-model="filter" type="search" class="form-control form-control-sm ml-2"></b-form-input>
                                    </label>
                                </div>
                            </div>
                            <!-- End search -->
                        </div>
                        <!-- Table -->
                        <div class="table-responsive mb-0">
                            <b-table ref="table" :items="getData" :fields="fields" responsive="sm" :per-page="perPage"
                                :current-page="currentPage" :sort-desc.sync="sortDesc"
                                :filter="filter" :filter-included-fields="filterOn"
                                @filtered="onFiltered" show-empty>

                                <template #cell(index)="data">
                                    {{ (currentPage - 1) * perPage + data.index + 1 }}
                                </template>

                                <template #cell(action)="data">
                                    <b-button type="button" variant="primary" v-b-tooltip.hover
                                        title="Edit Data" v-on:click="showEdit(data.item)">
                                        <i class="uil uil-edit"/>
                                    </b-button>

                                    <b-button type="button" variant="danger" v-b-tooltip.hover
                                        title="Hapus Data" v-on:click="deleteData(data.item.id)">
                                        <i class="uil uil-trash"/>
                                    </b-button>
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
            title: "Daftar Endpoint",
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 25, 50],
            filter: null,
            filterOn: [],
            sortDesc: false,
            fields: [
                { key: "index", label: '#', tdClass: 'align-middle' },
                { key: "name", label: 'Nama Endpoint', tdClass: 'align-middle' },
                { key: "route", label: 'Link Route', tdClass: 'align-middle' },
                { key: "method", label: 'Method', tdClass: 'align-middle' },
                { key: "action", label: 'Aksi', tdClass: 'align-middle' },
            ],
            isCreate: true,
            data: {
                method: [
                    { value: null, text: 'Pilih Method' },
                    { value: 'GET', text: 'GET' },
                    { value: 'POST', text: 'POST' },
                    { value: 'PUT', text: 'PUT' },
                    { value: 'PATCH', text: 'PATCH' },
                    { value: 'DELETE', text: 'DELETE' },
                ],
            },
            backup: {},
            formList: [{
                id: 1,
                name: null,
                route: null,
                method: null,
            }],
            form: {
                name: null,
                route: null,
                method: null,
            }
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
    mounted() {
        // Set the initial number of items
        this.totalRows = this.tableData.length
        this.backup['form'] = Object.assign({}, this.form)
    },
    validations: {
        form: {
            name: { required },
            route: { required },
            method: { required },
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
        async getData() {
            this.tableData = await this.$axios.$get('api/admin/endpoint/list', {
                    params: {
                        current: this.currentPage,
                        limit: this.perPage,
                        query: this.filter
                    }
                })
                .then ((response) => {
                    this.totalRows = response.data.pagination.total

                    return response.data.list
                })
                .catch ([])

            return this.tableData
        },
        addContent() {
            this.formList.push({
                name: null,
                route: null,
                method: null,
            })
        },
        /**
         * Delete the row from form
         */
        deleteContent(index) {
            if (index > 0)
                this.formList.splice(index, 1)
        },
        showCreate() {
            this.form = Object.assign({}, this.backup['form'])
            this.$refs['form-create'].show()
        },
        showEdit(item) {
            this.form = Object.assign({}, item)
            this.$refs['form-update'].show()
        },
        triggerCreate() {
            this.$refs['create-data'].click()
        },
        triggerUpdate() {
            this.$refs['update-data'].click()
        },
        async doCreateData(e) {
            e.preventDefault()

            const finalForm = this.formList.map(item => {
                const data = item
                delete data.id

                return data
            })

            return await this.$axios.$post('api/admin/endpoint', finalForm)
                .then(response => {
                    this.$refs['form-create'].hide()

                    Swal.fire("Berhasil", "Berhasil Menambah Data", "success")
                    window.location.reload()
                })
        },
        async doUpdateData(e) {
            e.preventDefault()

            if (this.$v.form.$touch() || this.$v.form.$anyError) return

            const data = this.$formCheck(this.form, ['id', 'created_at',
                'updated_at', 'deleted_at'])

            return await this.$axios.$put(`api/admin/endpoint/${this.form.id}`, data)
                .then(response => {
                    this.$refs['form-update'].hide()

                    Swal.fire("Berhasil", "Berhasil Mengubah Data", "success")
                    window.location.reload()
                })
        },
        async deleteData(id) {
            let context = this

            await Swal.fire({
                title: "Yakin ingin menghapus data ini?",
                text: "Aksi tidak dapat dibatalkan!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Lanjut Hapus",
                cancelButtonText: "Batalkan"
            }).then(result => {
                if (result.value) {
                    return context.$axios.delete(`/api/admin/endpoint/${id}`)
                        .then(() => window.location.reload())
                }
            })
        }
    }
}
</script>

