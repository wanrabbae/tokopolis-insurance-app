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
										  <label class="col-sm-2 col-lg-2 col-form-label">Gambar  <i>(Format .jpg)</i>
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
<<<<<<< HEAD
											  <!-- <input
=======
											  <input
>>>>>>> af4f2a0419116d69cde64c5867c071158ea8acf6
												  type="text"
												  class="form-control"
												  v-model="form.email"
												  placeholder="Masukkan Email (Pisahkan dengan ; untuk lebih dari 1 email)"
<<<<<<< HEAD
												  required> -->
												  <VueTagsInput
													v-model="tag"
													:tags="form.email"
													@tags-changed="newTags => form.email = newTags"
													placeholder="Input an email, click enter for multiple emails"
													/>
=======
												  required>
>>>>>>> af4f2a0419116d69cde64c5867c071158ea8acf6
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
											  <Multiselect
											  v-model="form.supported_brands"
											  :options="brandList"
											  track-by="value"
											  label="text"
											  placeholder="Pilih Brand yang Didukung"
											  :multiple="true">
												  <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.text }}</strong> is written in<strong>  {{ option.value }}</strong></template>
											  </Multiselect>
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
										  <label class="col-sm-2 col-lg-2 col-form-label">File Brosur <i>(Format PDF)</i></label>
										  <div class="col-sm-10 col-lg-10">
											  <input
												  type="file"
												  name="brochure_file"
												  class="form-control"
												  v-on:change="onFileChange"/>
										  </div>
									  </div>
  
									  <div role="group" class="row form-group mb-3">
										  <label class="col-sm-2 col-lg-2 col-form-label">File Bengkel <i>(Format PDF)</i></label>
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
  
  import {
	  required,
	  maxLength,
	  minValue,
	  maxValue,
	  numeric,
  } from "vuelidate/lib/validators"
<<<<<<< HEAD
  import VueTagsInput from '@johmun/vue-tags-input';
  import Multiselect from 'vue-multiselect'
=======
  import Multiselect from "vue-multiselect"
  
>>>>>>> af4f2a0419116d69cde64c5867c071158ea8acf6
  import "vue-multiselect/dist/vue-multiselect.min.css"

  let ClassicEditor
  
  if (process.client) {
<<<<<<< HEAD
		ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
=======
	  ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
>>>>>>> af4f2a0419116d69cde64c5867c071158ea8acf6
  }
  
  /**
   * Elements component
   */
  export default {
<<<<<<< HEAD
	components: {
		VueTagsInput,
		Multiselect
	},
	  layout: 'admin',
	  data() {
		  return {
				tag: '',
      	tags: [],
=======
	  layout: 'admin',
	  data() {
		  return {
>>>>>>> af4f2a0419116d69cde64c5867c071158ea8acf6
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
<<<<<<< HEAD
				  email: this.tags,
=======
				  email: null,
>>>>>>> af4f2a0419116d69cde64c5867c071158ea8acf6
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
<<<<<<< HEAD
=======
	  components: {
		  Multiselect
	  },
>>>>>>> af4f2a0419116d69cde64c5867c071158ea8acf6
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
<<<<<<< HEAD
		getEmailInputs(inputs) {
			this.form.email = inputs
		},
=======
>>>>>>> af4f2a0419116d69cde64c5867c071158ea8acf6
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
  
			  // if (this.$v.$touch() || this.$v.form.$anyError) return
			
			  let formData = new FormData()
  
			  let supportedBrands = this.form.supported_brands.map(item => item = item.value)
<<<<<<< HEAD
			  /* let arrEmail = [];
			  if (this.form.email !== "" && this.form.email !== null && this.form.email !== undefined) {
				arrEmail = this.form.email.split(';') */
			  // }
=======
			  let arrEmail = [];
			  if (this.form.email !== "" && this.form.email !== null && this.form.email !== undefined) {
				arrEmail = this.form.email.split(';')
			  }
>>>>>>> af4f2a0419116d69cde64c5867c071158ea8acf6
  
			  for (var key of Object.keys(this.form)) {
				  if (this.form[key] != null)
  
					  if (key === 'email') {
<<<<<<< HEAD
							for (let i = 0; i < this.form[key].length; i++) {
								formData.append('email[]', this.form[key][i].text);
							}
					  } else if (key === 'supported_brands') {
							formData.append(key, supportedBrands)
=======
						for (let i = 0; i < arrEmail.length; i++) {
							formData.append('email[]', arrEmail[i].trim());
						}
					  } else if (key === 'supported_brands') {
						formData.append(key, supportedBrands)
>>>>>>> af4f2a0419116d69cde64c5867c071158ea8acf6
					  } else {
						  formData.append(key, this.form[key])
					  }
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
<<<<<<< HEAD
	<style>
		.vue-tags-input {
			width: 100% !important;
			max-width: 100% !important;
		}
	</style>
=======
>>>>>>> af4f2a0419116d69cde64c5867c071158ea8acf6
