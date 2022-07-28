<template>
    <component :is="tag">
        
        <div class="row no-gutters">
            
            <div v-for="(list, id) in serviceList" :key="id" class="col-3">
                
                <a :href="list.link" class="card border-lg p-lg-3">
                    
                    <div class="card-image mb-3">
                        
                        <b-img-lazy :src="list.image" :alt="list.text" />
                    
                    </div>
                    
                    <div class="text-center">
                        
                        <span class="fw-lg-bold text-dark">{{ list.text }}</span>
                    
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
        serviceList: {
            type: Array,
            default: null
        }
    }
}
</script>