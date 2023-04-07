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

        <div v-if="account.role_id === 1">
            <div class="row">
                <div class="col-md-12">
                    <b-button variant="primary" @click="showModalWdCommission">Withdraw Commission</b-button>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="table-responsive mb-0">
                        <b-table ref="table" :items="getData" :fields="fields" responsive="sm"
                            :per-page="perPage" :current-page="currentPage"
                            show-empty>

                            <template #cell(index)="data">
                                {{ (currentPage - 1) * perPage + data.index + 1 }}
                            </template>

                            <template #cell(created_at)="data">
                                {{ moment(data.item.created_at).format('D MMM yyyy') }}
                            </template>

                            <template #cell(description)="data">
                                <span v-if="data.item.description === 'pemasukan'">Komisi Diterima</span>
                                <span v-if="data.item.description === 'penarikan'">Penarikan Komisi</span>
                            </template>

                            <template #cell(value)="data">
                                Rp. {{ Intl.NumberFormat().format(data.item.value) }}
                            </template>
                        </b-table>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="account.role_id !== 1">
            <span>Sorry, your role has not authorized to access this feature.</span>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2"
import moment from 'moment';
export default {
    data() {
        return {
            currentPage: 1,
            perPage: 5,
            fields: [
            { key: "index", label: '#', tdClass: 'align-middle' },
                { key: 'created_at', label: 'Tanggal' },
                { key: 'description', label: 'Keterangan' },
                { key: 'value', label: 'Komisi' },
            ],
            totalComission: 0,
            totalComissionFormatted: 0,
            cmpoint: {
                amount: null,
                bankCode: null,
                accountHolderName: null,
                accountNumber: null
            },
            account: []
        }
    },
    created() {        
        this.getAccount()
    },
    methods: {
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
            data = this.$axios.$get('/api/comissions/history').then((resp) => {
                return resp.data;
            })

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