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

                                <template #cell(status)="data">
                                    <span v-if="data.item.status === 'waiting'" class="badge badge-info">{{ data.item.status }}</span>
                                    <span v-if="data.item.status === 'open'" class="badge badge-primary">{{ data.item.status }}</span>
                                    <span v-if="data.item.status === 'paid'" class="badge badge-success">{{ data.item.status }}</span>
                                    <span v-if="data.item.status === 'denied'" class="badge badge-danger">{{ data.item.status }}</span>
                                    <span v-if="data.item.status === 'canceled'" class="badge badge-warning">{{ data.item.status }}</span>
                                    <span v-if="data.item.status === 'failed'" class="badge badge-secondary">{{ data.item.status }}</span>
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
                { key: "client_name", label: 'Nama Tertanggung', tdClass: 'align-middle' },
                { key: "agent_name", label: 'User', tdClass: 'align-middle' },
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
    computed: {
        /**
         * Total no. of records
         */
        rows() {
            return this.totalRows
        }
    },
    methods: {
        async getData() {
            this.tableData = await this.$axios.$get(`/api/admin/transaction/history?status=${this.filterForm.status}&limit=${this.perPage}&page=${this.currentPage}`)
                .then((resp) => {
                    this.totalRows = resp.data.pagination.total
                    return resp.data.list;
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
<style scoped>
    .badge {
        display: inline-block;
        padding: 0.25em 0.4em;
        font-size: 90%;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 0.25rem;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }

    .badge-info {
        color: #fff;
        background-color: #17a2b8;
    }

    .badge-secondary {
        color: #fff;
        background-color: #6c757d;
    }

    .badge-success {
        color: #fff;
        background-color: #28a745;
    }

    .badge-danger {
        color: #fff;
        background-color: #dc3545;
    }

    .badge-warning {
        color: #212529;
        background-color: #ffc107;
    }

    .badge-info {
        color: #fff;
        background-color: #17a2b8;
    }
</style> 
