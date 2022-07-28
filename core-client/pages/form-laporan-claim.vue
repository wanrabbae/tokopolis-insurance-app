<template>
    <div class="py-4 py-lg-5" style="background-color: #f6f5fc">
        
        <div class="container">
            
            <div class="card border">
                
                <div class="card-header border-bottom">
                    
                    <h2 class="mb-0">Form Laporan Claim</h2>
                
                </div> <!-- card-header ends -->
            
                <b-form class="card-body" @submit.prevent="submitHandler">
                    
                    <div class="row">

                        <div class="col-12 col-lg-6 mb-4">
                            
                            <div class="p-0 p-lg-3 rounded border-0 border-lg">
                                
                                <BaseInput
                                    v-model="model.policyHolder"
                                    name="Nama Pemegang Polis"
                                    label="Nama Pemegang Polis"
                                    placeholder="Nama Pemegang Polis"
                                    :rules="{ required: true }"
                                    required
                                />

                                <BaseInput
                                    v-model="model.piqoId"
                                    name="ID Transaksi PIQO"
                                    label="ID Transaksi PIQO"
                                    placeholder="ID Transaksi PIQO"
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

                                        <div class="col-8">

                                            <b-input-group class="addon-combined">

                                                <input
                                                    v-model="model.date"
                                                    placeholder="DD/MM/YYYY"
                                                    class="form-control"
                                                    required
                                                >

                                                <b-input-group-append>
                                                    
                                                    <b-form-datepicker
                                                        locale="id"
                                                        v-bind="calendarLabels"
                                                        nav-button-variant="primary"
                                                        hide-header
                                                        button-only
                                                        right
                                                        @context="datepickerContextHandler"
                                                    >
                                                        <template #button-content>
                                                            <CalendarIcon style="color:#5144c7; width: 1.2rem" />
                                                        </template>
                                                    </b-form-datepicker>

                                                </b-input-group-append>

                                            </b-input-group>

                                        </div> <!-- col ends -->

                                        <div class="col-4">

                                            <b-input-group class="addon-combined">

                                                <input
                                                    v-model="model.time"
                                                    placeholder="00:00"
                                                    class="form-control"
                                                    required
                                                >

                                                <b-input-group-append>
                                                
                                                    <b-form-timepicker 
                                                        class="custom-timepicker"
                                                        locale="ID"
                                                        hide-header
                                                        no-close-button
                                                        button-only
                                                        @context="timepickerContextHandler"
                                                    >
                                                        <template #button-content>
                                                            <fa icon="clock" style="color:#5144c7;"/>
                                                        </template>
                                                    </b-form-timepicker>

                                                </b-input-group-append>

                                            </b-input-group>
                                            
                                        </div> <!-- col ends -->

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
                        
                        <div class="col-12 col-lg-6 mb-4">

                            <div class="p-0 p-lg-3 rounded border-0 border-lg mb-4">
                                
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

                            <b-form-checkbox required>
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
import CalendarIcon from '../assets/svg/calendar.svg'

export default {
    components: {
        BaseInput,
        BaseTextarea,
        CalendarIcon
    },
    data() {
        return {
            model: {
                policyHolder: null,
                piqoId: null,
                policyNumber: null,
                date: null,
                time: null,
                place: null,
                chronology: null
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
                    label: "Dokumen Lain"
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
            title: 'Form Laporan Claim - Pico Insurtech',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Deskripsi Halaman'
                }
            ]
        };
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
            console.log(e.target.id)
            const file = e.target.files[0];
            this.documentImages[e.target.id] = URL.createObjectURL(file);
            console.log(this.documentImages[e] )
        },
    }
}
</script>