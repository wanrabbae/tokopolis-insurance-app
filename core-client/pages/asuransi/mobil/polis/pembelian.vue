<template>

    <div class="py-6" style="background-color: #f6f5fc">

        <main role="main" class="container">

            <div class="card border">

                <div class="card-header border-bottom">

                    <h2 class="mb-0">Pemegang Polis dan Data Kendaraan</h2>

                </div> <!-- card-header ends-->

                <validation-observer
                    v-slot="{ invalid }"
                    tag="div"
                    class="card-body"
                >

                    <div class="row">

                        <div class="col-12 col-md-6 mb-4">

                            <div class="mb-2">
                                <span class="fw-bold">Total Premi</span>
                            </div>

                            <div class="mb-4">
                                <span class="fs-2 fw-bold">{{ model.totalPremium }}</span>
                            </div>

                            <div class="mb-md-2 mb-3">
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

                            <div class="mb-md-2 mb-3">
                                <span class="fw-bold">Dokumen yang Diperlukan</span>
                            </div>

                            <div class="p-0 p-md-3 rounded border-0 border-md">

                                <validation-provider
                                    v-for="(field, i) in documentFields"
                                    :key="i" v-slot="{ errors, validate }"
                                    rules="required|image"
                                    tag="fieldset"
                                    class="form-group"
                                    :name="field.label"
                                >

                                    <div class="d-flex align-items-center">

                                        <div class="mr-3" style="width: 32px; width: 32px;">

                                            <img v-if="url[field.key]" :src="url[field.key]">

                                            <img v-else src="/svg/new/item-pictures.svg">

                                        </div>

                                        <label :for="field.key" class="flex-grow-1 mb-0">
                                            {{ field.label }}
                                            <span v-if="field.required" class="text-danger">*</span>
                                        </label>

                                        <b-form-file
                                            :id="field.key"
                                            v-model="model[field.key]"
                                            name="identity-image"
                                            class="d-none"
                                            accept="image/jpeg, image/png"
                                            plain
                                            :required="field.required"
                                            @change="(e) => onFileChange(e, validate)"
                                        />

                                        <BaseButton tag="label" classes="mb-0" :for="field.key">Upload</BaseButton>

                                    </div>

                                    <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
                                        {{ errors[0] }}
                                    </div>

                                </validation-provider>

                            </div>

                        </div> <!-- col-12.col-md-6 ends-->

                        <div class="col-12 col-md-6">

                            <div class="mb-md-2 mb-3">
                                <span class="fw-bold">Detail Pemegang Polis</span>
                            </div>

                            <div class="p-0 p-md-3 rounded border-0 border-md mb-4">

                                <BaseInput
                                    v-model="model.client.fullname"
                                    name="Nama"
                                    label="Nama"
                                    placeholder="Josua Jostar"
                                    rules="required"
                                    required
                                    asterix
                                />

                                <BaseInput
                                    v-model="model.client.phone"
                                    type="number"
                                    name="Nomor Telepon"
                                    label="Nomor Telepon"
                                    placeholder="+62812345678"
                                    input-classes="custom-number"
                                    onkeypress="if(this.value.length==14) return false;"
                                />

                                <BaseInput
                                    v-model="model.client.email"
                                    name="Email"
                                    label="Email"
                                    placeholder="user@email.com"
                                    rules="email"
                                />

                            </div>

                            <div class="mb-md-2 mb-3">
                                <span class="fw-bold">Alamat Pemegang Polis</span>
                            </div>

                            <div class="p-0 p-md-3 rounded border-0 border-md mb-4">

                                <BaseTextarea
                                    v-model="model.fullAddress"
                                    name="Alamat Lengkap"
                                    label="Alamat Lengkap"
                                    placeholder="Jl. TB Simatupang Banjarsari I no. 8C"
                                    rules="required"
                                    rows="2"
                                    required
                                    asterix
                                />

                                <BaseSelect
                                    v-model="model.province"
                                    name="Provinsi"
                                    label="Provinsi"
                                    rules="required"
                                    :options="provinceOptions"
                                    required
                                    asterix
                                    @change="getCity"
                                />

                                <BaseSelect
                                    v-model="model.city"
                                    name="Kota/Kabupaten"
                                    label="Kota/Kabupaten"
                                    rules="required"
                                    :options="cityOptions"
                                    :disabled="!condition.city"
                                    required
                                    asterix
                                    @change="getDistrict"
                                />

                                <BaseSelect
                                    v-model="model.district"
                                    name="Kecamatan"
                                    label="Kecamatan"
                                    rules="required"
                                    :options="districtOptions"
                                    :disabled="!condition.district"
                                    required
                                    asterix
                                    @change="getUrban"
                                />

                                <BaseSelect
                                    v-model="model.urban"
                                    name="Kelurahan"
                                    label="Kelurahan"
                                    rules="required"
                                    :options="urbanOptions"
                                    :disabled="!condition.urban"
                                    required
                                    asterix
                                />

                                <BaseInput
                                    v-model="model.postalCode"
                                    type="number"
                                    name="Kode Pos"
                                    label="Kode Pos"
                                    placeholder="12500"
                                    rules="required|digits:5"
                                    input-classes="custom-number"
                                    required
                                    asterix
                                    onkeypress="if(this.value.length==5) return false;"
                                />

                                <b-form-checkbox v-model="model.useAdressToShip">
                                    Kirim File Polis dalam bentuk Hard Copy menuju alamat ini
                                </b-form-checkbox>

                            </div>

                            <div class="mb-md-2 mb-3">
                                <span class="fw-bold">Detail Kendaraan</span>
                            </div>

                            <div class="p-0 p-md-3 rounded border-0 border-md mb-4">

                                <BaseInput
                                    v-model="model.vehicleColor"
                                    name="Warna Mobil"
                                    label="Warna Mobil"
                                    placeholder="Putih"
                                    rules="required"
                                    required
                                    asterix
                                />

                                <BaseInput
                                    v-model="model.plateDetail"
                                    name="Nomor Plat"
                                    label="Nomor Plat"
                                    :prefix-text= model.licensePlate
                                    placeholder="1234 WW"
                                    rules="required"
                                    required
                                    asterix
                                />

                                <BaseInput
                                    v-model="model.machineNumber"
                                    name="Nomor Mesin"
                                    label="Nomor Mesin"
                                    placeholder="SDR72V2500W2017060104R"
                                    rules="required"
                                    required
                                    asterix
                                />

                                <BaseInput
                                    v-model="model.skeletonNumber"
                                    name="Nomor Rangka"
                                    label="Nomor Rangka"
                                    placeholder="1HGBH41JXMN109186"
                                    rules="required"
                                    required
                                    asterix
                                />

                            </div>

                        </div> <!-- col-12.col-md-6 ends-->

                    </div> <!-- row ends-->

                    <BaseButton :disabled="invalid" block @click="postTranscation">Lanjutkan</BaseButton>

                </validation-observer> <!-- card-body ends -->

            </div> <!-- card ends -->

        </main> <!-- container ends-->

        <Loading :show="loading"/>
    </div>

