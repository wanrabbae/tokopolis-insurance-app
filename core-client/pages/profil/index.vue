<template>

    <div class="card border">

        <UpgradeRoleModal id="modal-upgrade" @submit="upgradeSubmitHandler"></UpgradeRoleModal>

        <div class="card-body">

            <h2>Profil</h2>

            <div class="row flex-column-reverse flex-md-row">

                <validation-observer
                    v-slot="observer"
                    tag="div"
                    class="col-12 col-md-8"
                >

                    <b-form method="post" @submit.prevent="observer.handleSubmit(submitFile)">

                        <BaseInput
                            v-model="email"
                            name="Email"
                            label="Email"
                            placeholder="Masukkan Email"
                            rules="required|email"
                            required
                        />

                        <BaseInput
                            v-model="fullname"
                            name="Nama Lengkap"
                            label="Nama Lengkap"
                            placeholder="Masukkan Nama Lengkap"
                            rules="required"
                            required
                        >
                        </BaseInput>

                        <BaseSelect
                            v-model="gender"
                            name="Jenis Kelamin"
                            label="Jenis Kelamin"
                            :options="[
                                { text: 'Pilih Jenis Kelamin', value: null },
                                { text: 'Pria', value: 'male' },
                                { text: 'Wanita', value: 'female' },
                            ]"
                        />

                        <validation-observer
                            v-slot="{ errors }"
                            tag="fieldset"
                            class="form-group"
                        >

                            <label class="form-control-label">Tanggal Lahir</label>

                            <div class="row no-gutters has-label">

                                <validation-provider
                                    v-slot="{ invalid, validated }"
                                    tag="div"
                                    name="Tanggal Lahir"
                                    class="col-3"
                                    :rules="{ integer: true }"
                                >

                                    <input
                                        v-model="birthday"
                                        type="number"
                                        placeholder="DD"
                                        min="1"
                                        :max="maxDay"
                                        class="form-control"
                                        :class="{'is-invalid': invalid && validated}"
                                        style="border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important"
                                        @input="onBirthdayInput"
                                    >

                                </validation-provider>

                                <validation-provider
                                    v-slot="{ invalid, validated }"
                                    tag="div"
                                    name="Bulan Lahir"
                                    class="col"
                                    :rules="{ required_if: birthday >= 1 && birthday <= maxDay || birthyear >= 1970 && birthyear <= maxYear }"
                                >

                                    <b-form-select
                                        v-model="birthmonth"
                                        label-field="Bulan"
                                        :options="months"
                                        class="rounded-0"
                                        :class="{ 'is-invalid' : invalid && validated }"
                                        @change="onBirthmonthChange"
                                    />

                                </validation-provider>

                                <validation-provider
                                    v-slot="{ invalid, validated }"
                                    tag="div"
                                    name="Tahun Lahir"
                                    class="col-3"
                                    :rules="{ integer: true }"
                                >

                                    <input
                                        v-model="birthyear"
                                        type="number"
                                        name="birthyear"
                                        min="1970"
                                        :max="maxYear"
                                        placeholder="YYYY"
                                        class="form-control"
                                        :class="{'is-invalid': invalid && validated}"
                                        style="border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important"
                                        @input="onBirthyearInput"
                                    >

                                </validation-provider>

                            </div>

                            <ul v-if="errors" class="d-block invalid-feedback mt-1">

                                <li v-for="(error, i) in errors" :key="i" :class="{ 'd-none' : !error[0] }">

                                    <span>{{ error[0] }}</span>

                                </li>

                            </ul>

                        </validation-observer>

                        <BaseInput
                            v-model="phone"
                            type="number"
                            name="Nomor Telepon"
                            label="Nomor Telepon"
                            placeholder="081XXXXXXXXX"
                            input-classes="custom-number"
                            onkeypress="if(value.length==14) return false;"
                        />

                        <BaseInput
                            v-model="province"
                            name="Provinsi"
                            label="Provinsi"
                            placeholder="Masukkan Provinsi"
                        />

                        <BaseInput
                            v-model="city"
                            name="Kota"
                            placeholder="Masukkan Kota"
                            label="Kota"
                        />

                        <BaseTextarea
                            v-model="address"
                            label="Alamat Lengkap"
                            name="Alamat Lengkap"
                            placeholder="Masukkan Alamat Lengkap"
                            rows="4"
                        />

                        <BaseButton
                            native-type="submit"
                            classes="w-100 w-md-auto"
                            :disabled="observer.invalid"
                        >
                            Update
                        </BaseButton>

                    </b-form>

                </validation-observer> <!-- col-12.col-md-8 ends -->

                <div class="col-12 col-md-4 d-flex flex-column align-items-center mb-3 mb-md-5">

                    <nuxt-img
                        v-if="upload"
                        width="120"
                        height="120"
                        preset="default"
                        :src="photo"
                        alt="Profile Picture"
                        class="rounded-circle mb-4"
                        @click="photoClicked"
                    />

                    <nuxt-img
                        v-else
                        width="120"
                        height="120"
                        :src="imgDataUrl"
                        alt="Profile Picture"
                        class="rounded-circle mb-4"
                        @click="photoClicked"
                    />

                    <BaseButton @click="toggleShow">Pilih Gambar</BaseButton>
                    <BaseButton v-if="upgradeUnlocked" class="mt-2 btn-secondary"
                        @click="showUpgrade">Upgrade Role</BaseButton>

                </div> <!-- col-12.col-4 ends -->

            </div> <!-- row ends -->

        </div> <!-- card-body ends -->

        <Loading :show="loading"/>

        <client-only>

            <my-upload
                v-model="show"
                no-square
                no-circle
                field="img"
                :width="300"
                :height="300"
                ki="0"
                img-format="png"
                :lang-ext="vciLocaleId"
                class="custom-image-crop-upload"
                @crop-success="cropSuccess"
            />

        </client-only>

    </div>

