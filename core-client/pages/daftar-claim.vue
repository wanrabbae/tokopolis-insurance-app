<template>

    <div class="py-4 py-lg-5" style="background-color: #f6f5fc">

        <div class="container">

            <div class="container-header header-tabs mb-4">

                <ul class="nav nav-tabs">

                    <li role="presentation" class="nav-item">

                        <a href="/daftar-polis" class="nav-link" tabindex="-1">

                            <h2 class="tab-title">Daftar Polis</h2>

                        </a>

                    </li>

                    <li role="presentation" class="nav-item">

                        <a href="/daftar-claim" class="nav-link active" tabindex="-1">

                            <h2 class="tab-title">Daftar Claim</h2>

                        </a>

                    </li>

                </ul>

            </div> <!-- container-header ends -->

            <div class="container-content">

                <div class="row no-gutters">

                    <div class="col-12 col-lg-9 pr-lg-1 mb-2">

                        <b-input-group class="addon-combined">

                            <input
                                v-model="model.search"
                                placeholder="Cari Claim"
                                class="form-control"
                                required
                            >

                            <b-input-group-append>
                                <BaseButton type="icon" classes="px-3"><fa icon="magnifying-glass"/></BaseButton>
                            </b-input-group-append>

                        </b-input-group>

                    </div> <!-- col-12.col-lg-9 ends -->

                    <div class="col-12 col-lg-3 pl-lg-1 mb-2">

                        <BaseSelect
                            v-model="model.status"
                            name="Status"
                            :options="statusOptions"
                        />

                    </div> <!-- col-12.col-lg-3 ends -->

                </div> <!-- row ends -->

                <SwiperRadioButtonGroup
                    id="policy-category"
                    v-model="model.policyCategory"
                    name="policy-category"
                    :options="policyCategoryOptions"
                    class="mb-4"
                />

                <div v-for="(policy, id) in policies" :key="id" class="card" :class="{ 'mb-4': id < policies.length - 1 }">

                    <div class="card-header border-bottom">

                        <div class="row">

                            <div class="col-12 col-lg-8">

                                <span class="fw-bold">No. Claim {{ policy.claimNumber }}</span>

                            </div> <!-- col-12.col-lg-8 ends -->

                            <div class="col-12 col-lg-4 text-lg-right">

                                <span class="fw-bold">Berakhir dalam 28 Hari</span>

                            </div> <!-- col-12.col-lg-4 ends -->

                        </div> <!-- row ends -->

                    </div> <!-- container-card-header ends -->

                    <div class="card-body">

                        <div class="d-block mb-3">

                            <div class="d-inline-block align-top mr-3">

                                <img :src="policy.image" alt="Mobil" class="rounded-circle" style="max-height: 96px">

                            </div>

                            <div class="d-inline-block align-top">

                                <div class="fs-4 fw-bold">{{ policy.holder }}</div>

                                <div class="fs-5 fw-bold mb-1">{{ policy.name }}</div>

                                <div class="mb-2">{{ policy.period }}</div>

                                <div class="d-block">

                                    <div
                                        class="badge py-2 px-3 rounded-pill mr-1"
                                        :class="policy.isActive ? 'badge-success' : 'badge-warning'"
                                    >
                                        {{ policy.isActive ? 'Aktif' : 'Belum Aktif' }}
                                    </div>

                                    <div
                                        class="badge py-2 px-3 rounded-pill mr-1"
                                        :class="policy.isPaid ? 'badge-info' : 'badge-warning'"
                                    >
                                        {{ policy.isPaid ? 'Pembayaran Lunas' : 'Belum Lunas' }}
                                    </div>

                                    <div class="d-inline-block">

                                        <fa icon="share-nodes" style="width: 16px; height: 16px;"/>

                                    </div>

                                </div>

                            </div>

                        </div> <!-- d-block ends -->

                        <div class="text-right">

                            <BaseButton tag="a" href="/detail-claim">Periksa Claim</BaseButton>

                        </div> <!-- text-right ends -->

                    </div> <!-- card-body ends -->

                </div> <!-- card ends -->

            </div> <!-- container-content ends -->

        </div> <!-- container ends -->

    </div>

</template>

<script>
import BaseSelect from '../components/Inputs/BaseSelect'
import BaseButton from '../components/BaseButton'
import SwiperRadioButtonGroup from '../components/SwiperRadioButtonGroup'

export default {
    components: {
    BaseSelect,
    BaseButton,
    SwiperRadioButtonGroup
},
    data() {
        return {
            model: {
                search: null,
                status: null,
                policyCategory: null
            },
            statusOptions: [
                { text: 'Status', value: null },
                { text: 'Opsi Status 1', value: "status-1" },
                { text: 'Opsi Status 2', value: "status-2" },
                { text: 'Opsi Status 3', value: "status-3" }
            ],
            policyCategoryOptions: [
                { text: 'Semua Polis', value: null },
                { text: 'Smartphone', value: "smartphone" },
                { text: 'Mobil', value: "car" },
                { text: 'Motor', value: "motorcycle" },
                { text: 'Santunan Tunai', value: "cashCompensation" },
                { text: 'Jiwa', value: "life" },
                { text: 'Penyakit Tropis', value: "tropicalDisease" },
                { text: 'Perjalanan', value: "travel" },
            ],
            policies: [
                {
                    claimNumber: "12345678912345678911237",
                    holder: "John Doe",
                    name: "Garda Oto Comprehensive",
                    period: "22 Januari 2021 - 22 Januari 2022",
                    image: "/svg/car.svg",
                    isActive: true,
                    isPaid: true
                },
                {
                    claimNumber: "12345678912345678911237",
                    holder: "John Doe",
                    name: "Garda Oto Comprehensive",
                    period: "22 Januari 2021 - 22 Januari 2022",
                    image: "/svg/car.svg",
                    isActive: true,
                    isPaid: true
                }
            ]
        }
    },
    head() {
        return {
            title: 'Daftar Claim - Pico Insurtech',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Deskripsi Halaman'
                }
            ]
        };
    },
    mounted(){
    },
    methods:{
        
    }

}
</script>
