<template>
    
    <b-modal
        v-bind="$attrs"
        centered
        scrollable
        body-class="py-0"
        footer-class="flex-column"
        @close="closeHandler"
        @ok="okHandler"
    >
        
        <template #modal-header="{ close }">
            
            <h4 class="mb-0">{{ modalTitle }}</h4>

            <div class="pointer" @click="close">
                
                <CloseIcon width="28px"/>
            
            </div>
            
        </template>

        <div class="text-center py-3 border-bottom">
            
            <div class="fw-bold">Pilih Aksesoris Mobil Anda</div>

            <div>Maksimum 10% dari harga kendaraan</div>
        
        </div>

        <b-form-group>
            
            <div v-for="(field, id) in fields" :key="id" class="py-3 border-bottom">
                
                <b-form-checkbox v-model="field.checked" class="checkbox-centered">
                    
                    <span>{{ field.label }}</span>
                
                </b-form-checkbox>
                
                <b-collapse :visible="field.checked" class="mt-3">
                    
                    <BaseInput
                        v-model="field.brand"
                        name="Merk"
                        placeholder="Merk"
                    />

                    <BaseInput
                        v-model="field.type"
                        name="Tipe"
                        placeholder="Tipe"
                    />

                    <BaseInputPrice
                        v-model="field.price"
                        name="Harga"
                        placeholder="Harga"
                    />

                </b-collapse>

            </div>

        </b-form-group>

        <template #modal-footer="{ ok }">

            <div class="d-flex justify-content-between w-100 mb-3">
            
                <span class="fw-bold">Harga Aksesoris</span>

                <span class="text-primary fw-bold">{{ formatPrice(totalAccessoriesPrice) }}</span>
            
            </div>

            <BaseButton block :disabled="disableSubmitButton" @click="ok()">Tambahkan</BaseButton>

        </template>

    </b-modal>

</template>

<script>
import BaseInput from '../components/Inputs/BaseInput'
import BaseInputPrice from '../components/Inputs/BaseInputPrice'
import CloseIcon from '../assets/svg/close.svg'
import BaseButton from './BaseButton'

export default {
    components: {
        BaseInput,
        BaseInputPrice,
        CloseIcon,
        BaseButton
    },
    props: {
        modalTitle: {
            type: String,
            default: "Aksesoris Mobil"
        },
        maxPrice: {
            type: Number,
            default: null
        },
        fields: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
            accessoriesData: []
        }
    },
    computed: {
        totalAccessoriesPrice() {
            let total = 0

            if(this.fields === null) {
                return 0
            }
            
            this.fields.forEach((field) => {
                if(field.checked && field.price !== null) {
                    total += this.formatNumber(field.price)
                }
            })
            
            return total
        },
        disableSubmitButton(){
            if(this.fields === null) {
                return true
            }

            this.fields.forEach((field) => {
                if (field.checked && (!field.brand || !field.type || !field.price)) {
                    return true
                }
            })

            return this.totalAccessoriesPrice > this.maxPrice || this.totalAccessoriesPrice === 0 
        },
    },
    methods: {
        closeHandler() {
            this.$emit('close')
        },
        okHandler() {
            this.accessoriesData = [];
            
            this.fields.forEach((field) => {
                if(field.checked) {
                    const data = {
                        key: field.key,
                        label: field.label,
                        brand: field.brand,
                        type: field.type,
                        price: this.formatNumber(field.price)
                    }
                    this.accessoriesData = [...this.accessoriesData, data];
                    
                }
            });

            this.$emit('submit', this.accessoriesData, this.totalAccessoriesPrice)
        },
        formatNumber(value){
            if (value == null) {
                return 0
            }

            return parseInt(value.toString().replace(/[^\d]/g, ''))
        },
    }
}
</script>