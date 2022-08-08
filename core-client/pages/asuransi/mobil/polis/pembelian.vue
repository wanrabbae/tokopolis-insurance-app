<template>

    <div class="py-4 py-lg-5" style="background-color: #f6f5fc">

        <main role="main" class="container">

            <div class="card border">

                <div class="card-header border-bottom">

                    <h2 class="mb-0">Pemegang Polis dan Data Kendaraan</h2>

                </div> <!-- card-header ends-->

                <ValidationObserver 
                    v-slot="{ invalid }"
                    tag="div"
                    class="card-body"
                >

                    <div class="row">

                        <div class="col-12 col-lg-6 mb-4">

                            <div class="mb-lg-2 mb-3">
                                <span class="fw-bold">Total Premi</span>
                            </div>

                            <div class="mb-4">
                                <span class="fs-2 fw-bold">{{ model.totalPremium }}</span>
                            </div>

                            <div class="mb-lg-2 mb-3">
                                <span class="fw-bold">Kondisi Kendaraan</span>
                            </div>

                            <div class="mb-4">
                                
                                <b-form-radio-group     
                                    v-model="model.vehicleCondition"
                                    :options="vehicleConditionOptions" 
                                    button-variant="primary"
                                    buttons
                                ></b-form-radio-group>

                            </div>

                            <div class="mb-lg-2 mb-3">
                                <span class="fw-bold">Dokumen yang Diperlukan</span>
                            </div>

                            <div class="p-0 p-lg-3 rounded border-0 border-lg">

                                <div v-for="(field, i) in documentFields" :key="i" class="d-flex align-items-center" :class="{ 'mb-3' : i !== documentFields.length - 1 }">

                                    <div class="mr-3" style="min-width: 32px; max-width: 32px;">

                                        <img v-if="url[field.key]" :src="url[field.key]">

                                        <img v-else src="/svg/new/item-pictures.svg">

                                    </div>

                                    <div class="flex-grow-1">
                                        <span>{{ field.label }}</span>
                                    </div>

                                    <div class="d-block">

                                        <b-form-file
                                            :id="field.key"
                                            v-model="model[field.key]"
                                            name="identity-image"
                                            class="d-none"
                                            accept="image/jpeg, image/png"
                                            plain
                                            :required="field.required"
                                            @change="onFileChange"
                                        />

                                        <BaseButton tag="label" classes="mb-0" :for="field.key">Upload</BaseButton>

                                    </div>

                                </div>

                            </div>

                        </div> <!-- col-12.col-lg-6 ends-->

                        <div class="col-12 col-lg-6">

                            <div class="mb-lg-2 mb-3">
                                <span class="fw-bold">Detail Pemegang Polis</span>
                            </div>

                            <div class="p-0 p-lg-3 rounded border-0 border-lg mb-4">

                                <BaseInput
                                    v-model="model.name"
                                    name="Nama"
                                    label="Nama"
                                    placeholder="Josua Jostar"
                                    rules="required"
                                />

                                <BaseInput
                                    v-model="model.phone"
                                    type="number"
                                    name="Nomor Telepon"
                                    label="Nomor Telepon"
                                    placeholder="+62812345678"
                                    rules="required"
                                    input-classes="form-control custom-number"
                                    onkeypress="if(this.value.length==14) return false;"
                                />

                                <BaseInput
                                    v-model="model.email"
                                    name="Email"
                                    label="Email"
                                    placeholder="user@gmail.com"
                                    rules="required|email"
                                    required
                                />

                                <BaseTextarea
                                    v-model="model.address"
                                    name="Alamat Lengkap"
                                    label="Alamat Lengkap"
                                    placeholder="Jl. TB Simatupang Banjarsari I no. 8C, Kelurahan Cilandak Barat, Kecamatan Cilandak, Kota Jakarta Selatan, DKI Jakarta 12430"
                                    rules="required"
                                    rows="4"
                                    required
                                />

                            </div>

                            <div class="mb-lg-2 mb-3">
                                <span class="fw-bold">Detail Kendaraan</span>
                            </div>

                            <div class="p-0 p-lg-3 rounded border-0 border-lg mb-4">

                                <BaseInput
                                    v-model="model.vehicleColor"
                                    name="Warna Mobil"
                                    label="Warna Mobil"
                                    placeholder="Putih"
                                    rules="required"
                                    required
                                ></BaseInput>

                                <BaseInput
                                    v-model="model.plateDetail"
                                    name="Nomor Plat"
                                    label="Nomor Plat"
                                    :prefix-text= model.licensePlate
                                    placeholder="1234 WW"
                                    rules="required"
                                    required
                                />

                                <BaseInput
                                    v-model="model.machineNumber"
                                    name="Nomor Mesin"
                                    label="Nomor Mesin"
                                    placeholder="SDR72V2500W2017060104R"
                                    rules="required"
                                    required
                                />

                                <BaseInput
                                    v-model="model.skeletonNumber"
                                    name="Nomor Rangka"
                                    label="Nomor Rangka"
                                    placeholder="1HGBH41JXMN109186"
                                    rules="required"
                                    required
                                />

                            </div>

                        </div> <!-- col-12.col-lg-6 ends-->

                    </div> <!-- row ends-->

                    <BaseButton :disabled="invalid || invalidDocumentsValidation" block @click="postTranscation">Lanjutkan</BaseButton>

                </ValidationObserver> <!-- card-body ends -->

            </div> <!-- card ends -->

        </main> <!-- container ends-->

        <Loading :show="loading"/>
    </div>

