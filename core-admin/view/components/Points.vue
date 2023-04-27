<template>
    <div>

        <b-modal ref="form-withdraw-point" cancel-title="Batal" size="lg" scrollable title="Withdraw Point" ok-title="Submit" @ok.prevent="triggerWithdraw" >
            <div class="d-block text-justify">
                <form class="form-horizontal x-hidden" role="form" @submit.prevent="doWithdrawPoint" >
                    <div class="row">
                        <div class="col-md-12">
                            <div role="group" class="form-group">
                                <label class="col-form-label">Nama Bank
                                    <label class="text-danger">*</label>
                                </label>
                                <div>
                                    <input
                                        v-model="wdpoint.bankCode"
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
                                        v-model="wdpoint.accountHolderName"
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
                                        v-model="wdpoint.accountNumber"
                                        class="form-control"
                                        type="text"
                                        required 
                                        readonly/>
                                </div>
                            </div>
                            <div role="group" class="form-group">
                                <label class="col-form-label">Poin yang bisa ditarik
                                    <label class="text-danger">*</label>
                                </label>
                                <div>
                                    <input
                                        v-model="totalPoint"
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
                                        v-model="wdpoint.amount"
                                        class="form-control"
                                        type="number"
                                        required />
                                </div>
                            </div>

                            <button ref="withdraw-point" class="d-none"></button>
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
        <div v-if="account.role_id !== 1" class="row mt-4 mb-2">
            <div class="col-md-12">
                <b-button variant="primary" @click="showModalWdPoint">Withdraw Point</b-button>
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

                        <template #cell(description)="data">
                            <span v-if="data.item.description === 'pemasukan'">Point Diterima dari Transaksi {{ data.item.transaction_id }}</span>
                            <span v-if="data.item.description === 'penarikan'">Penarikan Poin (ID: {{ data.item.transaction_id }})</span>
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
</template>

<script>
import Swal from "sweetalert2"
import moment from 'moment';
import DatePicker from "vue2-datepicker"

import "vue2-datepicker/index.css"
export default {
    components: {
		DatePicker
    },
    data() {
        return {
            currentPage: 1,
            totalRows: 1,
            perPage: 5,
            fields: [
                { key: "index", label: '#', tdClass: 'align-middle' },
                { key: 'created_at', label: 'Tanggal' },
                { key: 'account_id', label: 'ID User' },
                { key: 'value', label: 'Point' },
                { key: 'description', label: 'Keterangan' },
            ],
            filter: {
                date_period: null,
                name: null
            },
            totalPoint: 0,
            wdpoint: {
                amount: null,
                bankCode: null,
                accountHolderName: null,
                accountNumber: null
            },
            account: []
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
    },
    methods: {
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            console.log(filteredItems);
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        async getAccount() {
            this.account = await this.$axios.$get('api/admin/account')
                .then ((response) => {
                    return response.data;
                })
        },
        moment(date) {
            return moment(date)
        },
        getData() {
            let data = [];
            if (this.account.role_id !== 5 && this.account.role_id !== 1) {
                this.fields.splice(3, 0, { key: 'account.fullname', label: 'Nama User' });
                data = this.$axios.$get('api/admin/point/history/under', {
                    params: {
                        name: this.filter.name,
                        start_period: this.filter.date_period === null ? null : this.filter.date_period[0],
                        end_period: this.filter.date_period === null ? null : this.filter.date_period[1],
                        current: this.currentPage,
                        limit: this.perPage
                    }
                }).then((resp) => {
                    this.totalRows = resp.data.pagination.total
                    return resp.data.list;
                })
            } else {
                data = this.$axios.$get('/api/point/history').then((resp) => {
                    return resp.data;
                })
            }           

            return data;
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
        showModalWdPoint() {
            this.getBank();
            this.getPoint();
            this.$refs['form-withdraw-point'].show();
        },
        triggerWithdraw() {
            this.$refs['withdraw-point'].click();
        },
        async doWithdrawPoint(e) {
            e.preventDefault();

            return await this.$axios.$post('/api/point/withdraw', this.wdpoint)
                .then(resp => {
                    this.$refs['form-withdraw-point'].hide()

                    this.$notify({
                        group: 'notif',
                        type: 'success vue-notif-custom',
                        title: 'Berhasil',
                        text: 'Proses Penarikan Point Berhasil',
                    })
                })
        },
        async getPoint() {
            await this.$axios.$get('api/point')
                .then((response) => {
                    this.totalPoint = response.data.total || 0
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

                        this.wdpoint = {
                            bankCode: response.data.type?.toUpperCase(),
                            accountNumber: response.data.account_number,
                            accountHolderName: response.data.fullname,
                            verified: response.data.is_verified,
                        }
                    }

                    if (response.data == null) {
                        Swal.fire("Information", "Data rekening bank belum ada.", "error")
                        this.$refs['form-withdraw-point'].hide();
                    }
                })
        },
    }
}
</script>