<template>
  <div>
      <PageHeader :title="title" />
        <div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<h4 class="card-title">Menu {{ title }}</h4>
						<p class="card-title-desc">
							Semua field dengan tanda bintang
							merah ( <label class="text-danger">*</label> ) harus diisi
						</p>

						<div class="row">
							<div class="col-12">
								<form class="form-horizontal" role="form" v-on:submit="submitData">
									<div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Nama
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="text"
												class="form-control"
												v-model="form.name"
												placeholder="Masukkan Nama"
												required>
										</div>
									</div>

									<div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Deskripsi
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10" :class="{'is-invalid': $v.form.description.$error}">
											<CKEditor
												v-model="form.description"
												:state="validateState('description')"
												:editor="editor"/>
										</div>
									</div>

									<div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Tipe
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10">
											<select
												class="form-select"
												v-model="form.type"
												required>
												<option v-for="option in typeList" v-bind:value="option.value"
													v-bind:key="option.text">{{ option.text }}</option>
											</select>
										</div>
									</div>

									<div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Gambar
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="file"
												name="image"
												class="form-control"
												v-on:change="onFileChange"
												required/>
										</div>
									</div>

                                    <div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Email
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="text"
												class="form-control"
												v-model="form.email"
												placeholder="Masukkan Email"
												required>
										</div>
									</div>

                                    <div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Komisi (dalam satuan persen)
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="number"
												class="form-control"
												v-model="form.commission"
												placeholder="Masukkan Komisi"
												required>
										</div>
									</div>

                                    <div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Ekstra Poin (dalam satuan persen)
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="number"
												class="form-control"
												v-model="form.extra_point"
												placeholder="Masukkan Ekstra Poin"
												required>
										</div>
									</div>

                                    <div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Biaya Admin
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="number"
												class="form-control"
												v-model="form.admin_fee"
												placeholder="Masukkan Biaya Admin"
												required>
										</div>
									</div>

                                    <div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Biaya Materai
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="number"
												class="form-control"
												v-model="form.stamp_fee"
												placeholder="Masukkan Biaya Materai"
												required>
										</div>
									</div>

                                    <div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Batas Usia Kendaraan
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="number"
												class="form-control"
												v-model="form.vehicle_max_year"
												placeholder="Masukkan Batas Usia Kendaraan">
										</div>
									</div>

									<div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Brand yang Didukung
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10">
											<multiselect
                                            v-model="form.supported_brands"
                                            :options="brandList"
                                            track-by="value"
                                            label="text"
                                            placeholder="Pilih Brand yang Didukung"
                                            :multiple="true">
                                                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.text }}</strong> is written in<strong>  {{ option.value }}</strong></template>
                                            </multiselect>
										</div>
									</div>

									<div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Syarat dan Ketentuan
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10" :class="{'is-invalid': $v.form.tnc.$error}">
											<CKEditor
												v-model="form.tnc"
												:state="validateState('tnc')"
												:editor="editor"/>
										</div>
									</div>

									<div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Proses Klaim
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10" :class="{'is-invalid': $v.form.claim.$error}">
											<CKEditor
												v-model="form.claim"
												:state="validateState('claim')"
												:editor="editor"/>
										</div>
									</div>

                                    <div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Nama Perusahaan
											<label class="text-danger">*</label>
										</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="text"
												class="form-control"
												v-model="form.company"
												placeholder="Masukkan Nama Perusahaan"
												required>
										</div>
									</div>

									<div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">File Brosur</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="file"
												name="brochure_file"
												class="form-control"
												v-on:change="onFileChange"/>
										</div>
									</div>

									<div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">File Bengkel</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="file"
												name="workshop_file"
												class="form-control"
												v-on:change="onFileChange"/>
										</div>
									</div>

									<div role="group" class="row form-group mb-3">
										<label class="col-sm-2 col-lg-2 col-form-label">Jumlah Bengkel</label>
										<div class="col-sm-10 col-lg-10">
											<input
												type="number"
												class="form-control"
												v-model="form.workshop_count"
												placeholder="Masukkan Jumlah Bengkel">
										</div>
									</div>

									<button class="btn btn-primary" type="submit">Submit</button>
								</form>
							</div>
						</div>
					<!-- end row -->
					</div>
				</div>
			<!-- end card -->
			</div>
			<!-- end col -->
		</div>
		<!-- end row -->

		<!-- end row -->
  </div>
</template>

<script>
let ClassicEditor

if (process.client) {
    ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
}

import {
    required,
    maxLength,
    minValue,
    maxValue,
    numeric,
} from "vuelidate/lib/validators"
import Multiselect from "vue-multiselect"

import "vue-multiselect/dist/vue-multiselect.min.css"

/**
 * Elements component
 */
export default {
    layout: 'admin',
    data() {
        return {
            title: "Tambah Produk",
			editor: ClassicEditor,
            typeList: [
				{ value: null, text: 'Pilih' },
				{ value: 'comprehensive', text: 'Komprehensif' },
				{ value: 'tlo', text: 'Total Loss Only' },
            ],
            brandList: [],
			form: {
				name: null,
				type: null,
				description: null,
				image: null,
				email: null,
				commission: 0,
				extra_point: 0,
				admin_fee: 0,
				stamp_fee: 0,
                vehicle_max_year: null,
                supported_brands: null,
				tnc: null,
				claim: null,
				company: null,
				workshop_count: null,
			},
			submitted: false,
        };
    },
    head() {
        return {
            title: `${this.title} | Nuxtjs Responsive Bootstrap 5 Admin Dashboard`
        };
    },
    components: {
        Multiselect
    },
    async mounted() {
        this.brandList = await this.vehicleBrands()
    },
	validations: {
        form: {
            name: { required },
            type: { required },
            description: { required },
            image: { required },
            email: { required },
            tnc: { required },
            claim: { required },
            company: { required },
            workshop_count: { numeric },
        },
    },
	methods: {
		validateState(name) {
			const { $dirty, $error } = this.$v.form[name]
			return $dirty ? !$error : null
		},
		onFileChange(e) {
			var files = e.target.files || e.dataTransfer.files

			if (!files.length)
				return

			this.form[e.target.name] = files[0]
		},
        async vehicleBrands() {
            return await this.$axios.$get('api/admin/vehicle/item/brands')
                .then ((response) => {
                    const list = response.data.map(item =>
                        item = { value: item.brand, text: item.brand })

                    return [
                        { value: null, text: 'Pilih Brand' },
                        ...list
                    ]
                })
                .catch ([])
        },
		async submitData(e) {
			e.preventDefault()

			if (this.$v.$touch() || this.$v.form.$anyError) return

			let formData = new FormData()

            this.form.supported_brands = this.form.supported_brands.map(item => item = item.value)

			for (var key of Object.keys(this.form)) {
				if (this.form[key] != null)
					formData.append(key, this.form[key])
			}

			this.$axios.$post('api/admin/product', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
				this.$router.push({ name: 'products' })
            })
		}
	}
};
</script>