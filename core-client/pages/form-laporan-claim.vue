<template>
    <div class="py-6" style="background-color: #f6f5fc">

        <div class="container">

            <div class="card border">

                <div class="card-header border-bottom">

                    <h2 class="mb-0">Form Laporan Claim</h2>

                </div> <!-- card-header ends -->

                <b-form class="card-body" @submit.prevent="submitHandler">

                    <div class="row">

                        <div class="col-12 col-md-6 mb-4">

                            <div class="p-0 p-md-3 rounded border-0 border-md">

                                <BaseInput
                                    v-model="model.policyHolder"
                                    name="Nama Pemegang Polis"
                                    label="Nama Pemegang Polis"
                                    placeholder="Nama Pemegang Polis"
                                    :rules="{ required: true }"
                                    required
                                />

                                <BaseInput
                                    v-model="model.TokopolisId"
                                    name="ID Transaksi Tokopolis"
                                    label="ID Transaksi Tokopolis"
                                    placeholder="ID Transaksi Tokopolis"
                                    :rules="{ required: true }"
                                    required
                                />

                                <BaseInput
                                    v-model="model.policyNumber"
                                    name="Nomor Polis Asuransi"
                                    label="Nomor Polis Asuransi"
                                    placeholder="Nomor Polis Asuransi"
                                    :rules="{ required: true }"
                                    required
                                />

                                <b-form-group label="Waktu Kejadian">

                                    <div class="row">

                                        <div class="col-7">

                                            <b-form-datepicker
                                                v-model="model.date"
                                                v-bind="calendarLabels"
                                                locale="id"
                                                :min="model.min"
                                                :max="$dayjs().format('YYYY-MM-DD')"
                                                :open-date="$dayjs().format('YYYY-MM-DD')"
                                                nav-button-variant="primary"
                                                :date-format-options="{ 'day': 'numeric', 'month': 'long', 'year': 'numeric' }"
                                                hide-header
                                                required
                                                right
                                            ></b-form-datepicker>

                                        </div> <!-- col ends -->

                                        <div class="col-5">
                                            <b-form-timepicker id="timepicker-placeholder" placeholder="Choose a time" locale="id"></b-form-timepicker>
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
            title: 'Form Laporan Klaim',
            model: {
                policyHolder: null,
                TokopolisId: null,
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
                    key: "id-card",
                    label: "Foto KTP",
                    required: true
                },
                {
                    key: "driver-lisence",
                    label: "Foto SIM Pengemudi",
                    required: true
                },
                {
                    key: "vehicle-registration-certificate",
                    label: "Foto STNK",
                    required: true
                },
                {
                    key: "other-document",
                    label: "Dokumen Lain (Opsional)"
                },
                {
                    key: "vehicle-damage-photo-1",
                    label: "Foto Kerusakan 1",
                    required: true
                },
                {
                    key: "vehicle-damage-photo-2",
                    label: "Foto Kerusakan 2"
                },
                {
                    key: "vehicle-damage-photo-3",
                    label: "Foto Kerusakan 3"
                },
                {
                    key: "vehicle-damage-photo-4",
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
    }
}
</script>
