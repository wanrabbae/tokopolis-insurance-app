<template>
    <b-modal
        v-bind="$attrs"
        modal-class="expansion-modal"
        body-class="py-0"
        scrollable
        @close="closeHandler"
        @ok="okHandler"
    >
        
        <template #modal-header="{ close }">
            
            <h4 class="mb-0">{{ modalTitle }}</h4>

            <div class="pointer" @click="close">
                
                <CloseIcon width="28px"/>
            
            </div>
        
        </template>

        <div 
            v-for="(field, id) in fields" 
            :key="id" 
            class="expansion-option d-flex align-items-center border-bottom py-2"
        >

            <b-form-checkbox 
                v-model="field.checked"
                class="pr-2"
                :disabled="field.disabled || (field.protectionValues && field.selectedProtectionValues == null) || (field.protectionValues && !field.selectedProtectionValues && field.numOfPeople && !field.selectedNumOfPeople)"
                @change="(checked) => onExpansionFieldChange(field)"
            />
            
            <div class="flex-grow-1">
                
                <div class="mb-1">
                    <span>{{ field.label }}</span>
                </div>

                <b-form-select 
                    v-if="field.protectionValues"
                    v-model="field.selectedProtectionValues"
                    :class="field.numOfPeople ? 'mb-2' : 'mb-1'"
                >
                    
                    <b-form-select-option :value="null">Pilih Nilai Perlindungan</b-form-select-option>
                    
                    <b-form-select-option 
                        v-for="(val, i) of field.protectionValues"
                        :key="val.text"
                        :value="i"
                    >
                        {{ formatPrice(val.text) }}
                    </b-form-select-option>
                
                </b-form-select>

                <b-form-radio-group
                    v-if="field.selectedProtectionValues != null && field.numOfPeople"
                    v-model="field.selectedNumOfPeople"
                    button-variant="primary"
                    buttons
                    class="mb-1"
                >
                    
                    <b-form-radio 
                        v-for="(num, numId) of field.numOfPeople" 
                        :key="numId" 
                        :value="num"
                    >
                        {{ num }}
                    </b-form-radio>

                </b-form-radio-group>

                <div v-if="(!field.protectionValues && !field.numOfPeople)" class="d-block">
                    <span class="text-primary">{{ formatPrice(field.price) }}</span>
                </div>
                
                <div v-if="(field.protectionValues && field.selectedProtectionValues != null && !field.numOfPeople)" class="d-block">
                    <span class="text-primary">{{ formatPrice(field.protectionValues[field.selectedProtectionValues].value) }}</span>
                </div>

                <div v-if="(field.protectionValues && field.selectedProtectionValues != null && field.numOfPeople && field.selectedNumOfPeople)" class="d-block">
                    <span class="text-primary">{{ formatPrice(field.protectionValues[field.selectedProtectionValues].value * field.selectedNumOfPeople) }}</span>
                </div>

            </div> <!-- flex-grow-1 ends -->

        </div> <!-- expansion-option ends -->

        <template #modal-footer="{ ok }">

            <BaseButton block @click="ok()">Tambahkan</BaseButton>
        
        </template>

    </b-modal>

</template>

<script>
import CloseIcon from '../assets/svg/close.svg'
import BaseButton from './BaseButton'

export default {
    components: { 
        BaseButton,
        CloseIcon 
    },
    props: {
        modalTitle: {
            type: String,
            default: "Perluasan Resiko Tambahan"
        },
        fields: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
            expansionData: [],
        }
    },
    methods: {
        onExpansionFieldChange(field) {
            this.$emit('change', field);
        },
        closeHandler() {
            this.$emit('close')
        },
        okHandler() {
            this.expansionData = [];
            this.fields.forEach((field, index) => {
                if(field.checked && !field.disabled) {

                    let data = {
                        key: field.key,
                        label: field.label
                    }

                    if(field.selectedProtectionValues != null && field.selectedNumOfPeople) {
                        data = {
                            ...data,
                            selectedValue: field.protectionValues[field.selectedProtectionValues].text,
                            numOfPeople: field.selectedNumOfPeople,
                            price: field.protectionValues[field.selectedProtectionValues].value * field.selectedNumOfPeople
                        }
                    } else if(field.selectedProtectionValues != null) {
                        data = {
                            ...data,
                            selectedValue: field.protectionValues[field.selectedProtectionValues].text,
                            price: field.protectionValues[field.selectedProtectionValues].value
                        }
                    } else {
                        data = {
                            ...data,
                            price: field.price
                        }
                    }

                    this.expansionData = [...this.expansionData, data];
                }
            });

            this.$emit('submit', this.expansionData)
        }
    }
}
</script>
