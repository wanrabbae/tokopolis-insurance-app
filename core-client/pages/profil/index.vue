<template>
    
    <div>
        
        <div class="card-body">

            <h2>Profil</h2>
            
            <div class="row flex-column-reverse flex-lg-row">
                
                <div class="col-12 col-lg-8">
                    
                    <b-form role="profile" method="post" @submit.prevent="submitFile">
                        
                        <BaseInput
                            v-model="email"
                            name="Email"
                            label="Email"
                            placeholder="Masukkan Email"
                            :rules="{required: true, email: true}"
                            required
                        />

                        <BaseInput
                            v-model="fullname"
                            name="Nama Lengkap"
                            label="Nama Lengkap"
                            placeholder="Masukkan Nama Lengkap"
                            :rules="{required: true}"
                            required
                        >
                        </BaseInput>

                        <BaseSelect
                            v-model="gender"
                            name="Jenis Kelamin"
                            label="Jenis Kelamin"
                            :options="genders"
                            :rules="{ required: true }"
                            required
                        />

                        <ValidationObserver v-slot="{ errors }">
                            
                            <b-form-group>
                                
                                <label class="form-control-label">Tanggal Lahir</label>
                                    
                                <b-input-group>
                                    
                                    <validation-provider 
                                        v-slot="{ invalid, validated }"
                                        name="Tanggal Lahir" 
                                        class="col-3 p-0"
                                        :rules="{ required: true }"
                                    >
                                        <input 
                                            v-model="birthday"
                                            type="number"
                                            placeholder="DD"
                                            min="1"
                                            :max="maxDay"
                                            step="1"
                                            class="form-control"
                                            :class="{'is-invalid': invalid && validated}"
                                            style="border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important"
                                            @input="onBirthdayAndMonthInput"
                                        >
                                    </validation-provider>

                                    <validation-provider 
                                        v-slot="{ invalid, validated }"
                                        name="Bulan Lahir" 
                                        class="col-6 p-0"
                                        :rules="{ required: true }"
                                    >
                                        <b-form-select
                                            v-model="birthmonth"
                                            label-field="Bulan"
                                            :options="months"
                                            class="rounded-0"
                                            :class="{'is-invalid': invalid && validated}"
                                            @input="onBirthdayAndMonthInput"
                                        />
                                    </validation-provider>

                                    <validation-provider
                                        v-slot="{ invalid, validated }"
                                        name="Tahun Lahir" 
                                        class="col-3 p-0"
                                        :rules="{ required: true  }"
                                    >
                                        <input
                                            v-model="birthyear"
                                            type="number"
                                            name="birthyear"
                                            min="1"
                                            :max="maxYear"
                                            step="1"
                                            placeholder="YYYY"
                                            class="form-control"
                                            :class="{'is-invalid': invalid && validated}"
                                            style="border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important"
                                            @input="onBirthyearInput"
                                        >
                                    </validation-provider>

                                </b-input-group>  

                                <div v-if="errors != null" class="invalid-feedback" style="display: block;">
                                    
                                    <ul style="padding-left: 16px">
                                        
                                        <div v-for="(error, index) in errors" :key="index">
                                            
                                            <li v-if="error[0]">
                                                
                                                <span>{{ error[0] }}</span>
                                            
                                            </li>
                                        
                                        </div>

                                    </ul>

                                </div>

                            </b-form-group>

                        </ValidationObserver>

                        <BaseInput
                            v-model="phone"
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
                            v-model="province"
                            name="Provinsi"
                            label="Provinsi"
                            placeholder="Masukkan Provinsi"
                            :rules="{ required: true }"
                            required
                        />
                        
                        <BaseInput
                            v-model="city"
                            name="Kota"
                            placeholder="Masukkan Kota"
                            label="Kota"
                            :rules="{required: true}"
                            required
                        />

                        <BaseTextarea 
                            v-model="address"
                            label="Alamat Lengkap"
                            name="Alamat Lengkap"
                            placeholder="Masukkan Alamat Lengkap"
                            :rules="{ required: true }"
                            rows="4"
                            required
                        />

                        <BaseButton native-type="submit" classes="w-100 w-lg-auto">Update</BaseButton>
                    
                    </b-form>

                </div> <!-- col-12.col-lg-8 ends -->
                
                <div class="col-12 col-lg-4 mb-3 mb-lg-5 text-center">
                    
                    <client-only>
                        
                        <b-img v-if="upload" :src="photo" class="rounded-circle mb-4" alt="Profile Picture" style="width: 120px !important; height: 120px !important" />
                        
                        <b-img v-else :src="imgDataUrl" class="rounded-circle mb-4" alt="Profile Picture" style="width: 120px !important; height: 120px !important" />
                        
                        <BaseButton block @click="toggleShow">Pilih Gambar</BaseButton>
                        
                        <my-upload 
                            v-model="show"
                            no-square
                            no-circle
                            field="img"
                            :width="300"
                            :height="300"
                            ki="0"
                            img-format="png"
                            :lang-ext="vueCropImageLangExt.id"
                            class="custom-image-crop-upload"
                            @crop-success="cropSuccess"
                        />
                    
                    </client-only>
                
                </div> <!-- col-12.col-4 ends -->
            
            </div> <!-- row ends -->
        
        </div> <!-- card-body ends -->
        
        <Loading :show="loading"/>
    
    </div>

