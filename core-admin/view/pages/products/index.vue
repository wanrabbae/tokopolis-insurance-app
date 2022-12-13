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
                                    <label class="col-form-label">Nama Produk</label>
                                    <div>
                                        <input
                                            type="text"
                                            v-model="filterForm.name"
                                            class="form-control"
                                            placeholder="Masukkan Nama Produk"
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

                                <template #cell(image)="data">
                                    <img :src="data.value" :alt="data.item.name" width="120" />
                                </template>

                                <template #cell(type)="data">
                                    <h5>
                                        <b-badge v-if="data.item.type == 'comprehensive'"
                                            class="badge bg-primary">Komprehensif</b-badge>
                                        <b-badge v-else
                                            class="badge bg-primary">Total Loss</b-badge>
                                    </h5>
                                </template>

                                <template #cell(supported_brands)="data">
                                    <h5 v-if="data.item.supported_brands != null">
                                        <b-badge v-for="brand in data.item.supported_brands.split(',')"
                                            v-bind:key="brand"
                                            class="badge bg-secondary me-1">{{ brand }}</b-badge>
                                    </h5>
                                    <h5 v-else>
                                        <b-badge class="badge bg-success">Semua Brand</b-badge>
                                    </h5>
                                </template>

                                <template #cell(action)="data">
                                    <b-button :id="'act-detail-'+data.item.id" type="button" variant="primary"
                                        v-on:click="showDetail(data.item.id)"><i class="uil uil-eye"/></b-button>
                                    <b-tooltip :target="'act-detail-'+data.item.id">Lihat Detail</b-tooltip>
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
export default {
    layout: 'admin',
    data() {
        return {
            tableData: [],
            title: "Daftar Produk",
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
                { key: "image", label: 'Gambar', tdClass: 'align-middle' },
                { key: "name", label: 'Nama Produk', tdClass: 'align-middle', sortable: true },
                { key: "type", label: 'Tipe Perlindungan', tdClass: 'align-middle', sortable: true },
                { key: "supported_brands", label: 'Dukungan Brand', tdClass: 'align-middle', sortable: true, thStyle: { width: "25%" }, },
                { key: "action", label: 'Aksi', tdClass: 'align-middle' },
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
            this.tableData = await this.$axios.$get('api/admin/product', {
                    params: {
                        current: this.currentPage,
                        limit: this.perPage,
                        name: this.filterForm.name,
                        type: this.filterForm.type,
                    }
                })
                .then (response => {
                    this.totalRows = response.data.pagination.total

                    return response.data.list.map(item => {
                        item.image = `${item.image}`
                        return item
                    })
                })
                .catch ([])

            return this.tableData
        },
        showDetail(id) {
            this.$router.push({ path: `/products/${id}` })
        }
    }
}
</script>

