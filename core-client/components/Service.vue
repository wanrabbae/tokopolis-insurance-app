<template>
    <component :is="tag" :class="['container', classes]">
        
        <div class="row">
            
            <div v-for="(list, id) in serviceList" :key="id" class="col" style="max-width: 20%;">
                
                <a :href="list.link" class="d-flex flex-column align-items-center border-lg p-lg-3">
                    
                    <b-img-lazy :src="list.image" :alt="list.text" class="service-image" />
                    
                    <div class="text-center mt-lg-3 mt-2">
                        
                        <span class="fs-small fs-lg-5 fw-lg-bold text-dark">{{ list.text }}</span>
                    
                    </div>
                
                </a>
            
            </div> <!-- col-3 ends -->

        </div> <!-- row ends -->
    
    </component>
</template>

<script>
export default {
    name: 'Service',
    props: {
        tag: {
            type: String,
            default: 'div',
            description: 'html tag'
        },
        classes: {
            type: String,
            default: ''
        },
        serviceList: {
            type: Array,
            default: null
        }
    }
}
</script>