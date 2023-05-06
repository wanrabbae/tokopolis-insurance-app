<template>
    <div class="py-6" style="background-color: #f6f5fc">

        <div class="container">

            <div class="card border">

                <div class="card-header border-bottom">

                    <h2 class="mb-0">Form Laporan Claim</h2>

                </div> <!-- card-header ends -->

                <b-form class="card-body" @submit.prevent="postClaim">

                    <div class="row">

                        <div class="col-12 col-md-6 mb-4">

                            <div class="p-0 p-md-3 rounded border-0 border-md">

                                <BaseInput
                                    v-model="model.plateNumber"
                                    name="Nomor Plat Kendaraan"
                                    label="Nomor Plat Kendaraan"
                                    placeholder="B 1234 ABC"
                                    :rules="{ required: true }"
                                    required
                                />

                                <BaseInput
                                    v-model="model.policyReporter"
                                    name="Nama Pelapor"
                                    label="Nama Pelapor"
                                    placeholder="John Doe atau selain John Doe"
                                    :rules="{ required: true }"
                                    required
                                />

                                <BaseInput
                                    name="Nama Pemegang Polis"
                                    label="Nama Pemegang Polis"
                                    placeholder="John Doe"
                                    :value="model.policyHolder"
                                    disabled
                                />

                                <BaseInput
                                    name="ID Transaksi Tokopolis"
                                    label="ID Transaksi Tokopolis"
                                    placeholder="TKP-00000000-000000-0000"
                                    :value="id"
                                    disabled
                                />

                                <b-form-group label="Waktu Kejadian">

                                    <div class="row">

                                        <div class="col-7">

                                            <b-form-datepicker
                                                v-model="model.date"
                                                v-bind="calendarLabels"
                                                locale="id"
                                                :min="model.min"
                                                :max="$dayjs().format('YYYY-MM-DD HH:mm')"
                                                :open-date="$dayjs().format('YYYY-MM-DD HH:mm')"
                                                nav-button-variant="primary"
                                                :date-format-options="{ 'day': 'numeric', 'month': 'long', 'year': 'numeric' }"
                                                hide-header
                                                required
                                                right
                                            ></b-form-datepicker>

                                        </div> <!-- col ends -->

                                        <div class="col-5">
                                            <b-form-timepicker id="timepicker-placeholder" v-model="model.time" placeholder="Choose a time" locale="id"></b-form-timepicker>
                                        </div>

                                    </div> <!-- row ends -->

                                </b-form-group>

                                <BaseInput
                                    v-model="model.place"
                                    name="Lokasi Lengkap Kejadian"
                                    label="Lokasi Lengkap Kejadian"
                                    placeholder="Tulis Lokasi Lengkap Kejadian"
                                    :rules="{ required: true }"
                                    required
                                />

                                <BaseTextarea
                                    v-model="model.chronology"
                                    name="Kronologis Kejadian"
                                    label="Kronologis Kejadian"
                                    placeholder="Ceritakan Kronologis Kejadian dengan Jelas"
                                    rows="6"
                                    :rules="{ required: true }"
                                    required
                                />

                            </div>

                        </div> <!-- col ends -->

                        <div class="col-12 col-md-6 mb-4">

                            <div class="p-0 p-md-3 rounded border-0 border-md mb-4">

                                <div
                                    v-for="(field, id) in documentFields"
                                    :key="id"
                                    class="d-flex align-items-center"
                                    :class="{ 'mb-3' : id < documentFields.length - 1 }"
                                >

                                    <div class="mr-3" style="min-width: 32px; max-width: 32px;">
                                        <img v-if="documentImages[field.key]" :src="documentImages[field.key]">
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
                                        <BaseButton tag="label" :for="field.key">Upload</BaseButton>
                                    </div>

                                </div>

                            </div>

                            <b-form-checkbox required style="color: red" class="fw-bold">
                                Demikian informasi yang dapat saya berikan dengan sebenar-benarnya dan akan saya pertanggung jawabkan secara hukum
                            </b-form-checkbox>

                        </div> <!-- col ends -->

                        <div class="col-12">
                            <BaseButton native-type="submit" block>Ajukan Claim</BaseButton>
                        </div>

                    </div> <!-- row ends -->

                </b-form>

            </div>

        </div> <!-- container ends -->

    </div>
