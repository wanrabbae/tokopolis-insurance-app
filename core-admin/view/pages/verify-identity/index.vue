<template>
    <div>
        <PageHeader :title="title" />

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Tabel {{ title }}</h4>

                        <!-- <b-button class="mt-3" href="products/create" variant="primary">
                            <i class="uil uil-plus"/> Tambah
                        </b-button> -->

                        <div class="row">
                            <div class="col-md-3 mt-2">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">Nama Pengguna</label>
                                    <div>
                                        <input type="text" class="form-control" placeholder="Input nama pengguna" v-model="filterForm.account_name">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-2">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">ID Pengguna</label>
                                    <div>
                                        <input type="text" class="form-control" placeholder="Input id pengguna" v-model="filterForm.account_id">
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

                        <div class="row mt-3">
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
                            <b-table ref="table" :items="getData" :fields="fields" responsive="sm" :per-page="perPage"
                                :current-page="currentPage" :sort-desc.sync="sortDesc"
                                :filter="filter" :filter-included-fields="filterOn"
                                @filtered="onFiltered" show-empty>

                                <template #cell(image)="data">
                                    <a :href="data.item.image" target="_blank">Foto Identitas</a>
                                </template>

                                <template #cell(type)="data">
                                    <span v-b-tooltip.hover :title="data.item.type">{{ data.item.type?.toUpperCase() }}</span>
                                </template>

                                <template #cell(status)="data">
                                    <span v-if="data.item.is_verified == 1">
                                        <b-badge class="badge bg-success">Verified</b-badge>    
                                    </span>
                                    <span v-if="data.item.is_verified == 0">
                                        <b-badge class="badge bg-danger">Unverified</b-badge>    
                                    </span>
                                </template>

                                <template #cell(action)="data">

                                    <b-button v-if="data.item.is_verified == 0" v-b-tooltip.hover
                                        title="Verify" type="button" variant="success"
                                        @click="verifikasiRekening(data.item.account_id,data.item.type)">
                                        <i class="uil uil-check-circle" ></i>
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
import moment from 'moment'
export default {
    layout: 'admin',
    data() {
        return {
            tableData: [],
            title: "Verifikasi Identitas",
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 25, 50],
            filterList: {
                types: [
                    { value: null, text: 'Pilih Tipe Kendaraan' },
                    { value: 'comprehensive', text: 'Komprehensif' },
                    { value: 'tlo', text: 'Total Loss' },
                ]
            },
            filterForm: {
                account_id: null,
                account_name: null,
            },
            filter: null,
            filterOn: [],
            sortDesc: false,
            fields: [
                { key: "account.fullname", label: 'Nama Pengguna', tdClass: 'align-middle' },
                { key: "account.id", label: 'ID Pengguna', tdClass: 'align-middle' },
                { key: "identity_number", label: 'Nomor Identitas', tdClass: 'align-middle', sortable: false },
                { key: "image", label: 'Foto Identitas', tdClass: 'align-middle', sortable: false },
                { key: "type", label: 'Jenis Identitas', tdClass: 'align-middle', sortable: false },
                { key: "status", label: 'Status Verifikasi', tdClass: 'align-middle', sortable: false },
                { key: "action", label: 'Aksi', tdClass: 'align-middle' },
            ],
            updateStatus: [
                {
                    newStatus: '',
                    selectedId: null
                }
            ]
        }
    },
    head() {
        return {
            title: `${this.title} | Nuxtjs Responsive Bootstrap 5 Admin Dashboard`
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
        doFilter() {
            this.getData()
            this.$refs.table.refresh()
        },
        doResetFilter() {
            this.filterForm = {
                account_id: null,
                account_name: null,
            }
            this.getData()
            this.$refs.table.refresh()
        },
        async getData() {
            this.tableData = await this.$axios.$get('api/admin/account/identity/list', {
                    params: {
                        current: this.currentPage,
                        limit: this.perPage,
                        account_id: this.filterForm.account_id,
                        account_name: this.filterForm.account_name,
                    }
                })
                .then (response => {
                    this.totalRows = /* response.data.pagination.total || */ response.data.pagination.total;
                    return response.data.list;
                })
            return this.tableData;
        },
        async verifikasiRekening(account_id, type) {
            return await this.$axios.$put(`/api/admin/account/identity/${account_id}/${type}`)
                .then(response => {
                    Swal.fire("Berhasil", "Berhasil Verifikasi Identitas", "success")
                    window.location.reload()
                })
        },
        moment(date) {
            return moment(date)
        },
        async doUpdateStatus(e) {
            e.preventDefault();
            return await this.$axios.$put(`api/admin/claim/${this.updateStatus.selectedId}/updateStaging`, {status: this.updateStatus.newStatus})
                .then(response => {
                    this.$refs['form-update-status'].hide()
                    Swal.fire("Berhasil", "Berhasil Mengubah Status", "success")
                    window.location.reload()
                })
        },
        triggerUpdate() {
            this.$refs['update-data-status'].click()
        },
        async sendEmail(id) {
            const selectedClaim = this.tableData.find((item) => item.id === id);
            const trx_id = selectedClaim.transaction_id;
            return await this.$axios.$put(`api/admin/claim/${trx_id}/generate-send`)
                .then(response => {
                    Swal.fire("Berhasil", "Berhasil Mengirim Email", "success")
                    window.location.reload();
                })
        },
        async donwloadReport() {
            await this.$axios.$post('/api/admin/claim/download')
                .then(response => {
                    if (response.data) {
                        window.open(`${response.data.download_link}`, '_blank');

                        window.location.reload();
                    }
                })
        }
    }
}
</script>
