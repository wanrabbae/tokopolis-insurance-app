<template>
    <div>
        <PageHeader :title="title" />
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">Table {{ title }}</div>
                        <div class="row">
                            <div class="col-md-3">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">Status</label>
                                    <div>
                                        <select v-model="filterForm.status" class="form-select">
                                            <option value="waiting">Waiting</option>
                                            <option value="open">Open</option>
                                            <option value="paid">Paid</option>
                                            <option value="denied">Denied</option>
                                            <option value="canceled">Canceled</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <div role="group" class="form-group">
                                    <label class="col-form-label">Aksi</label>
                                    <div>
                                        <b-button type="button" variant="primary" @click="doFilter()">
                                            <i class="uil uil-filter me-1"></i> Filter
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
            title: 'Transaction History',
            tableData: [],
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 25, 50],
            filterForm: {
                status: "waiting"
            },
            sortDesc: false,
            fields: [
                { key: "index", label: '#', tdClass: 'align-middle' },
                { key: "id", label: 'No Quotation', tdClass: 'align-middle' },
                { key: "start_date", label: 'Tanggal Pengajuan', tdClass: 'align-middle' },
                { key: "client_name", label: 'Nama Client', tdClass: 'align-middle' },
                { key: "agent_name", label: 'Nama Agent', tdClass: 'align-middle' },
                { key: "brand", label: 'Brand', tdClass: 'align-middle' },
                { key: "sub_model", label: 'Sub Model', tdClass: 'align-middle' },
                { key: "product_name", label: 'Nama Produk', tdClass: 'align-middle' },
                { key: "status", label: 'Status', tdClass: 'align-middle' },
            ],
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`
        }
    },
    methods: {
        async getData() {
            this.tableData = await this.$axios.$get(`/api/admin/transaction/history?status=${this.filterForm.status}&limit=${this.perPage}&page=${this.currentPage}`)
                .then((resp) => {
                    this.totalRows = resp.data.pagination.total
                    return resp.data.list[0];
                })
                
            return this.tableData;
        },
        doFilter() {
            this.getData()
            this.$refs.table.refresh()
        },
    }
}

</script>   