</template>

<script>
import BaseInput from '../components/Inputs/BaseInput'
import BaseTextarea from '../components/Inputs/BaseTextarea'

export default {
    components: {
        BaseInput,
        BaseTextarea
    },
    data() {

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        // 15th two months prior
        const minDate = new Date(today)
        minDate.setMonth(minDate.getMonth() - 1)

        return {
            id: this.$route.query.id,
            title: 'Form Laporan Klaim',
            model: {
                policyReporter: null,
                policyHolder: null,
                policyNumber: null,
                date: null,
                time: null,
                place: null,
                chronology: null,
                min: minDate
            },
            documentImages: [],
            documentFields: [
                {
                    key: "identity_card",
                    label: "Foto KTP",
                    required: true
                },
                {
                    key: "sim",
                    label: "Foto SIM Pengemudi",
                    required: true
                },
                {
                    key: "stnk",
                    label: "Foto STNK",
                    required: true
                },
                {
                    key: "document_optional",
                    label: "Dokumen Lain (Opsional)"
                },
                {
                    key: "damage1",
                    label: "Foto Kerusakan 1",
                    required: true
                },
                {
                    key: "damage2",
                    label: "Foto Kerusakan 2"
                },
                {
                    key: "damage3",
                    label: "Foto Kerusakan 3"
                },
                {
                    key: "damage4",
                    label: "Foto Kerusakan 4"
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
            titleTemplate: `${this.title} | %s`,
        }
    },
    created() {
        this.getDataTransaction()
    },
    methods: {
        datepickerContextHandler(ctx) {
            if(ctx.selectedDate) {
                const [year, month, day] = ctx.selectedYMD.split('-');
                this.model.date = `${day}/${month}/${year}`;
            }
        },
        timepickerContextHandler(ctx) {
            if(ctx.value) {
                const [hours, minutes] = ctx.value.split(':');
                this.model.time = `${hours}:${minutes}`;
            }
        },
        onFileChange(e) {
            const file = e.target.files[0];

            this.documentImages[e.target.id] = URL.createObjectURL(file);
        },
        async getDataTransaction() {
            await this.$axios.$get(`api/transaction/${this.$route.query.id}/detail`)
                .then((response) => {
                    this.model.policyReporter = response.data.client_name !== null ?
                        response.data.client_name : response.data.agent_name

                    this.model.policyHolder = response.data.client_data.fullname
                })
        },
        postClaim() {
            const self = this
            const formData = new FormData()

            formData.append('transaction_id', this.id)
            formData.append('reporter_fullname', this.model.policyReporter)
            formData.append('holder_fullname', this.model.policyHolder)
            formData.append('plate_number', this.model.plateNumber)
            formData.append('incident_time', this.model.date + ' ' + this.model.time)
            formData.append('location', this.model.place)
            formData.append('chronology', this.model.chronology)

            formData.append('identity_card', this.model.identity_card)
            formData.append('sim', this.model.sim)
            formData.append('stnk', this.model.stnk)
            formData.append('damage1', this.model.damage1)

            if (this.model.document_optional !== undefined) {
                formData.append('document_optional', this.model.document_optional)
            }

            if (this.model.damage2 !== undefined) {
                formData.append('damage2', this.model.damage2)
            }

            if (this.model.damage3 !== undefined) {
                formData.append('damage3', this.model.damage3)
            }

            if (this.model.damage4 !== undefined) {
                formData.append('damage4', this.model.damage4)
            }

            this.$axios.$post(`api/claim`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(function (response) {
                    self.$router.push({
                        name: "daftar-klaim",
                    })
                })
        },
    }
}
</script>
