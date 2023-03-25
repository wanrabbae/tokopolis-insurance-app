<template>
    <div>
        <PageHeader :title="title" />

        <b-modal size="lg" scrollable ref="form-update-status" title="Update Status"
        ok-title="Submit" @ok.prevent="triggerUpdate" cancel-title="Batal">
            <div class="d-block text-justify">
                <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="doUpdateStatus">
                    <div role="group" class="row form-group mb-3">
                        <label class="col-sm-2 col-lg-2 col-form-label">Status
                            <label class="text-danger">*</label>
                        </label>
                        <div class="col-sm-10 col-lg-10">
                            <select v-model="updateStatus.newStatus" class="form-select">
                                <option value="surveyed">surveyed</option>
                                <option value="accepted">accepted</option>
                                <option value="declined">declined</option>
                                <option value="fixed">fixed</option>
                                <option value="ready">ready</option>
                                <option value="done">done</option>
                            </select>
                        </div>
                    </div>

                    <button ref="update-data-status" class="d-none"></button>

                </form>
            </div>
        </b-modal>

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Tabel {{ title }}</h4>

                        <b-button class="mt-3" href="products/create" variant="primary">
                            <i class="uil uil-plus"/> Tambah
                        </b-button>

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

                                <template #empty="scope">
                                    <h4>{{ scope.emptyText }}</h4>
                                </template>

                                <template #cell(transaction_id)="data">
                                    <span v-b-tooltip.hover :title="data.item.transaction_id">{{ data.item.transaction_id }}</span>
                                </template>

                                <template #cell(plate_number)="data">
                                    <span v-b-tooltip.hover :title="data.item.plate_number">{{ data.item.plate_number }}</span>
                                </template>

                                <template #cell(reporter_fullname)="data">
                                    <span v-b-tooltip.hover :title="data.item.reporter_fullname">{{ data.item.reporter_fullname }}</span>
                                </template>

                                <template #cell(holder_fullname)="data">
                                    <span v-b-tooltip.hover :title="data.item.holder_fullname">{{ data.item.holder_fullname }}</span>
                                </template>

                                <template #cell(incident_time)="data">
                                    <span v-b-tooltip.hover :title="data.item.incident_time">{{ moment(data.item.incident_time).format('DD/MM/YYYY HH:mm:ss') }}</span>
                                </template>

                                <template #cell(action)="data">
                                    <b-button v-b-tooltip.hover
                                        title="Update Status" type="button" variant="primary"
                                        @click="showUpdateStatus(data.item.id)">
                                        <i class="uil uil-check-circle" ></i>
                                    </b-button>

                                    <b-button v-b-tooltip.hover
                                        title="Download File"  type="button" variant="success"
                                        @click="downloadFile(data.item.id)">
                                        <i class="uil uil-download-alt" ></i>
                                    </b-button>

                                    <b-button v-b-tooltip.hover
                                        title="Send File to Insurance"  type="button" variant="warning"
                                        @click="sendEmail(data.item.id)">
                                        <i class="uil uil-fast-mail" ></i>
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
            title: "Daftar Klaim",
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
                name: null,
                type: null,
            },
            filter: null,
            filterOn: [],
            sortDesc: false,
            fields: [
                { key: "id", tdClass: 'align-middle', sortable: true },
                { key: "transaction_id", label: 'No. Transaksi', tdClass: 'align-middle' },
                { key: "plate_number", label: 'Plat Nomor', tdClass: 'align-middle', sortable: false },
                { key: "reporter_fullname", label: 'Reporter', tdClass: 'align-middle', sortable: false },
                { key: "holder_fullname", label: 'Holder', tdClass: 'align-middle', sortable: false },
                { key: "incident_time", label: 'Incident Time', tdClass: 'align-middle', sortable: false },
                { key: "location", label: 'Location', tdClass: 'align-middle', sortable: false },
                { key: "status", label: 'Status', tdClass: 'align-middle', sortable: false },
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
                name: null,
                type: null,
            }
            this.getData()
            this.$refs.table.refresh()
        },
        async getData() {
            this.tableData = await this.$axios.$get('api/admin/claim/all', {
                    params: {
                        current: this.currentPage,
                        limit: this.perPage,
                        name: this.filterForm.name,
                        type: this.filterForm.type,
                    }
                })
                .then (response => {
                    this.totalRows = /* response.data.pagination.total || */ response.data.length;
                    return response.data;
                })
        },
        showDetail(id) {
            this.$router.push({ path: `/products/${id}` })
        },
        showUpdateStatus(id) {
            const selectedClaim = this.tableData.find((item) => item.id === id);
            this.$refs['form-update-status'].title = "Update Status Claim " + selectedClaim.transaction_id;
            this.updateStatus.newStatus = selectedClaim.status;
            this.updateStatus.selectedId = id;
            this.$refs['form-update-status'].show();
        },
        moment(date) {
            return moment(date)
        },
        async doUpdateStatus(e) {
            e.preventDefault();
            return await this.$axios.$put(`api/admin/claim/${this.updateStatus.selectedId}/update-staging`, {status: this.updateStatus.newStatus})
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
        }
    }
}
</script>
