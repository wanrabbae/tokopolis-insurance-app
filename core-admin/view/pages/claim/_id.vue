<template>
    <div>
        <PageHeader :title="title" />

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body row">
                        <div class="col-lg-12 col-12">
                            <div class="row">
                                <div class="col-6">
                                    <h4 class="card-title">Data Klaim</h4>
                                </div>
                                <div class="col-6">
                                    <span class="labels">{{ data.status }}</span>
                                </div>
                            </div>
                            
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <label for="">No. Klaim</label> 
                                    <div>{{ data.transaction_id }}</div>
                                </div>

                                <div class="col-md-6">
                                    <label for="">Produk</label> 
                                    <div>{{ data.product.name }}</div>
                                </div>
                            </div>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <label for="">No. Polisi</label> 
                                    <div>{{ data.plate_number }}</div>
                                </div>

                                <div class="col-md-6">
                                    <label for="">Reporter</label> 
                                    <div>{{ data.reporter_fullname }}</div>
                                </div>
                            </div>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <label for="">Pemegang Polis</label> 
                                    <div>{{ data.holder_fullname }}</div>
                                </div>

                                <div class="col-md-6">
                                    <label for="">Waktu Kejadian</label> 
                                    <div>{{ data.incident_time }}</div>
                                </div>
                            </div>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <label for="">Lokasi</label> 
                                    <div>{{ data.location }}</div>
                                </div>

                                <div class="col-md-6">
                                    <label for="">Kronologi Kejadian</label> 
                                    <div>{{ data.chronology }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xl-3" v-for="(item, key) of data.documents" v-bind:key="key">
                        <div class="card">
                            <div class="card-body">
                                <img :src="item" width="100%" @click="setLightBoxStatus(key)"
                                    style="object-fit: cover; height: 120px; cursor: pointer;" />
                                <vue-easy-lightbox :visible="getLightBoxStatus(key)" :imgs="item"
                                    @hide="setLightBoxStatus(key, false)"></vue-easy-lightbox>
                                <div class="text-center mt-3">
                                    {{ documentsText[key] }}
                                    <span v-if="data.assessment != null">
                                        <span v-if="data.assessment.item[key].status"
                                            class="badge bg-success rounded-status" v-b-tooltip.hover
                                            title="Kondisi Baik"><i class="uil uil-check"></i></span>
                                        <span v-else
                                            class="badge bg-danger rounded-status" v-b-tooltip.hover
                                            title="Kondisi Rusak"><i class="uil uil-multiply"></i></span>
                                    </span>
                                </div>
                                <div v-if="data.assessment != null && !data.assessment.item[key].status"
                                    class="text-center text-danger mt-2">{{ data.assessment.item[key].note }}</div>
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
                id: this.$nuxt.$route.params.id,
                title: "Detail Klaim",
                data: [],
                lightBoxImage: [],
                documentsText: {
                    'sim': 'SIM',
                    'driver_license': 'SIM',
                    'identity_card': 'Kartu Identitas',
                    'stnk': 'STNK',
                    'damage1': 'Kerusakan 1',
                    'damage2': 'Kerusakan 2',
                    'damage3': 'Kerusakan 3',
                    'damage4': 'Kerusakan 4',
                    'document_optional': 'Dokumen Lainnya'
                },
            }
        },
        mounted() {
            this.getDataDetail()
        },  
        methods: {
            async getDataDetail() {
                this.data = await this.$axios.$get(`/api/admin/claim/${this.id}`)
                    .then((response) => {
                        return response.data;
                    })
                return this.data;
            },
            getLightBoxStatus(key) {
                return this.lightBoxImage[key]
            },
            setLightBoxStatus(key, status = true) {
                this.lightBoxImage = this.lightBoxImage.map(item => false)
                this.lightBoxImage[key] = status
            },
        }
    }
</script>
<style>
    .labels {
        float: right;
        background: #918c8c;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
    }
</style>