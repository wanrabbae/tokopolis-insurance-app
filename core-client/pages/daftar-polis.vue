<template>
    <div class="py-6" style="background-color: #f6f5fc">
        <b-container>
            <div class="container-header header-tabs mb-4">
                <ul class="nav nav-tabs">
                    <li role="presentation" class="nav-item">
                        <a href="/daftar-polis" class="nav-link active" tabindex="-1">
                            <h2 class="tab-title">Daftar Polis</h2>
                        </a>
                    </li>
                    <li role="presentation" class="nav-item">
                        <a href="/daftar-klaim" class="nav-link " tabindex="-1">
                            <h2 class="tab-title">Daftar Klaim</h2>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="container-content">
                <div class="row no-gutters">
                    <div class="col-md-9 pr-md-1 mb-2">
                        <b-input-group class="addon-combined">
                            <input v-model="model.search" placeholder="Cari Polis" class="form-control" required>

                            <b-input-group-append>
                                <BaseButton type="icon" classes="px-3">
                                    <fa icon="magnifying-glass" />
                                </BaseButton>
                            </b-input-group-append>
                        </b-input-group>
                    </div>

                    <div class="col-md-3 pl-md-1 mb-2">
                        <BaseSelect v-model="model.status" name="Status" :options="statusOptions" />
                    </div>
                </div>

                <SwiperRadioButtonGroup id="policy-category" v-model="model.policyCategory" name="policy-category"
                    :options="policyCategoryOptions" class="mb-4" />

                <div v-if="!policies.length" class="text-center bg-white rounded"
                    style=" padding-top: 100px; padding-bottom: 100px;">
                    <b-img center src="/img/box.png" alt="Payment Icon" width="100px" style="max-height: 160px;" />
                    <h4 class="mt-3 text-secondary">Belum Ada Polis</h4>
                </div>

                <div v-for="(policy, id) in policies" :key="id" class="card"
                    :class="{ 'mb-4': id < policies.length - 1 }">
                    <div class="card-header border-bottom">
                        <div class="row">
                            <div class="col-md-8">
                                <span class="fw-bold">
                                    No. Quotation: {{ policy.quotationID }}
                                </span>
                            </div>
                            <div class="col-md-4 text-md-right">
                                <span class="fw-bold">
                                    {{ policy.endDate }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="d-block mb-3">
                            <div class="d-inline-block align-top mr-3">
                                <img :src="policy.image" alt="Mobil" class="rounded-circle" width="96px" height="96[x"
                                    style="max-height: 96px">
                            </div>
                            <div class="d-inline-block align-top">
                                <div class="fs-4 fw-bold">{{ policy.holder }}</div>
                                <div class="fs-5 fw-bold mb-1">{{ policy.product }} - {{ policy.vehicle }}</div>
                                <div class="mb-2">{{ policy.periodDate }}</div>
                                <div class="d-block">
                                    <div class="badge py-2 px-3 rounded-pill mr-1"
                                        :class="policy.status === 'polis' ? 'badge-success' : 'badge-danger'">
                                        {{ policy.status === 'polis' ? 'Aktif' : 'Belum Aktif' }}
                                    </div>

                                    <div v-if="policy.status == 'open'"
                                        class="badge py-2 px-3 rounded-pill badge-primary clickable mr-1"
                                        @click="openDocument(policy.quotationID)">Penawaran</div>
                                    <div v-else-if="policy.status == 'waiting'"
                                        class="badge py-2 px-3 rounded-pill badge-info clickable mr-1"
                                        @click="openPayment(policy.quotationID)">Menunggu Pembayaran</div>
                                    <div v-else-if="policy.status == 'paid'"
                                        class="badge py-2 px-3 rounded-pill badge-success mr-1">Pembayaran Diterima
                                    </div>
                                    <div v-else-if="policy.status == 'polis'"
                                        class="badge py-2 px-3 rounded-pill badge-success mr-1">Polis
                                    </div>
                                    <div v-else-if="policy.status == 'rejected'"
                                        class="badge py-2 px-3 rounded-pill badge-danger mr-1">Pembayaran Ditolak</div>
                                    <div v-else-if="policy.status == 'canceled'"
                                        class="badge py-2 px-3 rounded-pill badge-danger mr-1">Dibatalkan</div>

                                    <div v-if="policy.status == 'polis'" class="d-inline-block">
                                        <div style="cursor: pointer;" title="Share Document">
                                            <fa icon="share-nodes" style="width: 16px; height: 16px;"
                                                @click="openShareModal(policy.documents.epolicy)" />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <BaseButton v-if="policy.status == 'polis'" tag="a"
                                :href="'/ajukan-klaim?id=' + policy.quotationID">Ajukan Klaim</BaseButton>
                            <BaseButton tag="a" href="#" disabled>Beli Lagi</BaseButton>
                        </div>
                    </div>
                </div>
                <b-pagination v-if="policies.length" v-model="currentPage" :per-page="perPage" :total-rows="totalRows" class="mt-4" v-bind="paginationOptions"
                    @page-click="onPageClick" />
            </div>
        </b-container>
        <Loading :show="loading" />
        <Share id="share-popup" :epolicy="epolicy"/>
    </div>
</template>

<script>
import moment from 'moment'

import BaseSelect from '../components/Inputs/BaseSelect'
import BaseButton from '../components/BaseButton'
import SwiperRadioButtonGroup from '../components/SwiperRadioButtonGroup'
import Loading from '../components/Loading'
import Share from '../components/modals/Share.vue'

export default {
    components: {
        BaseSelect,
        BaseButton,
        SwiperRadioButtonGroup,
        Loading,
        Share
    },
    data() {
        return {
            title: 'Daftar Polis',
            loading: true,
            epolicy: null,
            idpolis: null,
            model: {
                search: null,
                status: null,
                policyCategory: null
            },
            statusOptions: [
                { text: 'Status', value: null },
                { text: 'Menunggu Pembayaran', value: "waiting" },
                { text: 'Pembayaran Diterima', value: "paid" },
                { text: 'Pembayaran Ditolak', value: "denied" },
                { text: 'Dibatalkan', value: "canceled" }
            ],
            policyCategoryOptions: [
                { text: 'Semua Polis', value: null },
                { text: 'Mobil', value: "car" },
                // { text: 'Motor', value: "motorcycle" },
                // { text: 'Smartphone', value: "smartphone" },
                // { text: 'Santunan Tunai', value: "cashCompensation" },
                // { text: 'Jiwa', value: "life" },
                // { text: 'Penyakit Tropis', value: "tropicalDisease" },
                // { text: 'Perjalanan', value: "travel" },
            ],
            policies: [
                // {
                //     quotationID: "TKP-00000000-000000-0000",
                //     holder: "",
                //     name: "",
                //     periodDate: "",
                //     endDate: "",
                //     image: "/img/car-icon-comprehensive.png",
                //     status: true
                // },
            ],
            currentPage: 1,
            totalRows: 0,
            perPage: 10,
            paginationOptions: {
                align: "center",
                // disabled: !this.isLoggedIn,
                limit: 3,
                perPage: 6,
                totalSearchResult: 10,
            },
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    mounted() {
        this.getTransactions()
    },
    methods: {
        async getTransactions() {
            this.policies = []

            await this.$axios.$get(`api/user/transactions` , {
                params: {
                    current: this.currentPage
                }
            })
                .then((response) => {
                    response.data.list.forEach((field) => {
                        const start = moment(field.start_date)
                        const end = moment(field.start_date).add(1, 'year')
                        const now = moment()
                        const period = moment.duration(end.diff(now))
                        const isStarted = (moment().diff(moment(field.start_date))) >= 0

                        this.policies.push({
                            quotationID: field.id,
                            holder: field.client_data.fullname,
                            product: field.product.name,
                            vehicle: field.vehicle.brand,
                            periodDate: `Periode: ${start.format('D MMM yyyy')} - ${end.format('D MMM yyyy')}`,
                            endDate: isStarted ? `Berakhir dalam ${period.asDays().toFixed(0)} Hari` : '',
                            image: field.product.type === "comprehensive" ? "/img/car-icon-comprehensive.png" : "/img/car-icon-tlo.png",
                            status: field.status,
                            documents: field.documents
                        })
                    })
                    this.totalRows = response.data.pagination.total

                    this.loading = false

                })
        },
        openPayment(id) {
            window.location.href = `/asuransi/mobil/polis/konfirmasi-pembayaran?id=${id}`
        },
        openDocument(id) {
            const redirectURL = this.$config.nodeEnv === 'development' ? this.$config.apiURL :
                this.$config.serverURL

            window.open(`${redirectURL}/quotation/${id}.pdf`, '_blank')
        },
        onPageClick(event, page) {
            this.loading = true
            this.currentPage = page;
            this.getTransactions()
        },
        openShareModal(documents) {
            this.$bvModal.show('share-popup')
            this.epolicy = documents;
        },
    }
}
</script>
