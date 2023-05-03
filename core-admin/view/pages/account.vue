<template>
    <div>
        <PageHeader :title="title" />
        <div class="row">
            <div class="col-12">
                <b-modal size="xl" scrollable ref="form-create" title="Tambah Data"
                ok-title="Submit" @ok.prevent="triggerCreate" cancel-title="Batal">
                    <div class="d-block text-justify">
                        <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="doCreateData">
                            <div class="row">
                                <div class="col-md-6">
                                    <div role="group" class="form-group">
                                        <label class="col-form-label">Dealer
                                            <label class="text-danger">*</label>
                                        </label>
                                        <div>
                                            <select
                                                class="form-select"
                                                v-model="form.dealer_id"
                                                @change="getLeaders"
                                                required>
                                                <option v-for="option in data.dealer" v-bind:value="option.value"
                                                    v-bind:key="option.text">{{ option.text }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div role="group" class="form-group">
                                        <label class="col-form-label">Role Pengguna
                                            <label class="text-danger">*</label>
                                        </label>
                                        <div>
                                            <select
                                                class="form-select"
                                                v-model="form.role"
                                                v-on:change="getAtasan"
                                                @change="getLeaders"
                                                required>
                                                <option v-for="option in data.role" v-bind:value="option.value"
                                                    v-bind:key="option.text">{{ option.text }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="form.dealer_id != null && form.role != null && form.role != 2" class="row mt-2">
                                <div class="col-md-6">
                                    <div role="group" class="form-group">
                                        <label class="col-form-label">Atasan
                                            <label class="text-danger">*</label>
                                        </label>
                                        <div>
                                            <select
                                                v-model="form.leader_id"
                                                class="form-select"
                                                required>
                                                <option v-for="option in data.leader" :key="option.value"
                                                    :value="option.value">{{ option.text }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="form.dealer_id != null && form.role != null && (form.role == 2 || (form.role != 2 && form.leader_id != null))">
                                <p class="mt-4 mb-0">
                                    <i class="mdi mdi-arrow-right text-primary me-1"></i> Anda bisa menambahkan beberapa pengguna sekaligus
                                </p>

                                <div v-for="(item, index) in formList" :key="item.id" class="row">
                                    <div class="col-md-4 mt-2">
                                        <div role="group" class="form-group">
                                            <label class="col-form-label">Nama Pengguna
                                                <label class="text-danger">*</label>
                                            </label>
                                            <div>
                                                <input
                                                    type="text"
                                                    v-model="item.fullname"
                                                    class="form-control"
                                                    placeholder="Masukkan Nama Pengguna"
                                                    required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-3 mt-2">
                                        <div role="group" class="form-group">
                                            <label class="col-form-label">Email
                                                <label class="text-danger">*</label>
                                            </label>
                                            <div>
                                                <input
                                                    type="email"
                                                    v-model="item.email"
                                                    class="form-control"
                                                    placeholder="Masukkan Email"
                                                    required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-3 mt-2">
                                        <div role="group" class="form-group">
                                            <label class="col-form-label">Password
                                                <label class="text-danger">*</label>
                                            </label>
                                            <div>
                                                <input
                                                    type="text"
                                                    v-model="item.password"
                                                    class="form-control"
                                                    placeholder="Masukkan Password"
                                                    required>
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
                            </div>

                            <button ref="create-data" class="d-none"></button>

                        </form>
                    </div>
                </b-modal>

                <b-modal size="lg" scrollable ref="detail-modal" title="Detail Penambahan"
                ok-only ok-title="Tutup">
                    <div class="card-body">
                        <div class="text-muted">
                            <h5 class="font-size-16">Daftar Pengguna</h5>
                            <div class="table-responsive">
                                <table class="table table-striped mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nama</th>
                                            <th>Email</th>
                                            <th>Password</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, i) of formList" :key="i">
                                            <th scope="row">{{ i + 1 }}</th>
                                            <td>{{ item.fullname }}</td>
                                            <td>{{ item.email }}</td>
                                            <td>{{ item.password }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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

                <b-modal size="lg" scrollable ref="form-update-password" title="Update Password"
                ok-title="Submit" @ok.prevent="triggerUpdatePassword" cancel-title="Batal">
                    <div class="d-block text-justify">
                        <form class="form-horizontal x-hidden" role="form" v-on:submit.prevent="doUpdatePassword">
                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-3 col-lg-3 col-form-label">Password Lama
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-9 col-lg-9">
                                    <input
                                        type="password"
                                        v-model="formUpdatePass.password"
                                        class="form-control"
                                        placeholder="Masukkan Password Lama"
                                        required>
                                </div>
                            </div>
                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-3 col-lg-3 col-form-label">Password Baru
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-9 col-lg-9">
                                    <input
                                        type="password"
                                        v-model="formUpdatePass.password_new"
                                        class="form-control"
                                        placeholder="Masukkan Password Baru"
                                        required>
                                </div>
                            </div>
                            <div role="group" class="row form-group mb-3">
                                <label class="col-sm-3 col-lg-3 col-form-label">Password Baru
                                    <label class="text-danger">*</label>
                                </label>
                                <div class="col-sm-9 col-lg-9">
                                    <input
                                        type="password"
                                        v-model="formUpdatePass.password_confirmation"
                                        class="form-control"
                                        placeholder="Konfirmasi Password Baru"
                                        required>
                                </div>
                            </div>

                            <button ref="update-data-password" class="d-none"></button>
                        </form>
                    </div>
                </b-modal>

                <b-modal ref="modal-hirarki" size="lg" scrollable title="Role Hirarki" ok-title="Close" ok-only>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="table-responsive mb-0">
                                <b-table ref="table" :items="getDataHirarki" :fields="fieldsHirarki" responsive="sm" :filter-included-fields="filterOn"
                                    @filtered="onFiltered" show-empty>
                                </b-table>
                            </div>
                        </div>
                    </div>
                </b-modal>

                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Tabel {{ title }}</h4>
                        <b-button class="mt-1" variant="primary" @click="showCreate">
                            <i class="uil uil-plus"/> Tambah
                        </b-button>

                        <b-button v-b-tooltip.hover class="mt-1" type="button" variant="success" title="View Hirarki" @click="viewHirarki()">
                            <i class="uil uil-eye"/> View Role Hirarki
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

                                
                                <template #cell(role)="data">
                                    <h5 v-if="data.item.roles != null">
                                        <span v-if="data.item.roles.name == 'Superadmin'">
                                            <b-badge class="badge bg-primary">{{ data.item.roles?.name }}</b-badge>
                                        </span>
                                        <span v-else>
                                            <b-badge class="badge bg-success">{{ data.item.roles?.name }}</b-badge>
                                        </span>
                                    </h5>
                                    <h5 v-else>
                                        <b-badge class="badge bg-danger">Tanpa Role</b-badge>
                                    </h5>
                                </template>

                                <template #cell(action)="data">
                                    <b-button type="button" variant="warning" v-b-tooltip.hover
                                        title="Update Password" v-on:click="showEditPassword(data.item)">
                                        <i class="uil uil-key-skeleton-alt"/>
                                    </b-button>

                                    <b-button type="button" variant="primary" v-b-tooltip.hover
                                        title="Edit Data" v-on:click="showEdit(data.item)">
                                        <i class="uil uil-edit-alt"/>
                                    </b-button>

                                    <b-button type="button" variant="danger" v-b-tooltip.hover
                                        title="Delete Data" v-on:click="deleteData(data.item.id)">
                                        <i class="uil uil-trash-alt"/>
                                    </b-button>

                                    </template>

                                <!-- <template #cell(action)="data">
                                    <b-button type="button" variant="primary" v-b-tooltip.hover
                                        title="Edit Data">
                                        <i class="uil uil-edit"/>
                                    </b-button>

                                    <b-button type="button" variant="danger" v-b-tooltip.hover
                                        title="Hapus Data" v-on:click="deleteData(data.item.id)">
                                        <i class="uil uil-trash"/>
                                    </b-button>
                                </template>
                                </template> -->

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
            title: "Daftar Pengguna",
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 25, 50],
            filter: null,
            filterOn: [],
            sortDesc: false,
            fields: [
                { key: "index", label: '#', tdClass: 'align-middle' },
                { key: "dealers.name", label: 'Dealer', tdClass: 'align-middle' },
                { key: "fullname", label: 'Nama Pengguna', tdClass: 'align-middle' },
                { key: "email", label: 'Email', tdClass: 'align-middle' },
                { key: "role", label: 'Role', tdClass: 'align-middle' },
                { key: "action", label: 'Aksi', tdClass: 'align-middle' },
                // { key: "dealer", label: 'Dealer', tdClass: 'align-middle' },
                { key: "fullname", label: 'Nama Pengguna', tdClass: 'align-middle' },
                { key: "email", label: 'Email', tdClass: 'align-middle' },
                // { key: "action", label: 'Aksi', tdClass: 'align-middle' },
            ],
            fieldsHirarki: [
                { key: 'fullname', label: 'Name' },
                { key: 'email', label: 'Email' },
            ],
            isCreate: true,
            data: {
                dealer: [],
                role: [
                    { value: null, text: 'Pilih Role Pengguna' },
                    // { value: 2, text: 'Operation Manager' },
                    { value: 3, text: 'Kepala Cabang' },
                    { value: 4, text: 'Supervisor' },
                    { value: 5, text: 'Mitra' },
                ],
                leader: [,
                    // { value: 'manager', text: 'Operation Manager' },
                    { value: 'branch', text: 'Kepala Cabang' },
                    { value: 'supervisor', text: 'Supervisor' },
                    { value: 'agent', text: 'Mitra' },
                ],
                leader: [
                    { value: null, text: 'Pilih Atasan' },
                ],
            },
            backup: {},
            formList: [{
                id: 1,
                fullname: null,
                email: null,
                password: null,
            }],
            form: {
                dealer_id: null,
                role: null,
                leader_id: null,
            },
            formUpdatePass: {
                password: null,
                password_new: null,
                password_confirmation: null
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
    async mounted() {
        // Set the initial number of items
        this.totalRows = this.tableData.length
        this.backup['form'] = Object.assign({}, this.form)

        this.data.dealer = await this.getDealers()
    },
    validations: {
        form: {
            name: { required },
            route: { required },
            method: { required },
        },
    },
    methods: {
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        async getData() {
            this.tableData = await this.$axios.$get('api/admin/account/all', {})},
        randomPassword() {
            return this.randomString(8)
        },
        async getData() {
            this.tableData = await this.$axios.$get('/api/admin/account/all', {
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
        async getDealers() {
            return await this.$axios.$get('api/admin/dealer/all')
                .then ((response) => {
                    if (!response) return

                    const list = response.data.map(item =>
                        item = { value: item.id, text: item.name })

                    return [
                        { value: null, text: 'Pilih Dealer' },
                        ...list
                    ]
                })
                .catch ([])
        },
        async getAtasan() {
            if (this.form.dealer_id !== null && this.form.role !== null && this.form.role !== "manager") {
                this.data.leader = await this.$axios.$get('api/admin/account/item/leaders', {
                    params: {
                        role: this.form.role,
                        dealer_id: this.form.dealer_id
                    }
                })
                .then(response => {return response.data})
                .catch([])

                return this.data.leader;
            }
        },
        addContent() {
            this.formList.push({
                name: null,
                route: null,
                method: null,})},
        async getLeaders() {
            if (this.form.dealer_id == null || this.form.role == null) return

            this.form.leader_id = null

            return await this.$axios.$get('api/admin/account/item/leaders', {
                params: {
                    dealer_id: this.form.dealer_id,
                    role: this.form.role
                }
            })
            .then ((response) => {
                if (!response) return

                const list = response.data.map(item =>
                    item = { value: item.id, text: item.fullname })

                this.data.leader = [
                    { value: null, text: 'Pilih Atasan' },
                    ...list
                ]
            })
            .catch ([])
        },
        addContent() {
            this.formList.push({
                fullname: null,
                email: null,
                password: this.randomPassword(),
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
            this.formList = [{
                id: 1,
                fullname: null,
                email: null,
                password: this.randomPassword(),
            }]

            this.$refs['form-create'].show()
        },
        showEdit(item) {
            this.form = Object.assign({}, item)
            this.$refs['form-update'].show()
        },
        showEditPassword(item) {
            this.form = Object.assign({}, item)
            this.$refs['form-update-password'].show()
        },
        triggerCreate() {
            this.$refs['create-data'].click()
        },
        triggerUpdate() {
            this.$refs['update-data'].click()
        },
        triggerUpdatePassword() {
            this.$refs['update-data-password'].click();
        },  
        async doCreateData(e) {
            e.preventDefault()

            const finalForm = this.form;

            const finalFormList = this.formList.map(item => {
                const data = item
                delete data.id

                return data
            })
            finalForm.data = finalFormList;

            return await this.$axios.$post('api/admin/account', finalForm)
                .then(response => {
                    this.$refs['form-create'].hide()

                    Swal.fire("Berhasil", "Berhasil Menambah Data", "success")
                    window.location.reload()
                })
            return await this.$axios.$post('api/admin/account', {
                dealer_id: this.form.dealer_id,
                role: this.form.role,
                leader_id: this.form.leader_id,
                data: finalForm
            })
            .then(response => {
                this.$refs['form-create'].hide()
                this.$refs['detail-modal'].show()

                this.$notify({
                    group: 'notif',
                    type: 'success vue-notif-custom',
                    title: 'Berhasil',
                    text: 'Berhasil Menambah Pengguna',
                })
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
        async doUpdatePassword(e) {
            e.preventDefault();

            return await this.$axios.$put(`api/admin/account/password/update`, this.formUpdatePass)
                .then(response => {
                    this.$refs['form-update-password'].hide()

                    Swal.fire("Berhasil", "Berhasil Mengubah Password", "success")
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
                    return context.$axios.delete(`/api/admin/account/${id}`)
                        .then(() => window.location.reload())
                }
            })
        },
        viewHirarki() {
            this.$refs['modal-hirarki'].show();
        },
        async getDataHirarki() {
            let data = [];
            data = await this.$axios.$get('/api/admin/role/tree').then((resp) => {
                return resp.data[0].accounts;
            });

            return data;
        },
    }
}
</script>
