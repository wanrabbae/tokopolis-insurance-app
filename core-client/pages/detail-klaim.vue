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

            <div class="card">

                <div class="card-header d-flex justify-content-between border-bottom">

                    <span class="fw-bold">No. Klaim {{ policyData.claimNumber }}</span>

                    <!-- <span class="fw-bold">
                        Berakhir dalam 28 Hari
                    </span> -->

                </div> <!-- card-header ends -->

                <div class="card-body border-bottom">

                    <div class="row align-items-center">

                        <div class="col-12 col-md-6 d-flex align-items-center">

                            <div class="d-inline-block mr-3">

                                <nuxt-img
                                    width="96"
                                    height="96"
                                    preset="default"
                                    class="rounded-circle"
                                    :src="policyData.image"
                                    alt="Mobil"
                                />

                            </div>

                            <div class="d-inline-block">

                                <div class="fs-4 fw-bold mb-1">{{ policyData.holder }}</div>

                                <div class="fs-5 fw-bold mb-1">{{ policyData.name }}</div>

                            </div>

                        </div> <!-- col-12.col-md-6 ends -->

                        <div class="col-12 col-md-6 text-right">

                            <div class="mb-2">{{ policyData.period }}</div>

                            <div class="badge py-2 px-3 rounded-pill mr-1" :class="policyData.status !== 'declined' ? 'badge-primary' : 'badge-warning'" >
                                {{ status[policyData.status] }}
                            </div>

                            <div class="badge py-2 px-3 rounded-pill badge-info mr-1">
                                {{ policyData.quotationID }}
                            </div>

                            <div class="d-inline-block">

                                <fa icon="share-nodes" width="16px" height="16px" />

                            </div>

                        </div> <!-- col-12.col-md-6 ends -->

                    </div> <!-- row ends -->

                </div> <!-- card-body ends -->

                <div class="card-body">

                    <div class="fs-4 fw-bold mb-2">Proses Klaim</div>

                    <StepNavigation
                        :steps="policyData.steps"
                        :current-step="policyData.currentStep"
                        class="py-4"
                        @nav-click="navClickHandler"
                    />

                </div> <!-- card-body ends -->

            </div> <!-- card ends -->

        </div> <!-- container ends -->

    </div>

</template>

<script>
import moment from 'moment'

import StepNavigation from '../components/StepNavigation'

export default {
    components: {
        StepNavigation
    },
    data() {
        return {
            id: this.$route.query.id,
            title: 'Detail Klaim',
            policyData: {
                claimNumber: "C-00.00.0000",
                quotationID: "TKP-00000000-000000-0000",
                holder: "",
                name: "",
                period: "",
                image: "/img/car-icon-comprehensive.png",
                status: "pending",
                currentStep: 0,
                steps: [
                    {
                        icon: "ReportIcon",
                        caption: "Laporan Klaim",
                        dateComplete: ""
                    },
                    {
                        icon: "SurveyIcon",
                        caption: "Survey Klaim",
                        dateComplete: "13 Februari 2020"
                    },
                    {
                        icon: "ApprovedIcon",
                        caption: "Klaim Diterima",
                        dateComplete: "14 Februari 2020"
                    },
                    {
                        icon: "VehicleUnderRepairIcon",
                        caption: "Perbaikan Kendaraan di Bengkel",
                        dateComplete: "15 Februari 2020"
                    },
                    {
                        icon: "VehicleReadyIcon",
                        caption: "Kendaraan Siap Diambil",
                        dateComplete: "16 Februari 2020"
                    },
                    {
                        icon: "CheckedIcon",
                        caption: "Selesai",
                        dateComplete: "17 Februari 2020"
                    }
                ]
            },
            status: {
                pending: "Tertunda",
                surveyed: "Telah Disurvey",
                accepted: "Klaim Diterima",
                declined: "Klaim Ditolak",
                fixed: "Sedang Diperbaiki",
                ready: "Siap Diambil",
                done: "Selesai",
            }
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    created() {
        this.getData()
    },
    methods: {
        navClickHandler(id) {
            this.policyData.currentStep = id;
        },
        async getData() {
            await this.$axios.$get(`api/claim/${this.$route.query.id}`)
                .then((response) => {
                    console.log(response)

                    const start = moment(response.data.created_at)

                    this.policyData.claimNumber = response.data.id
                    this.policyData.quotationID = response.data.transaction_id
                    this.policyData.holder = response.data.holder_fullname
                    this.policyData.name = response.data.product.name
                    this.policyData.image = response.data.product.type === "comprehensive" ? "/img/car-icon-comprehensive.png" : "/img/car-icon-tlo.png"

                    this.policyData.period = `Tanggal Pengajuan: ${start.format('D MMM yyyy')}`
                    this.policyData.status = response.data.status
                    this.policyData.steps[0].dateComplete = moment(response.data.created_at).format('D MMM yyyy')
                })
        },
    }
}
</script>