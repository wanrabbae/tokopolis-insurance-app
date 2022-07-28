<template>

    <div class="py-4 py-lg-5" style="background-color: #f6f5fc">

        <main role="main" class="container">

            <div class="card border">

                <div class="card-header border-bottom">

                    <h2 class="mb-0">Pemegang Polis dan Data Kendaraan</h2>

                </div> <!-- card-header ends-->

                <div class="card-body">

                    <div class="row">

                        <div class="col-12 col-lg-6 mb-4">

                            <div class="mb-lg-2 mb-3">
                                <span class="fw-bold">Total Premi</span>
                            </div>

                            <div class="mb-4">
                                <span class="fs-2 fw-bold">{{ model.totalPremi }}</span>
                            </div>

                            <div class="mb-lg-2 mb-3">
                                <span class="fw-bold">Dokumen yang Diperlukan</span>
                            </div>

                            <div class="p-0 p-lg-3 rounded border-0 border-lg">

                                <div v-for="(field, i) in documentFields" :key="i" class="d-flex align-items-center" :class="{ 'mb-3' : i !== documentFields.length - 1 }">

                                    <div class="mr-3" style="min-width: 32px; max-width: 32px;">

                                        <img v-if="url[field.key]" :src="url[field.key]">

                                        <img v-else src="/svg/picture.svg">

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
                                    placeholder="Masukkan Nama"
                                    :rules="{ required: true }"
                                    required
                                />

                                <BaseInput
                                    v-model="model.phone"
                                    type="number"
                                    name="Nomor Telepon"
                                    label="Nomor Telepon"
                                    placeholder="081XXXXXXXXX"
                                    :rules="{ required: true }"
                                    input-classes="form-control custom-number"
                                    onkeypress="if(this.value.length==14) return false;"
                                    required
                                />

                                <BaseInput
                                    v-model="model.email"
                                    name="Email"
                                    label="Email"
                                    placeholder="Masukkan Email"
                                    :rules="{required: true, email: true}"
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
                                    placeholder="Masukkan Warna Mobil"
                                    :rules="{ required: true }"
                                    required
                                    @change="checkFormData"
                                ></BaseInput>

                                <BaseInput
                                    v-model="model.plateNumber"
                                    name="Nomor Plat"
                                    label="Nomor Plat"
                                    prepend-icon="w"
                                    placeholder="Masukkan Nomor Plat"
                                    :rules="{ required: true }"
                                    required
                                    @change="checkFormData"
                                />

                                <BaseInput
                                    v-model="model.machineNumber"
                                    name="Nomor Mesin"
                                    label="Nomor Mesin"
                                    placeholder="Masukkan Nomor Mesin"
                                    :rules="{ required: true }"
                                    required
                                    @change="checkFormData"
                                />

                                <BaseInput
                                    v-model="model.vehicleIdentificationNumber"
                                    name="Nomor Rangka"
                                    label="Nomor Rangka"
                                    placeholder="Masukkan Nomor Rangka"
                                    :rules="{ required: true }"
                                    required
                                    @change="checkFormData"
                                />

                            </div>

                        </div> <!-- col-12.col-lg-6 ends-->

                    </div> <!-- row ends-->

                    <BaseButton :disabled="!validateForm" block @click="postTranscation">Lanjutkan</BaseButton>

                </div> <!-- card-body ends -->

            </div> <!-- card ends -->

        </main> <!-- container ends-->

        <Loading :show="loading"/>
    </div>

</template>

<script>
import BaseInput from '../../../../components/Inputs/BaseInput'