</template>

<script>
import { ValidationObserver } from 'vee-validate'
import BaseInput from '../../../../components/Inputs/BaseInput'
import BaseTextarea from '../../../../components/Inputs/BaseTextarea'

export default {
    components: {
        BaseInput,
        BaseTextarea,
        ValidationObserver
    },
    data () {
        return {
            id: null,
            formData: null,
            url: [],
            loading : true,
            model: {
                totalPremium: this.formatPrice(0),
                vehicleCondition: 'new',
                name: null,
                phone: null,
                email: null,
                address: null,
                plateDetail: null,
                vehicleColor: null,
                machineNumber: null
            },
            vehicleConditionOptions: [
                { text: 'Baru', value: 'new' },
                { text: 'Bekas', value: 'used' },
            ],
            newVehicleDocumentFields: [
                {
                    key: "recordOfTransfer",
                    label: "Berita Acara Serah Terima Kendaraan (BASTK)",
                    required: true
                },
                {
                    key: "identityCard",
                    label: "Kartu Identitas (KTP/NPWP/PASPOR/SIM)",
                    required: true
                }
            ],
            usedVehicledocumentFields: [
                {
                    key: "stnk",
                    label: "Foto STNK",
                    required: true
                },
                {
                    key: "frontSide",
                    label: "Foto Bagian Depan Kendaraan",
                    required: true
                },
                {
                    key: "backSide",
                    label: "Foto Bagian Belakang Kendaraan",
                    required: true
                },
                {
                    key: "leftSide",
                    label: "Foto Bagian Kiri Kendaraan",
                    required: true
                },
                {
                    key: "rightSide",
                    label: "Foto Bagian Kanan Kendaraan",
                    required: true
                },
                {
                    key: "dashboard",
                    label: "Foto Dasbor Kendaraan",
                    required: true
                },
                {
                    key: "optional_1",
                    label: "Foto Tambahan (Opsional)"
                },
                {
                    key: "optional_2",
                    label: "Foto Tambahan (Opsional)"
                },
                {
                    key: "optional_3",
                    label: "Foto Tambahan (Opsional)"
                },
                {
                    key: "optional_4",
                    label: "Foto Tambahan (Opsional)"
                }
            ]
        }
    },
    head() {
        return {
            title: 'Pembelian - Pico Insurtech',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Deskripsi Halaman'
                }
            ]
        };
    },
    computed: {
        documentFields() {
            return this.model.vehicleCondition === 'new' ? this.newVehicleDocumentFields : this.usedVehicledocumentFields;
        },
        invalidDocumentsValidation(){
            let invalid = false

            this.documentFields.forEach(field => {
                if (field.required && (this.model[field.key] === undefined || this.model[field.key] === null || this.model[field.key] === '')){
                    invalid = true
                }
            })

            return invalid
        }
    },
    deactivated(){
        this.$destroy()
    },
    created(){
        this.id =  this.$store.state.product_id
    },
    mounted(){
        this.getDataTransaction()
    },
    methods: {
        reviewPayment() {
            this.$router.push({name: "asuransi-mobil-polis-review-pembelian"})
        },
        onFileChange(e) {
            const file = e.target.files[0];
            this.url[e.target.id] = URL.createObjectURL(file);

        },
        async getDataTransaction() {
            await this.$axios.$get('api/transaction')
                .then ((response) => {

                    this.model.totalPremium = this.formatPrice(response.data.price)
                    this.loading = false
                })
                .catch (error => {
                    console.log(error)
                })
        },
        postTranscation() {
            const self = this
            this.formData = new FormData()

            // silahkan diperbaiki kalau ada yang salah
            if(this.model.vehicleCondition === 'new') {
                this.formData.append('record_of_transfer',this.model.recordOfTransfer)
                this.formData.append('identity_card',this.model.identityCard)
            } else {
                this.formData.append('stnk',this.model.stnk)
                this.formData.append('front_side',this.model.frontSide)
                this.formData.append('back_side',this.model.backSide)
                this.formData.append('left_side',this.model.leftSide)
                this.formData.append('right_side',this.model.rightSide)
                this.formData.append('dashboard',this.model.dashboard)
            }

            this.formData.append('vehicle_color',this.model.vehicleColor)
            this.formData.append('plate_detail',this.model.plateDetail)
            this.formData.append('machine_number',this.model.machineNumber)
            this.formData.append('skeleton_number',this.model.skeletonNumber)

            this.$axios.$post(`api/transaction?product_id=${this.id}`, this.formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(function(response) {

                self.$store.commit('setTransactionId',response.data.transaction_id)
                self.$router.push({name: "asuransi-mobil-polis-review-pembelian"})

            })
        },
        test() {
            console.log(this.model.customModalData)
        }
    }
}
</script>   