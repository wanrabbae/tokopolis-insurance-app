<template>
    <div>
        <PageHeader :title="title" />
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Tabel {{ title }}</h4>
                        <div class="row">
                            <div class="col-md-3 mt-2">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">Nama User</label>
                                    <div>
                                        <input
                                            type="text"
                                            v-model="filterForm.fullname"
                                            class="form-control"
                                            placeholder="Masukkan Nama User"
                                            required>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-2">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">Email</label>
                                    <div>
                                        <input
                                            type="text"
                                            v-model="filterForm.email"
                                            class="form-control"
                                            placeholder="Masukkan Email"
                                            required>
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

                                <template #cell(fullname)="data">
                                    {{ data.item.subordinate_upgrades.fullname }}
                                </template>

                                <template #cell(email)="data">
                                    {{ data.item.subordinate_upgrades.email }}
                                </template>

                                <template #cell(date)="data">
                                    {{ moment(data.item.start_date).format('D MMM yyyy') }} -
                                    {{ moment(data.item.start_date).add(1, 'y').format('D MMM yyyy') }}
                                </template>

                                <template #cell(status)="data">
                                    <h5 v-if="data.value == 'waiting'">
                                        <b-badge class="badge bg-primary">Waiting</b-badge>
                                    </h5>
                                    <h5 v-else-if="data.value == 'approved'">
                                        <b-badge class="badge bg-success">Approved</b-badge>
                                    </h5>
                                </template>

                                <template #cell(action)="data">
                                    <b-button v-b-tooltip.hover title="Konfirmasi Upgrade"
                                        type="button" variant="success"
                                        v-on:click="approveData(data.item)">
                                        <i class="uil uil-thumbs-up"/></b-button>

                                    <b-button  v-b-tooltip.hover title="Tolak Upgrade"
                                        type="button" variant="danger"
                                        v-on:click="rejectData(data.item)">
                                        <i class="uil uil-thumbs-down"/></b-button>
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
import moment from 'moment'
import Swal from "sweetalert2"
import DatePicker from "vue2-datepicker"

import "vue2-datepicker/index.css"
import { required } from "vuelidate/lib/validators"

export default {
    layout: 'admin',
    components: {
		DatePicker
    },
    data() {
        return {
            tableData: [],
            title: "Daftar Role Upgrade",
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 25, 50],
            filterList: {
                brands: [],
                types: [],
                products: []
            },
            filterForm: {
                fullname: null,
                email: null,
            },
            sortDesc: false,
            fields: [
                { key: "index", label: '#', tdClass: 'align-middle' },
                { key: "fullname", label: 'Nama Pengguna', tdClass: 'align-middle' },
                { key: "email", label: 'Email', tdClass: 'align-middle' },
                { key: "status", label: 'Status', tdClass: 'align-middle' },
                { key: "action", label: 'Aksi', tdClass: 'align-middle' },
            ],
            isCreate: true,
            backup: {},
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
    },
    methods: {
        moment(date) {
            return moment(date)
        },
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
                fullname: null,
                email: null,
            }

            this.getData()
            this.$refs.table.refresh()
        },
        async getData() {
            this.tableData = await this.$axios.$get('api/admin/account/upgrade/list', {
                    params: {
                        fullname: this.filterForm.fullname,
                        email: this.filterForm.email,
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
        async approveData(item) {
            let context = this

            await Swal.fire({
                title: "Yakin ingin konfirmasi permintaan ini?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Lanjut Konfirmasi",
                cancelButtonText: "Batalkan"
            }).then(result => {
                if (result.value) {
                    context.action(item.id, 'approve')
                }
            })
        },
        async rejectData(item) {
            let context = this

            await Swal.fire({
                title: "Yakin ingin tolak permintaan ini?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Lanjut Tolak",
                cancelButtonText: "Batalkan"
            }).then(result => {
                if (result.value) {
                    context.action(item.id, 'reject')
                }
            })
        },
        async action(id, status) {
            return await this.$axios.put(`api/admin/account/${id}/upgrade`, {
                status: status,
            }).then((result) => {
                window.location.reload()
            })
        },
    }
}
</script>

