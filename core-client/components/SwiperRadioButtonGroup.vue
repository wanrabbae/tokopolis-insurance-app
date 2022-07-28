<template>
    <div v-swiper:radioButtonGroup="swiperOption" class="swiper mb-4">
        <div  
            role="radiogroup" 
            tabindex="-1" 
            class="swiper-wrapper btn-group btn-group-toggle"
            v-bind="$attrs"
        >
            <label 
                v-for="(option, id) in options" 
                :key="id"
                class="swiper-slide btn" 
                :class="[
                    { [`btn-${buttonVariant}`]: buttonVariant }, 
                    { ['active'] : !value ? !option.value : value === option.value },
                    inputClass
                ]"
            >
                <input 
                    :id="$attrs.name + '-option-' + id" 
                    type="radio" 
                    :name="$attrs.name"
                    :checked="!value ? !option.value : value === option.value"
                    :value="option.value"
                    @input="handleInput"
                    @change="handleChange"
                >
                <span>{{ option.text }}</span>
            </label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BrandCarousel',
    props: {
        value: {
            type: String,
            default: null
        },
        buttonVariant: {
            type: String,
            default: 'primary'
        },
        inputClass: {
            type: String,
            default: 'mr-2'
        },
        options: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
            swiperOption: {
                slidesPerView: 'auto',
                freeMode: true,
            }
        }
    },
    methods: {
        handleInput(event) {
            this.$emit('input', event.target.value)
        },
        handleChange(event) {
            this.$emit('change', event.target.value)
        }
    }
}
</script>