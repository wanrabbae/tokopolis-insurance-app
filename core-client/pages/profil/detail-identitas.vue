<template>

    <div id="identity-details">

        <validation-observer v-slot="observer" tag="div" class="card-body">

            <h2>Detail Identitas</h2>

            <b-form method="post" @submit.prevent="observer.handleSubmit(onSubmit)">

                <div class="row">

                    <BaseSelect
                        v-model="model.identityType"
                        name="Jenis Identitas"
                        label="Jenis Identitas"
                        :options="[
                            { text: 'Pilih Jenis Identitas', value: null, disabled:model.verified },
                            { text: 'KTP', value: 'ktp', disabled:model.verified },
                            { text: 'Paspor', value: 'passport', disabled:model.verified },
                            { text: 'NPWP', value: 'npwp', disabled:model.verified }
                        ]"
                        class="col-12 col-lg-6"
                        rules="required"
                        required
                        @change="onIdentityTypeChange"
                    />

                    <b-form-group class="col-12 col-lg-6 mb-3">

                        <validation-provider
                            v-slot="{ errors, invalid, validated }"
                            name="Nomor Identitas"
                            :rules="{ required: true, regex: identityNumberRegex}"
                        >

                            <label class="form-control-label">Nomor Identitas</label>

                            <input
                                ref="identityNumber"
                                v-model="model.identityNumber"
                                type="text"
                                :maxlength="identityNumberMaxLength"
                                class="form-control"
                                :class="{'is-invalid': invalid && validated}"
                                :readonly="model.verified"
                                @input="onIdentityNumberInput"
                            />

                            <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
                                {{ errors[0] }}
                            </div>

                        </validation-provider>

                    </b-form-group>

                </div> <!-- row ends -->

                <validation-provider
                    v-slot="{ errors, validate }"
                    tag="fieldset"
                    name="Foto Identitas"
                    rules="required|image"
                    class="form-group w-lg-50"
                >

                    <label class="form-control-label">Foto Identitas</label>

                    <div class="uploader" :class="{'pointer': !model.verified}" @click="() => {if(model.verified) return; toggleShowCropper();}">

                        <input
                            id="identity-image"
                            type="file"
                            accept="image/*"
                            class="d-none"
                            required
                            @change="(e) => onFileChange(e, validate)"
                        />

                        <b-img v-if="model.imgDataUrl" class="uploader-bg" :src="model.imgDataUrl" />

                        <IDCardBackground v-else class="uploader-bg" />

                        <label
                            v-if="!model.verified"
                            for="identity-image"
                            class="upload-icon-container"
                        >

                            <div class="upload-icon">

                                <UploadIcon />

                            </div>

                        </label>

                    </div>

                    <div v-if="errors[0]" class="d-block invalid-feedback">
                        {{ errors[0] }}
                    </div>

                    <div v-if="model.verified" class="mt-2" style="color:#37e65f">

                        <span class="mr-1"><fa icon="circle-check" style="width: 16px; height: 16px;"/></span>

                        <span class="fw-bold">Terverifikasi</span>

                    </div>

                    <div v-else class="mt-2" style="color:#d42f2f">

                        <span class="mr-1"><fa icon="circle-xmark" style="width: 16px; height: 16px;"/></span>

                        <span class="fw-bold">Belum Terverifikasi</span>

                    </div>

                </validation-provider>

                <BaseButton
                    v-if="!model.verified"
                    native-type="submit"
                    classes="w-100 w-lg-auto"
                    :disabled="observer.invalid"
                >
                    Update
                </BaseButton>

            </b-form>

        </validation-observer> <!-- card-body ends -->

        <Loading :show="loading"/>

    </div>

</template>

<script>
// import cookie from 'js-cookie'
import BaseSelect from '../../components/Inputs/BaseSelect'
import IDCardBackground from '../../assets/svg/id-card.svg'
import UploadIcon from '../../assets/svg/upload.svg'