export default {
    components: {
    BaseInput,
},
    data () {
        return {
            id: null,
            formData: null,
            url: [],
            validate: false,
            loading : true,
            model: {
                name: "",
                phone: "",
                email: "",
                totalPremi: this.formatPrice(0),
                startDatePeriod: null,
                vehicleColor: null,
                machineNumber: null,
                plateNumber:null,
                vehicleIdentificationNumber: null,
                stnk: null,
                vehicleFront: null,
                vehicleRight: null,
                vehicleLeft: null,
                vehicleBehind: null,
                vehicleDasboard: null,
                optionalPhoto1: null,
                optionalPhoto2: null,
                optionalPhoto3: null,
                optionalPhoto4: null,
            },
            documentFields: [
                {
                    key: "stnk",
                    label: "Foto STNK",
                    required: true
                },
                {
                    key: "vehicleFront",
                    label: "Foto Bagian Depan Kendaraan",
                    required: true
                },
                {
                    key: "vehicleRight",
                    label: "Foto Bagian Kanan Kendaraan",
                    required: true
                },
                {
                    key: "vehicleLeft",
                    label: "Foto Bagian Kiri Kendaraan",
                    required: true
                },
                {
                    key: "vehicleBehind",
                    label: "Foto Bagian Belakang Kendaraan",
                    required: true
                },
                {
                    key: "vehicleDasboard",
                    label: "Foto Dasbor Kendaraan",
                    required: true
                },
                {
                    key: "optionalPhoto1",
                    label: "Foto Tambahan (Opsional)"
                },
                {
                    key: "optionalPhoto2",
                    label: "Foto Tambahan (Opsional)"
                },
                {
                    key: "optionalPhoto3",
                    label: "Foto Tambahan (Opsional)"
                },
                {
                    key: "optionalPhoto4",
                    label: "Foto Tambahan (Opsional)"
                }
            ],
            calendarLabels: {
                labelPrevDecade: 'Dekade Sebelumnya',
                labelPrevYear: 'Tahun Sebelumnya',
                labelPrevMonth: 'Bulan Sebelumnya',
                labelCurrentMonth: 'Bulan Ini',
                labelNextMonth: 'Bulan Depan',
                labelNextYear: 'Tahun Depan',
                labelNextDecade: 'Dekade Depan',
                labelToday: 'Hari Ini',
                labelSelected: 'Tanggal Terpilih ',
                labelNoDateSelected: 'Tanggal Belum Dipilih',
                labelCalendar: 'Kalendar',
                labelNav: 'Navigasi Kalendar',
                labelHelp: 'Gunakan Anak Panah Sebagai Bantuan Navigasi'
            }
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
        validateForm(){
            const required = [
                this.model.name,
                this.model.phone,
                this.model.email,
                this.model.vehicleColor,
                this.model.machineNumber,
                this.model.plateNumber,
                this.model.vehicleIdentificationNumber,
                this.model.stnk,
                this.model.vehicleFront,
                this.model.vehicleRight,
                this.model.vehicleLeft,
                this.model.vehicleBehind,
                this.model.vehicleDasboard]

            for(let i = 0; i < 14; i++){
                if (required[i] === null || required[i] === ''){
                    return false
                }
            }
            return true
        }
    },
    deactivated(){
        this.$destroy()
    },
    created(){
        // this.$destroy()
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
        async getProductList(){
            const param = () => {
                if (this.model !== null && this.model !== undefined)
                    return {
                        year: this.model.yearProduction,
                        brand: this.model.brand,
                        model: this.model.type,
                        sub_model: this.model.series,
                        price: this.model.price,
                        plate: this.model.licensePlate,
                        protection: this.model.insurancePackage,
                        use: this.model.usage,
                        acc: this.model.accessories
                    }

            }

            await this.$axios.$get('api/product', {
                params: param()
            }).then ((response) => {
                
                this.loading = false

            }).catch (error => {
                console.log(error)
                this.$router.push({name: "asuransi-mobil"})
            })
        },
        async getDataTransaction() {
            await this.$axios.$get('api/transaction')
                .then ((response) => {
                    this.model.name = response.data.account.fullname
                    this.model.email = response.data.account.email
                    this.model.phone = response.data.account.phone
                    this.model.totalPremi = this.formatPrice(response.data.price)
                    this.loading = false
                })
                .catch (error => {
                    console.log(error)
                })
        },
        checkFormData(){
            const form = this.formData
            const data = ['stnk','front_side','back_side','left_side','right_side','dashboard','start_date','vehicle_color','machine_number','skeleton_number']
            // eslint-disable-next-line eqeqeq
            if(JSON.stringify(form)==JSON.stringify(data)){
                this.validate = true
            }

        },
        postTranscation() {
            const self = this
            this.formData = new FormData()
            this.formData.append('stnk',this.model.stnk)
            this.formData.append('front_side',this.model.vehicleFront)
            this.formData.append('back_side',this.model.vehicleBehind)
            this.formData.append('left_side',this.model.vehicleLeft)
            this.formData.append('right_side',this.model.vehicleRight)
            this.formData.append('dashboard',this.model.vehicleDasboard)
            this.formData.append('vehicle_color',this.model.vehicleColor)
            this.formData.append('plate_detail',this.model.plateNumber)
            this.formData.append('machine_number',this.model.machineNumber)
            this.formData.append('skeleton_number',this.model.vehicleIdentificationNumber)

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