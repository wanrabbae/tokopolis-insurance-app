<template>

    <div class="py-6" style="background-color: #f6f5fc">

        <div class="container">

            <div class="container-header header-tabs mb-4">

                <ul class="nav nav-tabs">

                    <li role="presentation" class="nav-item">

                        <a href="/daftar-polis" class="nav-link" tabindex="-1">

                            <h2 class="tab-title">Daftar Polis</h2>

                        </a>

                    </li>

                    <li role="presentation" class="nav-item">

                        <a href="/daftar-klaim" class="nav-link active" tabindex="-1">

                            <h2 class="tab-title">Daftar Klaim</h2>

                        </a>

                    </li>

                </ul>

            </div> <!-- container-header ends -->

            <div class="container-content">

                <div class="row no-gutters">

                    <div class="col-12 col-md-9 pr-md-1 mb-2">

                        <b-input-group class="addon-combined">

                            <input
                                v-model="model.search"
                                placeholder="Cari Klaim"
                                class="form-control"
                                required
                            >

                            <b-input-group-append>
                                <BaseButton type="icon" classes="px-3"><fa icon="magnifying-glass"/></BaseButton>
                            </b-input-group-append>

                        </b-input-group>

                    </div> <!-- col-12.col-md-9 ends -->

                    <div class="col-12 col-md-3 pl-md-1 mb-2">

                        <BaseSelect
                            v-model="model.status"
                            name="Status"
                            :options="statusOptions"
                        />

                    </div> <!-- col-12.col-md-3 ends -->

                </div> <!-- row ends -->

                <SwiperRadioButtonGroup
                    id="policy-category"
                    v-model="model.policyCategory"
                    name="policy-category"
                    :options="policyCategoryOptions"
                    class="mb-4"
                />

                <div v-if="!policies.length" class="text-center bg-white rounded" style=" padding-top: 100px; padding-bottom: 100px;">
                    <b-img center src="/img/box.png" alt="Payment Icon" width="100px" style="max-height: 160px;"/>
                    <h4 class="mt-3 text-secondary">Belum Ada Klaim</h4>
                </div>

                <div v-for="(policy, id) in policies" :key="id" class="card" :class="{ 'mb-4': id < policies.length - 1 }">

                    <div class="card-header border-bottom">

                        <div class="row">

                            <div class="col-12 col-md-8">

                                <span class="fw-bold">No. Klaim {{ policy.claimNumber }}</span>

                            </div> <!-- col-12.col-md-8 ends -->

                            <div class="col-12 col-md-4 text-md-right">

                                <span class="fw-bold">{{ policy.endDate }}</span>

                            </div> <!-- col-12.col-md-4 ends -->

                        </div> <!-- row ends -->

                    </div> <!-- container-card-header ends -->

                    <div class="card-body">

                        <div class="d-block mb-3">

                            <div class="d-inline-block align-top mr-3">

                                <img :src="policy.image" alt="Mobil" height="96px" width="96px" class="rounded-circle" style="max-height: 96px">

                            </div>

                            <div class="d-inline-block align-top">

                                <div class="fs-4 fw-bold">{{ policy.holder }}</div>

                                <div class="fs-5 fw-bold mb-1">{{ policy.product }}</div>

                                <div class="mb-2">{{ policy.periodDate }}</div>

                                <div class="d-block">

                                    <div
                                        class="badge py-2 px-3 rounded-pill mr-1"
                                        :class="policy.status !== 'declined' ? 'badge-primary' : 'badge-warning'"
                                    >
                                        {{ status[policy.status] }}
                                    </div>

                                    <div
                                        class="badge py-2 px-3 rounded-pill badge-info mr-1"
                                    >
                                        {{ policy.quotationID }}
                                    </div>

                                    <div class="d-inline-block">

                                        <fa icon="share-nodes" style="width: 16px; height: 16px;"/>

                                    </div>

                                </div>

                            </div>

                        </div> <!-- d-block ends -->

                        <div class="text-right">

                            <BaseButton tag="a" :href="'/detail-klaim?id=' + policy.claimNumber">Periksa Klaim</BaseButton>

                        </div> <!-- text-right ends -->

                    </div> <!-- card-body ends -->

                </div> <!-- card ends -->

            </div> <!-- container-content ends -->

        </div> <!-- container ends -->
        <Loading :show="loading"/>
    </div>

</template>

<script>
import moment from 'moment'

import BaseSelect from '../components/Inputs/BaseSelect'
import BaseButton from '../components/BaseButton'
import SwiperRadioButtonGroup from '../components/SwiperRadioButtonGroup'
import Loading from '../components/Loading'

export default {
    components: {
        BaseSelect,
        BaseButton,
        SwiperRadioButtonGroup,
        Loading
    },
    data() {
        return {
            title: 'Daftar Klaim',
            loading : true,
            model: {
                search: null,
                status: null,
                policyCategory: null
            },
            statusOptions: [
                { text: 'Status', value: null },
                { text: 'Tertunda', value: "pending" },
                { text: 'Telah Disurvey', value: "surveyed" },
                { text: 'Klaim Diterima', value: "accepted" },
                { text: 'Klaim Ditolak', value: "declined" },
                { text: 'Sedang Diperbaiki', value: "fixed" },
                { text: 'Siap Diambil', value: "ready" },
                { text: 'Selesai', value: "done" }
            ],
            status: {
                pending: "Tertunda",
                surveyed: "Telah Disurvey",
                accepted: "Klaim Diterima",
                declined: "Klaim Ditolak",
                fixed: "Sedang Diperbaiki",
                ready: "Siap Diambil",
                done: "Selesai",
            },
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
                {
                    claimNumber: "C-00.00.0000",
                    quotationID: "TKP-00000000-000000-0000",
                    holder: "",
                    product: "",
                    periodDate: "",
                    image: "/img/car-icon-comprehensive.png",
                    status: "pending",
                },
            ]
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    mounted(){
        this.getClaims()
    },
    methods:{
        async getClaims(){
            this.policies = []

            await this.$axios.$get(`api/claim`)
            .then ((response) => {
                response.data.forEach((field) => {
                    const start = moment(field.created_at)

                    this.policies.push({
                        claimNumber: field.id,
                        quotationID: field.transaction_id,
                        holder: field.account.fullname,
                        product: field.product.name,
                        periodDate: `Tanggal Pengajuan: ${start.format('D MMM yyyy')}`,
                        image: "/img/car-icon-comprehensive.png",
                        status: field.status,
                    })
                })

                this.loading = false

            }).catch (function () {

            })
        },
    }

}
</script>
