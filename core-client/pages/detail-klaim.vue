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

                    <span class="fw-bold">No. Claim {{ policyData.claimNumber }}</span>

                    <span class="fw-bold">
                        Berakhir dalam 28 Hari
                    </span>

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

                            <div class="badge py-2 px-3 rounded-pill mr-1" :class="policyData.isActive ? 'badge-success' : 'badge-warning'" >
                                {{ policyData.isActive ? 'Aktif' : 'Belum Aktif' }}
                            </div>

                            <div class="badge py-2 px-3 rounded-pill mr-1" :class="policyData.isPaid ? 'badge-info' : 'badge-warning'" >
                                {{ policyData.isPaid ? 'Pembayaran Lunas' : 'Belum Lunas' }}
                            </div>

                            <div class="d-inline-block">

                                <fa icon="share-nodes" width="16px" height="16px" />

                            </div>

                        </div> <!-- col-12.col-md-6 ends -->

                    </div> <!-- row ends -->

                </div> <!-- card-body ends -->

                <div class="card-body">

                    <div class="fs-4 fw-bold mb-2">Proses Claim</div>

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
import StepNavigation from '../components/StepNavigation'

export default {
    components: {
        StepNavigation
    },
    data() {
        return {
            title: 'Detail Klaim',
            policyData: {
                claimNumber: "12345678912345678911237",
                holder: "John Doe",
                name: "Garda Oto Comprehensive",
                period: "22 Januari 2021 - 22 Januari 2022",
                image: "/svg/car.svg",
                isActive: true,
                isPaid: true,
                currentStep: 3,
                steps: [
                    {
                        icon: "ReportIcon",
                        caption: "Laporan Claim",
                        dateComplete: "12 Februari 2020"
                    },
                    {
                        icon: "SurveyIcon",
                        caption: "Survey Claim",
                        dateComplete: "13 Februari 2020"
                    },
                    {
                        icon: "ApprovedIcon",
                        caption: "Claim Diterima",
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
            }
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    methods: {
        navClickHandler(id) {
            this.policyData.currentStep = id;
        }
    }
}
</script>
