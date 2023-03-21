<template>
    <div>

        <b-modal ref="form-withdraw-point" cancel-title="Batal" size="lg" scrollable title="Withdraw Point" ok-title="Submit" @ok.prevent="triggerWithdraw" >
            <div class="d-block text-justify">
                <form class="form-horizontal x-hidden" role="form" @submit.prevent="doWithdrawPoint" >
                    <div class="row">
                        <div class="col-md-12">
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
                            <div role="group" class="form-group">
                                <label class="col-form-label">Nama Bank
                                    <label class="text-danger">*</label>
                                </label>
                                <div>
                                    <input
                                        v-model="wdpoint.bankCode"
                                        class="form-control"
                                        type="text"
                                        required />
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
                                        required />
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
            <div class="col-md-12">
                <b-button variant="primary" @click="showModalWdPoint">Withdraw Point</b-button>
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
                    </b-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentPage: 1,
            perPage: 5,
            fields: [
                { key: "index", label: '#', tdClass: 'align-middle' },
                { key: 'type', label: 'Type' },
                { key: 'value', label: 'Value' },
                { key: 'description', label: 'Description' },
                { key: 'created_at', label: 'Created At' },
            ],
            wdpoint: {
                amount: null,
                bankCode: null,
                accountHolderName: null,
                accountNumber: null
            }
        }
    },
    methods: {
        getData() {
            let data = [];
            data = this.$axios.$get('/api/points/history').then((resp) => {
                return resp.data;
            })

            return data;
        },
        showModalWdPoint() {
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
        }
    }
}
</script>