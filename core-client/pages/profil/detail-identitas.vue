<template>
    
    <div>
        
        <div class="card-body">

            <h2>Detail Identitas</h2>
            
            <b-form method="post" @submit.prevent="submitFile">
                
                <div class="row">
                    
                    <BaseSelect
                        v-model="type"
                        name="Jenis Identitas"
                        label="Jenis Identitas"
                        :options="types"
                        :rules="{ required: true }"
                        class="col-12 col-lg-6"
                        required
                        @change="onIdentityTypeChange"
                    />

                    <b-form-group class="col-12 col-lg-6 mb-3">
                        
                        <ValidationProvider 
                            v-slot="{ errors, invalid, validated }"
                            name="Nomor Identitas"
                            :rules="{ required: true, regex: identityNumberRegex}"
                        >
                                
                            <label class="form-control-label">Nomor Identitas</label>

                            <input
                                ref="identityNumber"
                                v-model="number"
                                type="text"
                                :maxlength="identityNumberMaxLength"
                                class="form-control"
                                :class="{'is-invalid': invalid && validated}"
                                @input="onIdentityNumberInput"
                            />

                            <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
                                {{ errors[0] }}
                            </div>

                        </ValidationProvider>
                    
                    </b-form-group>
                
                </div> <!-- row ends -->

                <div class="row">

                    <BaseInput 
                        class="col-12 col-lg-6 mb-3"
                        label="Foto Identitas"
                    >

                        <template #default>
                            
                            <div class="position-relative" style="width: 220px; height: 140px">
                                
                                <client-only>
                                    
                                    <my-upload v-model="show"
                                        no-square
                                        field="img"
                                        :width="220"
                                        :height="140"
                                        ki="0"
                                        img-format="png"
                                        :lang-ext="vueCropImageLangExt.id"
                                        class="custom-image-crop-upload"
                                        @crop-success="cropSuccess"></my-upload>
                                
                                    <label 
                                        for="identity-image" 
                                        data-browse="Browse" 
                                        class="identity-file-label"
                                    >
                                        
                                        <!-- Identity Image -->    
                                        <img 
                                            v-if="upload"
                                            :src="image"
                                            class="identity-image"
                                        >
                                        
                                        <img
                                            v-else
                                            :src="imgDataUrl"
                                            class="identity-image"
                                        >
                                        
                                        <!-- Identity Upload Container -->
                                        <div v-if="!verified" class="identity-upload-container">
                                            
                                            <img src="../../static/svg/upload.svg" alt="Identity Upload Icon" @click="toggleShow">
                                        
                                        </div>

                                    </label>

                                </client-only>

                            </div>

                            <div v-if="verified" class="mt-2" style="color:#37e65f">
                               
                               <span class="mr-2"><fa icon="check-circle"/></span>
                               
                               <span class="fw-bold">Terverifikasi</span>
                            
                            </div>

                            <div v-else class="mt-2" style="color:#d42f2f">
                                
                                <span class="mr-2"><fa icon="times-circle"/></span>
                                
                                <span class="fw-bold">Belum Terverifikasi</span>
                            
                            </div>

                        </template>

                    </BaseInput>

                </div> <!-- row ends -->

                <BaseButton v-if="!verified" native-type="submit" classes="w-100 w-lg-auto">
                    
                    Update
                
                </BaseButton>
                
            </b-form>
            
        </div> <!-- card-body ends -->

        <Loading :show="loading"/>
    
    </div>

</template>

<script>
// import cookie from 'js-cookie'
import myUpload from 'vue-image-crop-upload/upload-2.vue'
import {  ValidationProvider } from 'vee-validate'
import BaseInput from '../../components/Inputs/BaseInput'
import BaseSelect from '../../components/Inputs/BaseSelect'

