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
                                <label class="col-sm-2 col-lg-2 col-form-label">Nama
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <input
                                        type="text"
                                        v-model="form.name"
                                        class="form-control"
                                        placeholder="Masukkan Nama Kendaraan"
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

                            <button ref="create-data" class="d-none"></button>

                        </form>
                    </div>
                </b-modal>

                <b-modal size="lg" scrollable ref="form-modal-feedback" title="Kirim Feedback"
                ok-title="Submit" @ok.prevent="triggerSubmitFeedback" cancel-title="Batal">
                    <div class="d-block text-justify">
                        <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="submitFeedback">
                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-2 col-lg-2 col-form-label">Message
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-10 col-lg-10">
                                    <textarea
                                        v-model="sendFeedbackParam.message"
                                        class="form-control"
                                        placeholder="Tulis pesan kepada agent..."
                                        required>
                                    </textarea>
                                </div>
                            </div>

                            <button ref="submit-feedback" class="d-none"></button>

                        </form>
                    </div>
                </b-modal>

                <b-modal size="lg" scrollable ref="detail-modal" title="Detail Fitur"
                ok-only ok-title="Tutup">
                    <div class="card-body">
                        <div class="text-center">
                            <div class="avatar-lg">
                                <div class="avatar-title rounded-circle">
                                    <i class="uil uil-thumbs-up"></i>
                                </div>
                            </div>
                            <h5 class="mt-3 mb-1">{{ transaction?.product_name }}</h5>
                            <p class="text-muted">{{ transaction?.id }}</p>
                        </div>

                        <hr class="my-4" />

                        <div class="text-muted">
                            <h5 class="font-size-16">Deskripsi</h5>
                            <p>{{ transaction }}</p>
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

                <b-modal size="sm" scrollable ref="filter-download-modal" title="Download Report" ok-title="Proses" cancel-title="Batal" @ok.prevent="downloadReport()">
                    <div class="card-body">
                        <div class="text-center">
                            <label class="col-form-label">Range Tanggal</label>
                            <div>
                                <date-picker
                                    placeholder="Filter Tanggal"
                                    v-model="downloadRangeDate"
                                    valueType="YYYY-MM-DD"
                                    titleFormat="DD MMMM"
                                    range
                                    append-to-body
                                    lang="en"
                                    confirm
                                ></date-picker>
                            </div>
                        </div>
                    </div>
                </b-modal>

                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Tabel {{ title }}</h4>
                        <div class="row">
                            <div class="col-md-3 mt-2">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">No Quotation</label>
                                    <div>
                                        <input
                                            type="text"
                                            v-model="filterForm.id"
                                            class="form-control"
                                            placeholder="Masukkan Nomor Quotation"
                                            required>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-2">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">Nama User</label>
                                    <div>
                                        <input
                                            type="text"
                                            v-model="filterForm.name"
                                            class="form-control"
                                            placeholder="Masukkan Nama User"
                                            required>
                                    </div>
                                </div>
                            </div>
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
                                    <label class="col-form-label">Nama Kendaraan</label>
                                    <div>
                                        <input
                                            type="text"
                                            v-model="filterForm.sub_model"
                                            class="form-control"
                                            placeholder="Masukkan Nama Kendaraan"
                                            required>
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
                                    <label class="col-form-label">Produk</label>
                                    <div>
                                        <select
                                            class="form-select"
                                            v-model="filterForm.product">
                                            <option v-for="option in filterList.products" v-bind:value="option.value"
                                                v-bind:key="option.text">{{ option.text }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-2">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">Range Tanggal</label>
                                    <div>
                                        <date-picker
                                            placeholder="Filter Tanggal"
                                            v-model="filterForm.daterange"
                                            valueType="YYYY-MM-DD"
                                            titleFormat="DD MMMM"
                                            range
                                            append-to-body
                                            lang="en"
                                            confirm
                                        ></date-picker>
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
                            <div class="col-md-12">
                                <button @click="showDownloadFilter()" class="btn btn-primary float-end"><i class="uil uil-download-alt me-1"></i> Download</button>
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

                                <template #cell(user)="data">
                                    <h5>
                                        <b-badge v-if="data.item.client_name != null" class="badge bg-primary" v-b-tooltip.hover
                                            title="Client">
                                            {{ data.item.client_name }}
                                        </b-badge>
                                    </h5>
                                    <h5>
                                        <b-badge v-if="data.item.agent_name != null" class="badge bg-success" v-b-tooltip.hover
                                            title="Agent">
                                            {{ data.item.agent_name }}
                                        </b-badge>
                                    </h5>
                                </template>

                                <template #cell(vehicle)="data">
                                    {{ data.item.brand }} {{ data.item.sub_model }}
                                </template>

                                <template #cell(product)="data">
                                    {{ data.item.product_name }}
                                </template>

                                <template #cell(date)="data">
                                    {{ moment(data.item.start_date).format('D MMM yyyy') }} -
                                    {{ moment(data.item.start_date).add(1, 'y').format('D MMM yyyy') }}
                                </template>

                                <template #cell(status)="data">
                                    <h5 v-if="data.value == 'open'">
                                        <b-badge class="badge bg-secondary">Open</b-badge>
                                    </h5>
                                    <h5 v-else-if="data.value == 'waiting'">
                                        <b-badge class="badge bg-primary">Waiting</b-badge>
                                    </h5>
                                    <h5 v-else-if="data.value == 'paid'">
                                        <b-badge class="badge bg-success">Paid</b-badge>
                                    </h5>
                                    <h5 v-else-if="data.value == 'polis'">
                                        <b-badge class="badge bg-warning">Polis</b-badge>
                                    </h5>
                                </template>

                                <template #cell(action)="data">
                                    <b-button type="button" variant="primary" v-b-tooltip.hover
                                        title="Lihat Detail" :href="'transaction/' + data.item.id">
                                        <i class="uil uil-eye"/>
                                    </b-button>

                                    <!-- <b-button v-b-tooltip.hover type="button"
                                        title="Send Feedback to Agent" variant="warning"
                                        @click="sendFeedback(data.item.id)">
                                        <i class="uil uil-fast-mail" ></i>
                                    </b-button> -->

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
import moment from 'moment'
import Swal from "sweetalert2"
import DatePicker from "vue2-datepicker"

import "vue2-datepicker/index.css"
import { required } from "vuelidate/lib/validators"
import role from "../../../../constants/roles"

export default {
    layout: 'admin',
    components: {
		DatePicker
    },
    data() {
        return {
            tableData: [],
            title: "Daftar Transaksi",
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 25, 50],
            downloadLink: '',
            filterList: {
                brands: [],
                types: [],
                products: []
            },
            filterForm: {
                id: null,
                name: null,
                brand: null,
                sub_model: null,
                type: null,
                product: null,
                daterange: "",
                status: "waiting"
            },
            downloadRangeDate: "",
            sortDesc: false,
            fields: [
                { key: "index", label: '#', tdClass: 'align-middle' },
                { key: "id", label: 'No Quotation', tdClass: 'align-middle' },
                { key: "user", label: 'User', tdClass: 'align-middle' },
                { key: "vehicle", label: 'Kendaraan', tdClass: 'align-middle' },
                { key: "product", label: 'Produk', tdClass: 'align-middle' },
                { key: "date", label: 'Periode Asuransi', tdClass: 'align-middle' },
                { key: "status", label: 'Status', tdClass: 'align-middle' },
                { key: "action", label: 'Aksi', tdClass: 'align-middle' },
            ],
            isCreate: true,
            backup: {},
            transaction: null,
            form: {
                name: null,
                route: null,
            },
            formDownload: {
                start_period: "",
                end_period: ""
            },
            sendFeedbackParam: {
                trx_id: null,
                message: null
            },
            account: []
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
        this.account = this.getAccount()
        this.totalRows = this.tableData.length
        this.backup['form'] = Object.assign({}, this.form)

        this.filterList = {
            brands: await this.vehicleBrands(),
            types: await this.vehicleTypes(),
            products: await this.productNames(),
        }
    },
    validations: {
        form: {
            name: { required },
            route: { required },
        },
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
        async productNames() {
            return await this.$axios.$get('api/admin/product/item/names')
                .then ((response) => {
                    const list = response.data.map(item =>
                        item = { value: item.name, text: item.name })

                    return [
                        { value: null, text: 'Pilih Produk' },
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
                id: null,
                name: null,
                brand: null,
                sub_model: null,
                type: null,
                product: null,
                daterange: "",
            }

            this.getData()
            this.$refs.table.refresh()
        },
        async getAccount() {
            this.account = await this.$axios.$get('api/admin/account')
                .then ((response) => {
                    return response.data;
                })

            return this.account;
        },
        async getData() {

            this.account = await this.getAccount();

            const endpoint = this.account.role_id !== role.ROLE_ADMIN ? '/api/admin/transaction/listUnder' : 'api/admin/transaction/list';

            this.tableData = await this.$axios.$get(endpoint, {
                    params: {
                        id: this.filterForm.id,
                        name: this.filterForm.name,
                        vehicle_brand: this.filterForm.brand,
                        vehicle_sub_model: this.filterForm.sub_model,
                        vehicle_type: this.filterForm.type,
                        product_name: this.filterForm.product,
                        start_period: this.filterForm.daterange[0],
                        end_period: this.filterForm.daterange[1],
                        // limit
                        current: this.currentPage,
                        limit: this.perPage,
                    }
                })
                .then ((response) => {
                    this.totalRows = response.data.pagination.total
                    this.downloadLink = response.data.download_link
                    return response.data.list
                })
                .catch ([])

            return this.tableData
        },
        async getDetail(id) {
            return await this.$axios.$get(`api/admin/transaction/${id}/detail`)
                .then ((response) => {
                    // this.totalRows = response.data.pagination.total

                    return response.data
                })
                .catch ([])
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
            return await this.$axios.$post('api/admin/endpoint', this.form)
                .then(response => {
                    this.$refs['form-modal'].hide()

                    Swal.fire("Berhasil", "Berhasil Menambah Data", "success")
                    window.location.reload()
                })
        },
        async doUpdateData() {
            const data = this.$formCheck(this.form, ['id'])

            return await this.$axios.$put(`api/admin/endpoint/${this.form.id}`, data)
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
        },
        showDownloadFilter() {
            this.$refs["filter-download-modal"].show();
        },
        downloadReport() {
            const start_period = this.downloadRangeDate[0];
            const end_period = this.downloadRangeDate[1];

            this.formDownload.start_period = start_period;
            this.formDownload.end_period = end_period;

            this.$axios.$post(`/api/admin/transaction/generate?start_period=${start_period}&end_period=${end_period}`, this.formDownload).then(response => {

                window.open(`${response.data.download_link}`, '_blank');

                self.$router.push('/transaction')

                this.$refs["filter-download-modal"].hide();
            })
        },
        sendFeedback(id) {
            this.sendFeedbackParam.trx_id = id;

            this.showFormFeedback();
        },
        showFormFeedback() {
            this.$refs['form-modal-feedback'].show();
        },
        triggerSubmitFeedback() {
            this.$refs['submit-feedback'].click();
        },
        submitFeedback() {
            this.$axios.$post(`/api/admin/transaction/${this.sendFeedbackParam.trx_id}/feedback`, this.sendFeedbackParam.message).then(resp => {
                this.$refs['form-modal-feedback'].hide()

                Swal.fire("Berhasil", "Berhasil Mengirim Feedback", "success")
                window.location.reload()
            })
        }
    }
}
</script>