</template>

<script>
import BaseInput from '../../../../components/Inputs/BaseInput'
import BaseSelect from '../../../../components/Inputs/BaseSelect'
import BaseTextarea from '../../../../components/Inputs/BaseTextarea'

export default {
    components: {
        BaseInput,
        BaseSelect,
        BaseTextarea
    },
    data () {
        return {
            title: 'Pembelian',
            id: null,
            formData: null,
            url: [],
            loading : true,
            model: {
                totalPremium: this.formatPrice(0),
                vehicleCondition: 'new',
                client: {
                    fullname: null,
                    email: null,
                    phone: null,
                },
                fullAddress: null,
                province: null,
                city: null,
                district: null,
                urban: null,
                postalCode: null,
                useAdressToShip: false,
                plateDetail: null,
                licensePlate:null,
                vehicleColor: null,
                machineNumber: null
            },
            condition:{
                city: false,
                district: false,
                urban: false
            },
            vehicleConditionOptions: [
                { text: 'Baru', value: 'new' },
                { text: 'Bekas', value: 'used' },
            ],
            provinceOptions: [
                { text: 'Pilih Provinsi', value: null },
            ],
            cityOptions: [
                { text: 'Pilih Kota/Kabupaten', value: null },
            ],
            districtOptions: [
                { text: 'Pilih Kecamatan', value: null },
                { text: 'Wonokromo', value: 'wonokromo' },
                { text: 'Waru', value: 'waru' }
            ],
            urbanOptions: [
                { text: 'Pilih Kelurahan', value: null },
                { text: 'Sidokepung', value: 'sidokepung' }
            ],
            newVehicleDocumentFields: [
                {
                    key: "bastk",
                    label: "BASTK",
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
                    label: "Foto Tambahan"
                },
                {
                    key: "optional_2",
                    label: "Foto Tambahan"
                },
                {
                    key: "optional_3",
                    label: "Foto Tambahan"
                },
                {
                    key: "optional_4",
                    label: "Foto Tambahan"
                }
            ]
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    computed: {
        documentFields() {
            return this.model.vehicleCondition === 'new' ? this.newVehicleDocumentFields : this.usedVehicledocumentFields;
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
        this.getProvince()
    },
    methods: {
        reviewPayment() {
            this.$router.push({name: "asuransi-mobil-polis-review-pembelian"})
        },
        onFileChange(e, validate) {
            if(!e.target.files[0]) return;
            this.url[e.target.id] = URL.createObjectURL(e.target.files[0])
            validate();
            console.log(e);
        },
        async getDataTransaction() {
            await this.$axios.$get('api/transaction')
                .then ((response) => {
                    this.model.licensePlate = response.data.plate
                    this.model.totalPremium = this.formatPrice(response.data.price)

                    this.loading = false
                })
                .catch (error => {
                    if(error.response.status === 400){
                        this.$router.push({name: "asuransi-mobil-polis"})
                    }
                })
        },
        postTranscation() {
            const self = this
            this.formData = new FormData()

            // silahkan diperbaiki kalau ada yang salah
            if(this.model.vehicleCondition === 'new') {
                this.formData.append('bastk',this.model.bastk)
                this.formData.append('identity_card',this.model.identityCard)
            } else {
                this.formData.append('stnk',this.model.stnk)
                this.formData.append('front_side',this.model.frontSide)
                this.formData.append('back_side',this.model.backSide)
                this.formData.append('left_side',this.model.leftSide)
                this.formData.append('right_side',this.model.rightSide)
                this.formData.append('dashboard',this.model.dashboard)
            }

            this.formData.append('fullname', this.model.client.fullname)
            this.formData.append('email', this.model.client.email)
            this.formData.append('phone', this.model.client.phone)
            
            this.formData.append('address_village_id',this.model.urban)
            this.formData.append('address_detail',this.model.fullAddress + " " + this.model.postalCode)  
            this.formData.append('use_address_to_ship',this.model.useAdressToShip)

            this.formData.append('condition',this.model.vehicleCondition)
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
        isNull(data) {
            return (data === null || data === "")
        },
        resetField(){
            this.condition.city = false
            this.condition.district = false
            this.condition.urban = false
        },
        async getProvince(){
            this.resetField()

            this.provinceOptions = [{ text: 'Pilih Provinsi', value: null }]
            this.model.city = null
            this.model.district = null
            this.model.urban = null

            await this.$axios.$get('api/address/provinces')
            .then ((response) => {
                
                response.data.forEach(element => {
                    this.provinceOptions.push({
                        text: element.name,
                        value: element.id
                    })
                });


            })
        },
        async getCity(){
            this.resetField()

            this.cityOptions = [{ text: 'Pilih Kota/Kabupaten', value: null }]
            this.model.district = null
            this.model.urban = null

            if (this.isNull(this.model.province)) {
                return
            }

            await this.$axios.$get(`api/address/regencies?province_id=${this.model.province}`)
            .then ((response) => {
                this.model.city = null
                this.condition.city = true

                response.data.forEach(element => {
                    this.cityOptions.push({
                        text: element.name,
                        value: element.id
                    })
                });

            })
        },
        async getDistrict(){
            this.resetField()

            this.condition.city = true

            this.districtOptions = [{ text: 'Pilih Kecamatan', value: null }]
            this.model.urban = null

            if (this.isNull(this.model.city)) {
                return
            }

            await this.$axios.$get(`api/address/districts?regency_id=${this.model.city}`)
            .then ((response) => {
                this.model.district = null
                this.condition.district = true

                response.data.forEach(element => {
                    this.districtOptions.push({
                        text: element.name,
                        value: element.id
                    })
                });

            })
        },
        async getUrban(){
            this.resetField()

            this.condition.city = true
            this.condition.district = true

            this.urbanOptions = [{ text: 'Pilih Kelurahan', value: null }]

            if (this.isNull(this.model.district)) {
                return
            }

            await this.$axios.$get(`api/address/villages?district_id=${this.model.district}`)
            .then ((response) => {
                this.model.urban = null
                this.condition.urban = true

                response.data.forEach(element => {
                    this.urbanOptions.push({
                        text: element.name,
                        value: element.id
                    })
                });

            })
        }
        
    }
}
</script>
