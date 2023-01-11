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
    
        <div class="text-left">
            <h4 class="mb-3">Bagikan Polis</h4>
            <hr>
        </div>

        <div>
            <p>Bagikan link via</p>
            <p>
                <div class="row">
                    <div class="col-md-2">
                        <div class="border rounded-circle border-success p-2">
                            <ShareNetwork
                                network="whatsapp"
                                url="https://tokopolis.id/"
                                title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
                                description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
                            >
                                <img src="/img/whatsapp.png" width="50px" height="50px"/>
                            </ShareNetwork>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="border rounded-circle border-danger p-2">
                            <ShareNetwork
                                network="email"
                                url="https://tokopolis.id/"
                                title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
                                description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
                            >
                                <img src="/img/gmail.png" width="50px" height="50px"/>
                            </ShareNetwork>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="border rounded-circle border-success p-2">
                            <ShareNetwork
                                network="line"
                                url="https://tokopolis.id/"
                                title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
                                description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
                            >
                                <img src="/img/line.png" width="50px" height="50px"/>
                            </ShareNetwork>
                        </div>
                    </div>
                </div>
            </p>
            <p class="mt-3">Copy Link</p>
            <p>
                <div class="input-group mb-3">
                    <span class="input-group-text rounded-0 border-right-0">
                        <img src="/img/link.png" width="15px" height="15px" />
                    </span>
                    <input type="text" class="form-control border-left-0" readonly value="https://tokopolis.id/">
                    <button class="btn btn-primary rounded-0">Copy</button>
                </div>
            </p>
            <p class="mt-3">Atau Cetak Pdf</p>
            <p>
                <div class="row">
                    <div class="col-md-2">
                        <div class="border rounded-circle border-danger p-2 bg-danger">
                            <img src="/img/pdf.png" width="50px" height="50px"/>
                        </div>
                    </div>
                </div>
            </p>
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