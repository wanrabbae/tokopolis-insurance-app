<template>
    <div>
        <PageHeader :title="title" />
        <div class="row">
            <div class="col-12">
                <b-modal size="xl" scrollable ref="form-modal" title="Tambah Data"
                ok-title="Submit" @ok.prevent="triggerSubmit" cancel-title="Batal">
                    <div class="d-block text-justify">
                        <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="submitData">
                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">Nama
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <input
                                        type="text"
                                        v-model="form.name"
                                        class="form-control"
                                        placeholder="Masukkan Nama Role"
                                        required>
                                </div>
                            </div>

                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">Endpoint
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10 row">
                                    <div v-for="(item, index) in data.endpoint" :key="item.id"
                                        class="col-lg-4 col-sm-5 mt-2">
                                        <input
                                            type="checkbox"
                                            class="form-check-input"
                                            @change="onChecked($event, item.id)"
                                            :checked="arrayContain(item.id)"
                                            :id="index"/>
                                        <label class="form-check-label ms-1" :for="index">
                                            {{ item.name }}</label>
                                    </div>
                                </div>
                            </div>

                            <button ref="create-data" class="d-none"></button>

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
                        </div>
                        <!-- Table -->
                        <div class="table-responsive mb-0">
                            <b-table ref="table" :items="getData" :fields="fields" responsive="sm"
                                show-empty>

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
            title: "Daftar Role",
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 25, 50],
            filter: null,
            filterOn: [],
            sortDesc: false,
            fields: [
                { key: "index", label: '#', tdClass: 'align-middle' },
                { key: "name", label: 'Nama Role', tdClass: 'align-middle' },
                { key: "action", label: 'Aksi', tdClass: 'align-middle' },
            ],
            isCreate: true,
            data: {
                endpoint: []
            },
            backup: {},
            form: {
                name: null,
                endpoints: [],
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
    mounted() {
        // Set the initial number of items
        this.totalRows = this.tableData.length
        this.backup['form'] = Object.assign({}, this.form)

        this.getEndpoints()
    },
    validations: {
        form: {
            name: { required },
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
            this.tableData = await this.$axios.$get('api/admin/role/list')
                .then ((response) => {
                    this.totalRows = response.data.pagination.length

                    var result = response.data.list.map(i => {
                        i.endpoints = i.role_endpoints.map(y => y = y.endpoint_id)
                        delete i.role_endpoints
                        return i
                    })

                    return result
                })
                .catch ([])

            return this.tableData
        },
        async getEndpoints() {
            await this.$axios.$get('api/admin/endpoint/all')
                .then ((response) => {
                    this.data.endpoint = response.data
                })
                .catch ([])
        },
        onChecked(event, id) {
            const status = event.target.checked
            const item = this.form.endpoints.find(e => e == id)

            if (status && item == null)
                this.form.endpoints.push(id)
            else if (!status && item != null) {
                const index = this.form.endpoints.findIndex(e => e == id)
                this.form.endpoints.splice(index, 1)
            }
        },
        arrayContain(id) {
            return this.form.endpoints.findIndex(e => e == id) != -1
        },
        showCreate() {
            this.isCreate = true

            this.form = Object.assign({}, this.backup['form'])
            this.$refs['form-modal'].show()
        },
        showEdit(item) {
            this.isCreate = false
            this.form = Object.assign({}, item)
            this.$refs['form-modal'].show()

        },
        triggerSubmit() {
            this.$refs['create-data'].click()
        },
        async submitData(e) {
            e.preventDefault()

            if (this.$v.form.$touch() || this.$v.form.$anyError) return

            if (this.isCreate)
                return this.doCreateData()

            return this.doUpdateData()
        },
        async doCreateData() {
            return await this.$axios.$post('api/admin/role', this.form)
                .then(response => {
                    this.$refs['form-modal'].hide()

                    Swal.fire("Berhasil", "Berhasil Menambah Data", "success")
                    window.location.reload()
                })
        },
        async doUpdateData() {
            const data = this.$formCheck(this.form, ['id', 'created_at',
                'updated_at', 'deleted_at'])

            return await this.$axios.$put(`api/admin/role/${this.form.id}`, data)
                .then(response => {
                    this.$refs['form-modal'].hide()

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