</template>

<script>
import cookie from 'js-cookie'
import myUpload from 'vue-image-crop-upload/upload-2.vue'
import Loading from '../../components/Loading'
import BaseInput from '../../components/Inputs/BaseInput'
import BaseSelect from '../../components/Inputs/BaseSelect'
import BaseTextarea from '../../components/Inputs/BaseTextarea'
import UpgradeRoleModal from '../../components/modals/UpgradeRoleModal'

export default {
    components: {
        BaseInput,
        BaseSelect,
        BaseTextarea,
        Loading,
        'my-upload': myUpload,
        UpgradeRoleModal
    },
    layout: 'userarea',
    data () {
        return {
            title: 'Profil',
            upload:true,
            fullname : null,
            gender: null,
            birthday: null,
            birthmonth: null,
            birthyear: null,
            email: null,
            phone: null,
            address: null,
            province: null,
            city: null,
            imgDataUrl: null,
            show:false,
            photo : '/svg/avatar-default.svg',
            formData: null,
            loading: true,
            clickCount: 0,
            months: [
                { text: 'Pilih Bulan', value: null },
                { text: 'Januari', value: "0" },
                { text: 'Februari', value: "1" },
                { text: 'Maret', value: "2" },
                { text: 'April', value: "3" },
                { text: 'Mei', value: "4" },
                { text: 'Juni', value: "5" },
                { text: 'Juli', value: "6" },
                { text: 'Agustus', value: "7" },
                { text: 'September', value: "8" },
                { text: 'Oktober', value: "9" },
                { text: 'November', value: "10" },
                { text: 'Desember', value: "11" },
            ],
            vciLocaleId: {
                hint: 'Klik atau seret gambar di sini untuk mengunggah',
                loading: 'Mengunggah…',
                noSupported: 'Browser tidak mendukung, gunakan IE10+ atau browser yang lainnya',
                success: 'Berhasil mengunggah',
                fail: 'Gagal mengunggah',
                preview: 'Pratayang',
                btn: {
                    off: 'Batal',
                    close: 'Tutup',
                    back: 'Kembali',
                    save: 'Simpan'
                },
                error: {
                    onlyImg: 'Hanya dapat mengunggah gambar',
                    outOfSize: 'Batas ukuran gambar: ',
                    lowestPx: 'Ukuran gambar terlalu rendah. Setidaknya dibutuhkan: '
                }
            }
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    computed: {
        maxDay() {
            const selectedMonth = parseInt(this.birthmonth);

            if(selectedMonth < 7) {
                if(selectedMonth === 1) {
                    // cek tahun kabisat
                    if (this.isLeapYear) {
                        return 29;
                    } else {
                        return 28;
                    }

                } else if(selectedMonth % 2 === 1) {
                    return 30;
                } else {
                    return 31;
                }
            } else if(selectedMonth >= 7) {
                if(selectedMonth % 2 === 1) {
                    return 31;
                } else {
                    return 30;
                }
            }

            return 31;
        },
        maxYear() {
            return new Date().getFullYear();
        },
        isLeapYear() {
            const selectedYear = this.birthyear;
            return ((selectedYear % 4 === 0) && (selectedYear % 100 !== 0)) || (selectedYear % 400 === 0);
        },
        upgradeUnlocked() {
            return this.clickCount >= 7
        }
    },
    mounted(){
        this.getDataProfil()
    },
    methods: {
        toggleShow() {
				this.show = !this.show;
			},
        cropSuccess(imgDataUrl){
            this.upload = false

            fetch(imgDataUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], this.fullname+' '+new Date().toISOString()+'.jpg',{ type: "image/jpg" })
                    this.photo = file
                })

            this.imgDataUrl = imgDataUrl
        },
        async getDataProfil() {
            await this.$axios.$get('api/user')
                .then ((response) => {
                    if (response) {

                        this.email = response.data.email
                        this.fullname = response.data.fullname
                        this.gender = response.data.profile.gender

                        if (response.data.profile.birth_date != null) {
                            const birthdate = this.$dayjs(response.data.profile.birth_date)
                            this.birthday = birthdate.get('date')
                            this.birthmonth =  birthdate.get('month')
                            this.birthyear =  birthdate.get('year')
                        }

                        this.phone = response.data.profile.phone
                        this.city = response.data.profile.city
                        this.province = response.data.profile.province
                        this.address = response.data.profile.address

                        if (response.data.profile.photo != null) {
                            this.photo = this.$config.serverURL+ response.data.profile.photo
                        }
                        else {
                            this.photo = '/svg/avatar-default.svg'
                        }
                        this.loading = false
                    }
                })
                .catch (error => {
                    console.log(error)
                    this.logout()
                })
        },
        submitFile() {
            this.formData = new FormData()

            this.checkFieldValue('email', this.email)
            this.checkFieldValue('fullname', this.fullname)
            this.checkFieldValue('gender',this.gender)

            const birthdate = this.$dayjs().date(this.birthday).month(this.birthmonth).year(this.birthyear)
            this.checkFieldValue('birth_date', birthdate.format('YYYY-MM-DD'))

            this.checkFieldValue('address',this.address)
            this.checkFieldValue('phone',this.phone)
            this.checkFieldValue('province',this.province)
            this.checkFieldValue('city',this.city)

            if (this.imgDataUrl != null) {
                this.formData.append('photo', this.photo,this.photo.name)
            }


            this.$axios.$post('api/user', this.formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(function(response) {
                if (response.data != null){
                    const photo = response.data.photo
                    cookie.set('photo', photo, { expires: 1 })
                }

                window.location.reload(true)
            })
        },
        onBirthdayInput(e) {
            if(e.inputType === 'insertText') {
                this.birthday = this.limitValue(this.birthday, this.maxDay);
            }
        },
        onBirthmonthChange() {
            this.birthday = this.limitValue(this.birthday, this.maxDay);
        },
        onBirthyearInput(e) {
            this.birthday = this.limitValue(this.birthday, this.maxDay);

            if(e.inputType === 'insertText') {
                this.birthyear = this.limitValue(this.birthyear, this.maxYear);
            }
        },
        limitValue(value, max) {
            if(value > max) {
                return max;
            } else {
                return value;
            }
        },
        checkFieldValue(name, value){
            if(value !== '' && value !== undefined && value != null){
                this.formData.append(name, value)
            }

        },
        photoClicked() {
            this.clickCount++
        },
        getUpgradeStatus() {

        },
        showUpgrade() {
            if (!this.upgradeUnlocked) return

            this.$bvModal.show('modal-upgrade')
        },
        upgradeSubmitHandler(data) {
            this.$axios.$post(`api/user/request-upgrade`, {
                leader_id: data.leader_id,
            })
            .then(function(response) {
                window.location.reload()
            })
        }
    }
}
</script>