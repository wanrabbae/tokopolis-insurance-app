<template>
    <div>

        <b-modal ref="form-withdraw-commission" cancel-title="Batal" size="lg" scrollable title="Withdraw Komisi" ok-title="Submit" @ok.prevent="triggerWithdrawCommission" >
            <div class="d-block text-justify">
                <form class="form-horizontal x-hidden" role="form" @submit.prevent="doWithdrawCommission" >
                    <div class="row">
                        <div class="col-md-12">
                            <div role="group" class="form-group">
                                <label class="col-form-label">Nama Bank
                                    <label class="text-danger">*</label>
                                </label>
                                <div>
                                    <input
                                        v-model="cmpoint.bankCode"
                                        class="form-control"
                                        type="text"
                                        required
                                        readonly/>
                                </div>
                            </div>
                            <div role="group" class="form-group">
                                <label class="col-form-label">Rekening atas nama
                                    <label class="text-danger">*</label>
                                </label>
                                <div>
                                    <input
                                        v-model="cmpoint.accountHolderName"
                                        class="form-control"
                                        type="text"
                                        required
                                        readonly/>
                                </div>
                            </div>
                            <div role="group" class="form-group">
                                <label class="col-form-label">No. Rekening
                                    <label class="text-danger">*</label>
                                </label>
                                <div>
                                    <input
                                        v-model="cmpoint.accountNumber"
                                        class="form-control"
                                        type="text"
                                        required
                                        readonly/>
                                </div>
                            </div>
                            <div role="group" class="form-group">
                                <label class="col-form-label">Komisi yang bisa ditarik
                                    <label class="text-danger">*</label>
                                </label>
                                <div>
                                    <input
                                        v-model="totalComissionFormatted"
                                        class="form-control"
                                        type="text"
                                        required
                                        readonly/>
                                </div>
                            </div>
                            <div role="group" class="form-group">
                                <label class="col-form-label">Amount
                                    <label class="text-danger">*</label>
                                </label>
                                <div>
                                    <input
                                        v-model="cmpoint.amount"
                                        class="form-control"
                                        type="number"
                                        required />
                                </div>
                            </div>

                            <button ref="withdraw-commission" class="d-none"></button>
                        </div>
                    </div>
                </form>
            </div>
        </b-modal>

        <div class="row">
            <div class="col-md-3 mt-2">
                <div role="group" class="form-group">
                    <label class="col-form-label">Range Tanggal</label>
                    <div>
                        <DatePicker
                            placeholder="Filter Tanggal"
                            valueType="YYYY-MM-DD"
                            titleFormat="DD MMMM"
                            v-model="filter.date_period"
                            range
                            append-to-body
                            lang="en"
                            confirm
                        ></DatePicker>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mt-2">
                <div role="group" class="form-group">
                    <label class="col-form-label">Nama User</label>
                    <div>
                        <input type="text" class="form-control" v-model="filter.name" placeholder="Input nama user">
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
        <div>
            <div class="row row mt-4 mb-2" v-if="account.role_id !== role.ROLE_ADMIN">
                <div class="col-md-12">
                    <b-button v-if="account.role_id === role.ROLE_AGENT" variant="primary" @click="showModalWdCommission">Withdraw Commission</b-button>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="table-responsive mb-0">
                        <b-table ref="table" :items="getData" :fields="fields" responsive="sm"
                            :per-page="perPage" :current-page="currentPage">

                            <template #cell(index)="data">
                                {{ (currentPage - 1) * perPage + data.index + 1 }}
                            </template>

                            <template #cell(created_at)="data">
                                {{ moment(data.item.created_at).format('D MMM yyyy HH:mm:ss') }}
                            </template>

                            <template #cell(value)="data">
                                Rp. {{ Intl.NumberFormat().format(data.item.value) }}
                            </template>

                            <template #cell(description)="data">
                                <div v-if="data.item.description === 'pemasukkan'">
                                    <span>Komisi Diterima dari Transaksi {{ data.item.transaction_id }}</span>
                                </div>
                                <div v-if="data.item.description === 'penarikan'">
                                    <span>Penarikan Komisi (ID: {{ data.transaction_id }})</span>
                                </div>
                                <div v-if="data.item.description === null">-</div>
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
</template>

