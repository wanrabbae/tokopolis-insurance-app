/* eslint-disable prefer-regex-literals */
/* eslint-disable no-useless-escape */
<template>
    
    <b-modal 
      v-bind="$attrs"
      hide-header
      centered
      body-class="p-4"
      @ok="okHandler"
    >
    
      <div class="text-center">
        <h4 class="mb-3">Syarat & Ketentuan</h4>
        <hr>
      </div>
      
      <div style="font-size: 8pt" class="text-justify">
        Dengan ini saya menyatakan bahwa : <br />
        <br />
        <ul>
            <li>Saya mengetahui dan menyetujui pembelian produk asuransi dari PT ASURANSI ABC yang difasilitasi oleh PT Istpro Inti Nusa sebagai Pialang Asuransi pada platform Tokopolis</li>
            <li>Saya mengetahui dan menyetujui ketentuan produk milik PT ASURANSI ABC</li>
            <li>Saya mengetahui dan menyetujui ketentuan dan besaran Risiko Sendiri / Own Risk (Deductible) produk asuransi yang tercantum pada ikhtisar pertanggungan / schedule polis</li>
            <li>Data yang diisikan merupakan data yang menyatakan kebenaran yang sesungguhnya, yang sesuai dengan ketentuan produk asuransi milik PT ASURANSI ABC</li>
            <li>Saya paham dan mengetahui kendaraan yang ditanggung digunakan sebagai rental individual, dalam hal ini digunakan atau dipindah tangankan ke orang lain, perusahaan rekanan Tokopolis kemungkinkan tidak akan menanggung kerugian tesebut; dan Tokopolis maupun perusahaan asuransi rekanan Tokopolis berhak mengumpulkan data terkait hal tersebut</li>
            <li>Saya bersedia datanya digunakan untuk keperluan PT ASURANSI ABC dan/atau Pihak Ketiga yang bekerja sama dengan PT ASURANSI ABC</li>
        </ul>
        <br />
        Jika saya tidak mengindahkan poin-poin diatas, maka saya bersedia untuk menerima konsekuensi yang berlaku, termasuk namun tak terbatas pada keharusan untuk revisi informasi pada polis, kesalahan pengiriman polis atau tidak berlakunya polis
        <br /><br />
        Penutupan asuransi dilakukan berdasarkan itikad baik oleh Para Pihak. Apabila ada keterangan/data/informasi yang diberikan tertanggung pada saat penutupan asuransi tidak sesuai dengan keadaan yang sebenarnya, maka pertanggungan akan batal demi hukum. PT ASURANSI ABC dapat melakukan tuntutan hukum terhadap Tertanggung ataupun pihak-pihak yang terlibat dalam penyampaian keterangan/data/informasi palsu tersebut. Untuk kerusakan yang sudah ada sebelum periode asuransi polis dimulai, kerusakan tersebut tidak bisa diajukan klaim (klaim tidak dapat diproses)

    </div>
        
        <template #modal-footer="{ ok }">

          <BaseButton :disabled="model.name ==''" block @click="ok()">Close</BaseButton>
        
        </template>

    </b-modal>

</template>

<script>
import BaseButton from '../BaseButton'


export default {
  components: { 
    BaseButton
  },
  data () {
    return {
      model: {
        value:'0',
        bank:'Bank Mandiri',
        rekening: '12345678',
        nama_rekening: 'John Doe'
      }
    }
  },
  methods: {
    okHandler(bvModalEvt){
      this.$emit('close')
    }
  }
}
</script>