export default {
    components: {
        BaseInput,
        BaseSelect,
        'my-upload': myUpload,
        ValidationProvider
    },
    layout: 'userarea',
    data() {
        return {
            upload:true,
            type : null,
            number : '',
            image : '',
            verified: false,
            imgDataUrl: '',
            show:false,
            loading : true,
            types: [
                { text: 'Pilih Jenis Identitas', value: null }, 
                { text: 'KTP', value: 'ktp' },
                { text: 'Paspor', value: 'passport' },
                { text: 'NPWP', value: 'npwp' } 
            ],
            initIdentityNumberLength: 0,
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
            title: 'Detail Identitas - Pico Insurtech',
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
        identityNumberRegex() {
            if(this.type === "ktp") {
                return /^(1[1-9]|21|[37][1-6]|5[1-3]|6[1-5]|[89][12])\d{2}\d{2}([04][1-9]|[1256][0-9]|[37][01])(0[1-9]|1[0-2])\d{2}\d{4}$/;
            } else if(this.type === "passport") {
                return /^(?!^0+$)[a-zA-Z0-9]{6,9}$/;
            } else if(this.type === "npwp") {
                return /^[0][1-9][.]([\d]{3})[.]([\d]{3})[.][\d][-]([\d]{3})[.]([\d]{3})$/;
            }
            return null;
        },
        identityNumberMaxLength() {
            if(this.type === "ktp") {
                return 16;
            } else if(this.type === "passport") {
                return 9;
            } else if(this.type === "npwp") {
                return 20;
            }
            return null;
        }
    },
    mounted(){
        this.getDataIdentity()
    },
    methods: {
        createObjectURL(file) {
            return URL.createObjectURL(file);
        },
        toggleShow() {
				this.show = !this.show;
			},
        cropSuccess(imgDataUrl){
            this.upload = false
            fetch(imgDataUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob],new Date().toISOString()+'.jpg',{ type: "image/jpg" })
                this.image = file
            })
            this.imgDataUrl = imgDataUrl

        },
        async getDataIdentity() {
            await this.$axios.$get('api/user/identity')
                .then ((response) => {
                    if (response.data != null) {
                        this.number = response.data.identity_number
                        this.verified = response.data.is_verified

                        
                        if (response.data.image !== '') {
                            this.image = this.$config.baseAPI + response.data.image
                        }
                        else {
                            this.image = '/svg/upload-bg.svg'
                        }
                        this.type = response.data.type

                    }else{
                        this.image = '/svg/upload-bg.svg'
                    }
                    this.loading = false
                })
                
        },
        onIdentityTypeChange() {
            this.number = null;
            this.initIdentityNumberLength = 0;
        },
        onIdentityNumberInput() {
            if(this.type === "ktp") {
                // hapus semua nilai non digit
                this.number = this.number.replace(/[^\d]/g, "");
            } else if(this.type === "passport") {
                // ubah huruf kecil menjadi huruf besar
                this.number = this.number.toUpperCase();
            } else if(this.type === "npwp") {
                // cari posisi caret dari input text
                const input = this.$refs.identityNumber;
                const caretPos = input.selectionStart;
                const endPos = this.number.length;
                const isDeleting = this.number.length < this.initIdentityNumberLength;

                // hapus semua nilai non digit
                const number = this.number.replace(/[^\d]/g, "");

                // ubah nilai digit ke format npwp
                const numberLength = number.length;
                if(numberLength <= 2) {
                    this.number = number;
                } else if(numberLength <= 5) {
                    this.number = `${number.slice(0, 2)}.${number.slice(2, numberLength)}`;
                } else if(numberLength <= 8) {
                    this.number = `${number.slice(0, 2)}.${number.slice(2, 5)}.${number.slice(5, numberLength)}`;
                } else if(numberLength <= 9) {
                    this.number = `${number.slice(0, 2)}.${number.slice(2, 5)}.${number.slice(5, 8)}.${number.charAt(numberLength - 1)}`;
                } else if(numberLength <= 12) {
                    this.number = `${number.slice(0, 2)}.${number.slice(2, 5)}.${number.slice(5, 8)}.${number.charAt(8)}-${number.slice(9, numberLength)}`;
                } else {
                    this.number = `${number.slice(0, 2)}.${number.slice(2, 5)}.${number.slice(5, 8)}.${number.charAt(8)}-${number.slice(9, 12)}.${number.slice(12, numberLength)}`;
                }

                // menentukan posisi caret
                if(caretPos !== endPos) {
                    let nextCaretPos = caretPos;
                    if(this.number.charAt(nextCaretPos - 1) === '.' || this.number.charAt(nextCaretPos - 1) === '-') {
                        nextCaretPos = isDeleting ? nextCaretPos-- : nextCaretPos++;
                    }

                    // fokuskan posisi caret
                    setTimeout(function(){
                        input.selectionStart = nextCaretPos;
                        input.selectionEnd = nextCaretPos;
                        input.focus();
                    }, 10);
                }

                this.initIdentityNumberLength = this.number.length;
            }
        },
        submitFile() {
            const formData = new FormData();

            formData.append('identity_number', this.number)
            

            if (this.imgDataUrl !== '') {
                formData.append('image', this.image,this.image.name)
            }
            formData.append('type', this.type)
            


            this.$axios.$post('api/user/identity', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(function(response) {
                window.location.reload(true)
            })
        },
    }
}
</script>