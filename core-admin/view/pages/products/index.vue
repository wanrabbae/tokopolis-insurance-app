<template>
    <div>
        <PageHeader :title="title" />
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Tabel {{ title }}</h4>
                        <b-button class="mt-1" href="products/create" variant="primary">
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

                                <template #empty="scope">
                                    <h4>{{ scope.emptyText }}</h4>
                                </template>

                                <template #cell(image)="data">
                                    <img :src="data.value" :alt="data.item.name" width="120" />
                                </template>

                                <template #cell(type)="data">
                                    <h5>
                                        <b-badge v-if="data.item.is_comprehensive"
                                            class="badge bg-success">Komprehensif</b-badge>
                                        <b-badge v-else
                                            class="badge bg-success">Total Loss</b-badge>
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
    data() {
        return {
            tableData: [],
            title: "Daftar Produk",
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 25, 50],
            filter: null,
            filterOn: [],
            sortDesc: false,
            fields: [
                { key: "id", tdClass: 'align-middle', sortable: true },
                { key: "image", label: 'Gambar', tdClass: 'align-middle' },
                { key: "name", label: 'Nama Produk', tdClass: 'align-middle', sortable: true },
                { key: "type", label: 'Tipe Perlindungan', tdClass: 'align-middle', sortable: true },
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
    mounted() {
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
        async getData() {
            this.tableData = await this.$axios.$get('api/admin/product', {
                    params: {
                        current: this.currentPage,
                        limit: this.perPage,
                        query: this.filter
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

