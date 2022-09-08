<template>
    
    <div 
        class="loading-wrapper d-flex flex-column justify-content-center align-items-center" 
        :class="{ 'show' : show }"
    >

        <slot>
            
            <div class="mb-2">
                
                <b-spinner 
                    v-bind="$attrs" 
                    :type="type" 
                    :variant="variant" 
                    :label="label"
                ></b-spinner>

            </div>

        </slot>

        <slot name="label">

            <div :class="labelClass">
                {{ label }}
            </div>

        </slot>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'grow'
        },
        variant: {
            type: String,
            default: 'primary'
        },
        labelClass: {
            type: String,
            default: "text-white"
        },
        label: {
            type: String,
            default: "Loading"
        }
    }
}
</script>