<script>
import Swal from "sweetalert2"
import moment from 'moment';
import DatePicker from "vue2-datepicker"

import role from '../../../constants/roles'

import "vue2-datepicker/index.css"
export default {
    components: {
		DatePicker
    },
    data() {
        return {
            currentPage: 1,
            perPage: 5,
            totalRows: 1,
            fields: [
                { key: "index", label: '#', tdClass: 'align-middle' },
                { key: 'created_at', label: 'Tanggal' },
                { key: 'value', label: 'Komisi' },
                { key: 'description', label: 'Keterangan' },
            ],
            totalComission: 0,
            totalComissionFormatted: 0,
            cmpoint: {
                amount: null,
                bankCode: null,
                accountHolderName: null,
                accountNumber: null
            },
            filter: {
                date_period: null,
                name: null
            },
            account: [],
            role: role
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
        this.totalRows = this.fields.length
    },
    created() {
        this.getAccount()
        this.getData()
    },
    methods: {
        async getAccount() {
            this.account = await this.$axios.$get('api/admin/account')
                .then ((response) => {
                    return response.data;
                })
        },
        doFilter() {
            this.getData();
            this.$refs.table.refresh();
        },
        doResetFilter() {
            this.filter = {
                date_period: null,
                name: null,
            }

            this.getData()
            this.$refs.table.refresh()
        },
        moment(date) {
            return moment(date)
        },
        async getData() {
            let data = [];

            if (this.account.role_id !== role.ROLE_AGENT && this.account.role_id !== role.ROLE_ADMIN) {
                this.fields.splice(3, 0, { key: 'account.fullname', label: 'Nama User' });
                data = await this.$axios.$get('api/admin/comissions/history/under', {
                    params: {
                        name: this.filter.name,
                        start_period: this.filter.date_period === null ? null : this.filter.date_period[0],
                        end_period: this.filter.date_period === null ? null : this.filter.date_period[1],
                        current: this.currentPage,
                        limit: this.perPage
                    }
                }).then((resp) => {
                    this.totalRows = resp.data.pagination.total;
                    return resp.data.list;
                })
            } else {
                data = this.$axios.$get('/api/comissions/history').then((resp) => {
                    return resp.data;
                })
            }

            return data;
        },
        showModalWdCommission() {
            this.getComission();
            this.getBank();
            this.$refs['form-withdraw-commission'].show();
        },
        triggerWithdrawCommission() {
            this.$refs['withdraw-commission'].click();
        },
        async doWithdrawCommission(e) {
            e.preventDefault();


            return await this.$axios.$post('/api/comissions/withdraw', this.cmpoint)
                .then(resp => {
                    this.$refs['form-withdraw-commission'].hide()

                    this.$notify({
                        group: 'notif',
                        type: 'success vue-notif-custom',
                        title: 'Berhasil',
                        text: 'Proses Penarikan Komisi Berhasil',
                    })
                })
        },
        async getComission() {
            await this.$axios.$get('api/comissions')
                .then((response) => {
                    this.totalComission = response.data.total || 0
                    this.totalComissionFormatted = `Rp. ${Intl.NumberFormat().format(response.data.total)}` || 0
                })
                .catch(error => {
                    console.log(error)
                })
        },
        async getBank() {
            await this.$axios.$get('api/user/bank')
                .then((response) => {
                    if (response.data != null) {

                        if (response.data.is_verified === false) {
                            Swal.fire("Information", "Data rekening bank belum di verifikasi.", "error")
                        }

                        this.cmpoint = {
                            bankCode: response.data.type?.toUpperCase(),
                            accountNumber: response.data.account_number,
                            accountHolderName: response.data.fullname,
                            verified: response.data.is_verified,
                        }
                    }

                    if (response.data == null) {
                        Swal.fire("Information", "Data rekening bank belum ada.", "error")
                        this.$refs['form-withdraw-commission'].hide();
                    }
                })
        },
    }
}
</script>