export default {
    components: {
        BaseSelect,
        IDCardBackground,
        UploadIcon
    },
    layout: 'userarea',
    data() {
        return {
            title: 'Detail Identitas',
            model: {
                identityType : null,
                identityNumber : null,
                identityImage: null,
                verified: false,
                imgDataUrl: null,
                showCropper: false
            },
            loading : true,
            initIdentityNumberLength: 0,
            vueCropImageLangExt: {
                id: {
                    hint: 'Klik atau seret gambar di sini untuk mengunggah',
                    loading: 'Mengunggah…',
                    noSupported: 'Browser tidak mendukung, gunakan IE10+ atau browser yang lainnya',
                    success: 'Berhasil mengunggah',
                    fail: 'Gagal mengunggah',
                    preview: 'Pratinjau',
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
            titleTemplate: `${this.title} | %s`,
        }
    },
    computed: {
        identityNumberRegex() {
            if(this.model.identityType === "ktp") {
                return /^(1[1-9]|21|[37][1-6]|5[1-3]|6[1-5]|[89][12])\d{2}\d{2}([04][1-9]|[1256][0-9]|[37][01])(0[1-9]|1[0-2])\d{2}\d{4}$/;
            } else if(this.model.identityType === "passport") {
                return /^(?!^0+$)[a-zA-Z0-9]{6,9}$/;
            } else if(this.model.identityType === "npwp") {
                return /^[0][1-9][.]([\d]{3})[.]([\d]{3})[.][\d][-]([\d]{3})[.]([\d]{3})$/;
            }
            return null;
        },
        identityNumberMaxLength() {
            if(this.model.identityType === "ktp") {
                return 16;
            } else if(this.model.identityType === "passport") {
                return 9;
            } else if(this.model.identityType === "npwp") {
                return 20;
            }
            return null;
        }
    },
    mounted(){
        this.getDataIdentity()
    },
    methods: {
        async getDataIdentity() {
            await this.$axios.$get('api/user/identity')
                .then ((response) => {
                    if (response.data != null) {
                        this.model.identityType = response.data.type
                        this.model.identityNumber = response.data.identity_number
                        if (response.data.image !== '') {
                            this.model.imgDataUrl = this.$config.baseAPI + response.data.image
                        }
                        this.model.verified = response.data.is_verified
                    }
                    this.loading = false
                })

        },
        toggleShowCropper() {
            this.model.showCropper = !this.model.showCropper;
        },
        onIdentityTypeChange() {
            this.model.identityNumber = null;
            this.initIdentityNumberLength = 0;
        },
        onIdentityNumberInput() {
            if(this.model.identityType === "ktp") {
                // hapus semua nilai non digit
                this.model.identityNumber = this.model.identityNumber.replace(/[^\d]/g, "");
            } else if(this.model.identityType === "passport") {
                // ubah huruf kecil menjadi huruf besar
                this.model.identityNumber = this.model.identityNumber.toUpperCase();
            } else if(this.model.identityType === "npwp") {
                // cari posisi caret dari input text
                const input = this.$refs.identityNumber;
                const caretPos = input.selectionStart;
                const endPos = this.model.identityNumber.length;
                const isDeleting = this.model.identityNumber.length < this.initIdentityNumberLength;

                // hapus semua nilai non digit
                const number = this.model.identityNumber.replace(/[^\d]/g, "");

                // ubah nilai digit ke format npwp
                const numberLength = number.length;
                if(numberLength <= 2) {
                    this.model.identityNumber = number;
                } else if(numberLength <= 5) {
                    this.model.identityNumber = `${number.slice(0, 2)}.${number.slice(2, numberLength)}`;
                } else if(numberLength <= 8) {
                    this.model.identityNumber = `${number.slice(0, 2)}.${number.slice(2, 5)}.${number.slice(5, numberLength)}`;
                } else if(numberLength <= 9) {
                    this.model.identityNumber = `${number.slice(0, 2)}.${number.slice(2, 5)}.${number.slice(5, 8)}.${number.charAt(numberLength - 1)}`;
                } else if(numberLength <= 12) {
                    this.model.identityNumber = `${number.slice(0, 2)}.${number.slice(2, 5)}.${number.slice(5, 8)}.${number.charAt(8)}-${number.slice(9, numberLength)}`;
                } else {
                    this.model.identityNumber = `${number.slice(0, 2)}.${number.slice(2, 5)}.${number.slice(5, 8)}.${number.charAt(8)}-${number.slice(9, 12)}.${number.slice(12, numberLength)}`;
                }

                // menentukan posisi caret
                if(caretPos !== endPos) {
                    let nextCaretPos = caretPos;
                    if(this.model.identityNumber.charAt(nextCaretPos - 1) === '.' || this.model.identityNumber.charAt(nextCaretPos - 1) === '-') {
                        nextCaretPos = isDeleting ? nextCaretPos-- : nextCaretPos++;
                    }

                    // fokuskan posisi caret
                    setTimeout(function(){
                        input.selectionStart = nextCaretPos;
                        input.selectionEnd = nextCaretPos;
                        input.focus();
                    }, 10);
                }

                this.initIdentityNumberLength = this.model.identityNumber.length;
            }
        },
        async onFileChange({ target: { files } }, validate) {
            if(!files[0]) return;

            const valid = await validate(files[0]);

            if(valid) {
                this.model.imgDataUrl = URL.createObjectURL(files[0])
                this.model.identityImage = files[0]
            }
        },
        onSubmit() {
            const formData = new FormData();

            formData.append('identity_number', this.model.identityNumber)

            if (this.model.imgDataUrl) {
                formData.append('image', this.model.identityImage, this.model.identityImage.name)
            }
            formData.append('type', this.model.identityType)

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
