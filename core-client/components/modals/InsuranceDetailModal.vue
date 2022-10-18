/* eslint-disable prefer-regex-literals */
/* eslint-disable no-useless-escape */
<template>
    
    <b-modal 
      v-bind="$attrs"
      hide-header
      hide-footer
      centered
      body-class="p-4"
    >

      <div class="text-center">
        <h4 class="mb-3">Detail Pemegang Polis</h4>
      </div>

      <ValidationObserver v-slot="{ invalid }">
        
        <b-form role="form" method="post" @submit.prevent="doOffer">
            
            <BaseInput
              v-model="model.name"
              name="Nama"
              placeholder="Josua Jostar"
              rules="required"
            />
            <BaseInput
              v-model="model.phone"
              name="Phone"
              placeholder="+62812345678"
            />
            <BaseInput
              v-model="model.email"
              name="Email"
              placeholder="user@gmail.com"
            />

            <BaseButton native-type="submit" class="mb-3" :disabled="invalid" block>
                Buat Penawaran
            </BaseButton>

        </b-form>

      </ValidationObserver>

    </b-modal>

</template>

<script>
import { ValidationObserver } from 'vee-validate'
import BaseInput from '../Inputs/BaseInput.vue'
import BaseButton from '../BaseButton'


export default {
  components: { 
    BaseInput, 
    BaseButton, 
    ValidationObserver
  },
  props:{
    exp:{
      type: Array,
      default:null
    },
    productId:{
      type: Number,
      default:null
    },
    discountType:{
      type: String,
      default:null
    },
    discountAmount:{
      type:Number,
      default:null
    },
    discountPercentage:{
      type:Number,
      default:null
    }
  },
  data () {
    return {
      model: {
        name:'',
        phone:null,
        email: null,
      }
    }
  },
  methods: {
      doOffer() {
        const discountType = this.discountType
        this.$axios.$post(`api/transaction/offer`, {
                fullname:this.model.name,
                phone:this.model.phone,
                email:this.model.email,
                product_id: this.productId,
                exp: this.exp,
                discount_format: discountType,
                discount_total: discountType === 'amount' ? this.discountAmount :
                    this.discountPercentage
            })
            .then(function(response) {
              console.log(response)
            })
      // masukkan fungsi login di sini
      
    }
  }
}
</script>
