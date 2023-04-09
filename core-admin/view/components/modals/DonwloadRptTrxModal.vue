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
        
        <template #modal-footer="{ ok }">

          <button :disabled="model.name ==''" block @click="ok()">Close</button>
        
        </template>

    </b-modal>

</template>

<script>
export default {
  components: { 
    
  },
  data () {
  },
  methods: {
    okHandler(bvModalEvt){
      this.$emit('close')
    }
  }
}
</script>