</template>

<script>
import cookie from 'js-cookie'
import myUpload from 'vue-image-crop-upload/upload-2.vue'
import Loading from '../../components/Loading'
import BaseInput from '../../components/Inputs/BaseInput'
import BaseSelect from '../../components/Inputs/BaseSelect'
import BaseTextarea from '../../components/Inputs/BaseTextarea'


export default {
    components: {
        BaseInput,
        BaseSelect,
        BaseTextarea,
        Loading,
        'my-upload': myUpload
    },
    layout: 'userarea',
    data () {
        return {
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
            photo : null,
            formData: null,
            loading: true,
            genders: [
                { text: 'Pilih Jenis Kelamin', value: null },
                { text: 'Pria', value: 'male' },
                { text: 'Wanita', value: 'female' },
            ],
            months: [
                { text: 'Pilih Bulan', value: null },
                { text: 'Januari', value: "01" },
                { text: 'Februari', value: "02" },
                { text: 'Maret', value: "03" },
                { text: 'April', value: "04" },
                { text: 'Mei', value: "05" },
                { text: 'Juni', value: "06" },
                { text: 'Juli', value: "07" },
                { text: 'Agustus', value: "08" },
                { text: 'September', value: "09" },
                { text: 'Oktober', value: "10" },
                { text: 'November', value: "11" },
                { text: 'Desember', value: "12" },
            ],
            vueCropImageLangExt: {
                id: {
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
                        onlyImg: 'Hanya gambar',
                        outOfSize: 'Batas ukuran gambar: ',
                        lowestPx: 'Ukuran gambar terlalu rendah. Setidaknya dibutuhkan: '
                    }
                }
            }
        }
    },
    head() {
        return {
            title: 'Profil - Pico Insurtech',
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
        maxDay() {
            const selectedMonth = parseInt(this.birthmonth);

            if(selectedMonth < 8) {
                if(selectedMonth === 2) {
                    // cek tahun kabisat
                    if (this.isLeapYear) {
                        return 29;
                    } else {
                        return 28;
                    }

                } else if(selectedMonth % 2 === 0) {
                    return 30;
                } else {
                    return 31;
                }
            } else if(selectedMonth >= 8) {
                if(selectedMonth % 2 === 0) {
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
    },
    mounted(){
        this.getDataProfil()
    },
    methods: {
        toggleShow() {
				this.show = !this.show;
			},
        cropSuccess(imgDataUrl){
            console.log('-------- crop success --------')
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
                            const birthDate = response.data.profile.birth_date;
                            const splitdate = birthDate.split('-')

                            this.birthday = splitdate[2]
                            this.birthmonth = splitdate[1]
                            this.birthyear = splitdate[0]
                        }

                        this.phone = response.data.profile.phone
                        this.city = response.data.profile.city
                        this.province = response.data.profile.province
                        this.address = response.data.profile.address

                        if (response.data.profile.photo != null) {
                            this.photo = this.$config.baseAPI+ response.data.profile.photo
                            console.log(this.photo)
                        }
                        else {
                            this.photo = '/img/DefaultProfile.png'
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
            this.checkFieldValue('birth_date',this.birthyear + "-" + this.birthmonth + "-" + this.birthday)
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
        onBirthdayAndMonthInput() {
            this.birthday = this.limitValue(this.birthday, 0, this.maxDay);
        },
        onBirthyearInput() {
            this.birthyear = this.limitValue(this.birthyear, 0, this.maxYear);
            this.birthday = this.limitValue(this.birthday, 0, this.maxDay);
        },
        limitValue(value, min, max) {
            if(value < min) {
                return min;
            } else if(value > max) {
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

    }
}
</script>