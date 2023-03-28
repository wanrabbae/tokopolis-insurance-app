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
                            v-model="user.email"
                            name="Email"
                            label="Email"
                            placeholder="Masukkan Email"
                            rules="required|email"
                            required
                        />

                        <BaseInput
                            v-model="user.fullname"
                            name="Nama Lengkap"
                            label="Nama Lengkap"
                            placeholder="Masukkan Nama Lengkap"
                            rules="required"
                            required
                        >
                        </BaseInput>

                        <BaseSelect
                            v-model="user.gender"
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
                                        v-model="user.birthday"
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
                                    :rules="{ required_if: user.birthday >= 1 && user.birthday <= maxDay || user.birthyear >= 1970 && user.birthyear <= maxYear }"
                                >

                                    <b-form-select
                                        v-model="user.birthmonth"
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
                                        v-model="user.birthyear"
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
                            v-model="user.phone"
                            prefix-text="62"
                            type="number"
                            name="Nomor Telepon"
                            label="Nomor Telepon"
                            placeholder="81XXXXXXXXX"
                            input-classes="custom-number"
                            onkeypress="if(value.length==14) return false;"
                        />

                        <BaseInput
                            v-model="user.province"
                            name="Provinsi"
                            label="Provinsi"
                            placeholder="Masukkan Provinsi"
                        />

                        <BaseInput
                            v-model="user.city"
                            name="Kota"
                            placeholder="Masukkan Kota"
                            label="Kota"
                        />

                        <BaseTextarea
                            v-model="user.address"
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
                        :src="user.photo"
                        alt="Profile Picture"
                        class="rounded-circle mb-4"
                        @click="photoClicked"
                    />

                    <nuxt-img
                        v-else
                        width="120"
                        height="120"
                        :src="user.imgDataUrl"
                        alt="Profile Picture"
                        class="rounded-circle mb-4"
                        @click="photoClicked"
                    />

                    <BaseButton @click="toggleShow">Pilih Gambar</BaseButton>
                    <BaseButton v-if="upgradeUnlocked && user.role == null && upgrade == null" class="mt-2 btn-secondary"
                        @click="showUpgrade">Upgrade Role</BaseButton>

                    <div v-if="upgrade != null" class="text-secondary mt-3">
                        <span class="mr-1"><fa class="loop" icon="spinner" style="width: 16px; height: 16px;"/></span>
                        <span class="fw-bold">Proses Verifikasi</span>
                    </div>

                    <div v-if="user.role != null" v-b-tooltip.click.blur.bottom.v-dark="tooltip.message"
                        class="text-secondary clickable mt-3"
                        @click="copyToClipboard(user.unique_id)">
                        <span class="mr-1"><fa icon="award" style="width: 16px; height: 16px;"/></span>
                        <span class="fw-bold">{{ user.role }}</span>
                    </div>

                </div> <!-- col-12.col-4 ends -->

            </div> <!-- row ends -->

        </div> <!-- card-body ends -->

        <Loading :show="loading"/>

        <client-only>

            <my-upload
                v-model="user.show"
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
            user: {
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
                role: null,
                unique_id: null,
            },
            formData: null,
            loading: true,
            clickCount: 0,
            upgrade: null,
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
            },
            tooltip: {
                success: false,
                message: null
            },
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    computed: {
        maxDay() {
            const selectedMonth = parseInt(this.user.birthmonth);

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
            const selectedYear = this.user.birthyear;
            return ((selectedYear % 4 === 0) && (selectedYear % 100 !== 0)) || (selectedYear % 400 === 0);
        },
        upgradeUnlocked() {
            return this.clickCount >= 7
        }
    },
    mounted(){
        this.getDataProfil()

        if (this.user.role == null) {
            this.getUpgrade()
        }
    },
    methods: {
        toggleShow() {
				this.user.show = !this.user.show;
			},
        cropSuccess(imgDataUrl){
            this.upload = false

            fetch(imgDataUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], this.user.fullname+' '+new Date().toISOString()+'.jpg',{ type: "image/jpg" })
                    this.user.photo = file
                })

            this.user.imgDataUrl = imgDataUrl
        },
        async getDataProfil() {
            await this.$axios.$get('api/user')
                .then ((response) => {
                    if (response) {
                        this.user.email = response.data.email
                        this.user.fullname = response.data.fullname
                        this.user.gender = response.data.profile.gender

                        if (response.data.profile.birth_date != null) {
                            const birthdate = this.$dayjs(response.data.profile.birth_date)
                            this.user.birthday = birthdate.get('date')
                            this.user.birthmonth =  birthdate.get('month')
                            this.user.birthyear =  birthdate.get('year')
                        }

                        this.user.phone = response.data.profile.phone.replace('+62', '')
                        this.user.city = response.data.profile.city
                        this.user.province = response.data.profile.province
                        this.user.address = response.data.profile.address

                        if (response.data.profile.photo != null) {
                            this.user.photo = this.$config.serverURL+ response.data.profile.photo
                        }
                        else {
                            this.user.photo = '/svg/avatar-default.svg'
                        }

                        if (response.data.roles != null) {
                            this.user.role = response.data.roles.name
                            this.user.unique_id = response.data.unique_id
                        }

                        this.loading = false
                    }
                })
        },
        async getUpgrade() {
            await this.$axios.$get('api/user/upgrade')
                .then ((response) => {
                    console.log(response)
                    this.upgrade = response.data
                })
        },
        submitFile() {
            this.formData = new FormData()

            this.user.phone  = "+62"+this.user.phone;

            this.checkFieldValue('email', this.user.email)
            this.checkFieldValue('fullname', this.user.fullname)
            this.checkFieldValue('gender',this.user.gender)

            const birthdate = this.$dayjs().date(this.user.birthday).month(this.user.birthmonth).year(this.user.birthyear)
            this.checkFieldValue('birth_date', birthdate.format('YYYY-MM-DD'))

            this.checkFieldValue('address',this.user.address)
            this.checkFieldValue('phone',this.user.phone)
            this.checkFieldValue('province',this.user.province)
            this.checkFieldValue('city',this.user.city)

            if (this.user.imgDataUrl != null) {
                this.formData.append('photo', this.user.photo,this.user.photo.name)
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
                this.user.birthday = this.limitValue(this.user.birthday, this.maxDay);
            }
        },
        onBirthmonthChange() {
            this.user.birthday = this.limitValue(this.user.birthday, this.maxDay);
        },
        onBirthyearInput(e) {
            this.user.birthday = this.limitValue(this.user.birthday, this.maxDay);

            if(e.inputType === 'insertText') {
                this.user.birthyear = this.limitValue(this.user.birthyear, this.maxYear);
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
            this.$axios.$post(`api/user/upgrade`, {
                leader_id: data.leader_id,
            })
            .then(function(response) {
                window.location.reload()
            })
        },
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);

                this.tooltip.success = true;
                this.tooltip.message = 'Berhasil menyalin kode unik';
            } catch(err) {
                this.tooltip.success = false;
                this.tooltip.message = 'Gagal menyalin: ' + err;
            }
        },
    }
}
</script>
